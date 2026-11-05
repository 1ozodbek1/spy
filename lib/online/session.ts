import type { DataConnection, Peer } from "peerjs"
import { builtinCategories } from "@/data/categories"
import type { StringKey } from "@/data/translations"
import { assignRoles, pickRound, tally, type Role } from "@/lib/game-logic"
import { useCategoriesStore } from "@/store/categories-store"
import { useLanguageStore } from "@/store/language-store"
import { freshOnline, useOnlineStore, type OnlinePlayer, type OnlineResults } from "@/store/online-store"
import { maxSpies } from "@/store/players-store"
import { useSettingsStore } from "@/store/settings-store"

/*
 * Backendsiz onlayn rejim: WebRTC (PeerJS). Xona egasining telefoni "server" vazifasini bajaradi:
 * rollar, so‘z va ovozlar faqat unda hisoblanadi, har bir o‘yinchiga faqat o‘ziga tegishli ma’lumot yuboriladi.
 */

const PREFIX = "spy-room-"
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
export const MAX_ONLINE = 12
export const MIN_ONLINE = 3

type GuestMsg = { t: "hello"; name: string } | { t: "ready" } | { t: "vote"; target: string }

type HostMsg =
  | { t: "lobby"; players: OnlinePlayer[]; you: string }
  | { t: "role"; role: Role; categoryName: string; word: string | null; hint: string | null; seconds: number; total: number }
  | { t: "progress"; ready: number; total: number }
  | { t: "playing"; left: number }
  | { t: "tick"; left: number }
  | { t: "voting"; candidates: OnlinePlayer[]; total: number }
  | { t: "votes"; done: number; total: number }
  | { t: "results"; results: OnlineResults }
  | { t: "error"; key: "onlineFull" | "onlineStarted" | "onlineKicked" }

type HostPlayer = { id: string; name: string; connected: boolean }

type HostState = {
  phase: "lobby" | "reveal" | "playing" | "voting" | "results"
  players: HostPlayer[]
  roles: Record<string, Role>
  ready: Set<string>
  votes: Record<string, string>
  word: string
  hint: string | null
  categoryName: string
  seconds: number
  left: number
  timer: ReturnType<typeof setInterval> | null
}

let peer: Peer | null = null
let hostConn: DataConnection | null = null
const conns = new Map<string, DataConnection>()
let H: HostState | null = null
let gen = 0

const put = (patch: Partial<typeof freshOnline>) => useOnlineStore.setState(patch)

function cleanup() {
  gen++
  if (H?.timer) clearInterval(H.timer)
  H = null
  conns.forEach((c) => c.close())
  conns.clear()
  hostConn?.close()
  hostConn = null
  peer?.destroy()
  peer = null
}

export function leave() {
  cleanup()
  put({ ...freshOnline })
}

function fail(key: StringKey) {
  cleanup()
  put({ ...freshOnline, error: key })
}

// ---------- umumiy qabul qilgich (mehmonlar tarmoqdan, xona egasi o‘zi uchun ichkaridan chaqiradi) ----------
function applyMsg(msg: HostMsg) {
  switch (msg.t) {
    case "lobby":
      put({ status: "lobby", players: msg.players, meId: msg.you, role: null, results: null, ready: false, voted: false })
      break
    case "role":
      put({
        status: "reveal",
        role: { role: msg.role, categoryName: msg.categoryName, word: msg.word, hint: msg.hint, seconds: msg.seconds },
        ready: false, readyCount: 0, total: msg.total,
      })
      break
    case "progress":
      put({ readyCount: msg.ready, total: msg.total })
      break
    case "playing":
      put({ status: "playing", left: msg.left })
      break
    case "tick":
      put({ left: msg.left })
      break
    case "voting":
      put({ status: "voting", candidates: msg.candidates, voted: false, votedCount: 0, total: msg.total })
      break
    case "votes":
      put({ votedCount: msg.done, total: msg.total })
      break
    case "results":
      put({ status: "results", results: msg.results })
      break
    case "error":
      fail(msg.key)
      break
  }
}

function sendTo(id: string, msg: HostMsg) {
  if (id === "host") return applyMsg(msg)
  const c = conns.get(id)
  if (c?.open) c.send(msg)
}

const active = () => (H ? H.players.filter((p) => p.connected) : [])
const broadcast = (build: (id: string) => HostMsg) => active().forEach((p) => sendTo(p.id, build(p.id)))

function pushLobby() {
  if (!H) return
  const list: OnlinePlayer[] = active().map((p) => ({ id: p.id, name: p.name, host: p.id === "host" }))
  broadcast((id) => ({ t: "lobby", players: list, you: id }))
}

const uniqueName = (raw: string, taken: string[]) => {
  const base = raw.trim().slice(0, 18) || "?"
  let name = base
  let n = 2
  while (taken.some((t) => t.toLowerCase() === name.toLowerCase())) name = `${base} ${n++}`
  return name
}

// ---------- xona egasi ----------
export async function createRoom(name: string) {
  cleanup()
  const my = gen
  put({ ...freshOnline, status: "connecting", isHost: true })
  const { Peer } = await import("peerjs")
  if (my !== gen) return

  for (let attempt = 0; attempt < 4; attempt++) {
    const code = Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("")
    try {
      const p = await new Promise<Peer>((resolve, reject) => {
        const candidate = new Peer(PREFIX + code)
        candidate.on("open", () => resolve(candidate))
        candidate.on("error", (err) => {
          candidate.destroy()
          reject(err)
        })
      })
      if (my !== gen) {
        p.destroy()
        return
      }
      peer = p
      p.on("disconnected", () => !p.destroyed && p.reconnect())
      p.on("connection", onGuest)
      const hostName = name.trim().slice(0, 18) || "?"
      H = {
        phase: "lobby", players: [{ id: "host", name: hostName, connected: true }],
        roles: {}, ready: new Set(), votes: {}, word: "", hint: null, categoryName: "", seconds: 300, left: 0, timer: null,
      }
      put({ code, meId: "host", isHost: true, spies: 1 })
      pushLobby()
      return
    } catch (err) {
      if ((err as { type?: string }).type === "unavailable-id") continue
      if (my === gen) fail("onlineFailed")
      return
    }
  }
  if (my === gen) fail("onlineFailed")
}

function onGuest(conn: DataConnection) {
  let joined = false
  const id = conn.peer

  conn.on("data", (raw) => {
    const m = raw as GuestMsg
    if (!H) return
    if (m.t === "hello") {
      if (joined) return
      if (H.phase !== "lobby") return reject(conn, "onlineStarted")
      if (active().length >= MAX_ONLINE) return reject(conn, "onlineFull")
      joined = true
      conns.set(id, conn)
      H.players.push({ id, name: uniqueName(m.name, H.players.map((p) => p.name)), connected: true })
      pushLobby()
      return
    }
    if (!joined) return
    if (m.t === "ready") handleReady(id)
    if (m.t === "vote") handleVote(id, m.target)
  })
  conn.on("close", () => joined && handleLeave(id))
  conn.on("error", () => joined && handleLeave(id))
}

function reject(conn: DataConnection, key: "onlineFull" | "onlineStarted") {
  conn.send({ t: "error", key } satisfies HostMsg)
  setTimeout(() => conn.close(), 400)
}

function handleLeave(id: string) {
  if (!H) return
  conns.delete(id)
  const p = H.players.find((x) => x.id === id)
  if (!p) return
  if (H.phase === "lobby") H.players = H.players.filter((x) => x.id !== id)
  else p.connected = false
  if (H.phase === "lobby") pushLobby()
  else if (H.phase === "reveal") checkReady()
  else if (H.phase === "voting") checkVotes()
}

export function kickPlayer(id: string) {
  const c = conns.get(id)
  if (!H || H.phase !== "lobby" || !c) return
  c.send({ t: "error", key: "onlineKicked" } satisfies HostMsg)
  setTimeout(() => c.close(), 300)
  handleLeave(id)
}

export function hostStart(spies: number): StringKey | null {
  if (!H || H.phase !== "lobby") return null
  const players = active()
  if (players.length < MIN_ONLINE) return "needThree"

  const { selected, duration, spyHint } = useSettingsStore.getState()
  const all = [...builtinCategories, ...useCategoriesStore.getState().custom]
  const pool = all.filter((c) => selected.includes(c.id))
  if (!pool.length) return "errNoCategory"
  const round = pickRound(pool, useLanguageStore.getState().lang)
  if (!round) return "errNoWords"

  const spyCount = Math.min(Math.max(1, spies), maxSpies(players.length))
  H.roles = assignRoles(players.map((p) => ({ id: p.id, name: p.name, tone: 0 })), spyCount)
  H.word = round.word.word
  H.hint = spyHint ? (round.word.hint ?? null) : null
  H.categoryName = round.category.name[useLanguageStore.getState().lang]
  H.seconds = duration * 60
  H.phase = "reveal"
  H.ready = new Set()
  H.votes = {}

  const h = H
  players.forEach((p) => {
    const isSpy = h.roles[p.id] === "spy"
    sendTo(p.id, {
      t: "role", role: h.roles[p.id], categoryName: h.categoryName,
      word: isSpy ? null : h.word, hint: isSpy ? h.hint : null, seconds: h.seconds, total: players.length,
    })
  })
  return null
}

function handleReady(id: string) {
  if (!H || H.phase !== "reveal") return
  H.ready.add(id)
  checkReady()
}

function checkReady() {
  if (!H || H.phase !== "reveal") return
  const list = active()
  const done = list.filter((p) => H!.ready.has(p.id)).length
  broadcast(() => ({ t: "progress", ready: done, total: list.length }))
  if (done >= list.length) startPlaying()
}

function startPlaying() {
  if (!H) return
  const h = H
  h.phase = "playing"
  h.left = h.seconds
  broadcast(() => ({ t: "playing", left: h.left }))
  h.timer = setInterval(() => {
    h.left -= 1
    broadcast(() => ({ t: "tick", left: h.left }))
    if (h.left <= 0) startVoting()
  }, 1000)
}

export function hostToVoting() {
  if (H?.phase === "playing") startVoting()
}

function startVoting() {
  if (!H) return
  if (H.timer) clearInterval(H.timer)
  H.timer = null
  H.phase = "voting"
  H.votes = {}
  const list = active()
  const candidates: OnlinePlayer[] = list.map((p) => ({ id: p.id, name: p.name }))
  broadcast(() => ({ t: "voting", candidates, total: list.length }))
}

function handleVote(id: string, target: string) {
  if (!H || H.phase !== "voting" || id === target || H.votes[id]) return
  if (!H.players.some((p) => p.id === target)) return
  H.votes[id] = target
  checkVotes()
}

function checkVotes() {
  if (!H || H.phase !== "voting") return
  const list = active()
  const done = list.filter((p) => H!.votes[p.id]).length
  broadcast(() => ({ t: "votes", done, total: list.length }))
  if (done >= list.length) finish()
}

function finish() {
  if (!H) return
  const outcome = tally(H.votes, H.roles)
  const results: OnlineResults = {
    ...outcome,
    roles: H.roles,
    players: H.players.map((p) => ({ id: p.id, name: p.name })),
    word: H.word, hint: H.hint, categoryName: H.categoryName,
  }
  H.phase = "results"
  broadcast(() => ({ t: "results", results }))
}

export function hostNewRound() {
  if (!H || H.phase !== "results") return
  H.players = H.players.filter((p) => p.connected)
  H.phase = "lobby"
  H.roles = {}
  H.votes = {}
  pushLobby()
}

// ---------- mehmon ----------
export async function joinRoom(rawCode: string, name: string) {
  cleanup()
  const my = gen
  const code = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (code.length !== 6) return put({ ...freshOnline, error: "onlineNotFound" })
  put({ ...freshOnline, status: "connecting", code })

  const { Peer } = await import("peerjs")
  if (my !== gen) return

  const p = new Peer()
  peer = p
  const timeout = setTimeout(() => my === gen && fail("onlineFailed"), 15000)

  p.on("error", (err) => {
    clearTimeout(timeout)
    if (my === gen) fail(err.type === "peer-unavailable" ? "onlineNotFound" : "onlineFailed")
  })
  p.on("open", () => {
    const c = p.connect(PREFIX + code, { reliable: true })
    hostConn = c
    c.on("open", () => {
      clearTimeout(timeout)
      c.send({ t: "hello", name: name.trim().slice(0, 18) || "?" } satisfies GuestMsg)
    })
    c.on("data", (m) => my === gen && applyMsg(m as HostMsg))
    c.on("close", () => {
      if (my === gen && useOnlineStore.getState().status !== "idle") fail("onlineHostLeft")
    })
  })
}

// ---------- o‘yinchi harakatlari ----------
export function sendReady() {
  put({ ready: true })
  if (useOnlineStore.getState().isHost) handleReady("host")
  else hostConn?.send({ t: "ready" } satisfies GuestMsg)
}

export function sendVote(target: string) {
  put({ voted: true })
  if (useOnlineStore.getState().isHost) handleVote("host", target)
  else hostConn?.send({ t: "vote", target } satisfies GuestMsg)
}
