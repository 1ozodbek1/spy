export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/bg-city.svg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,10,18,.85)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-bg to-transparent" />
      <div className="drift absolute -left-24 top-1/3 size-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="drift absolute -right-24 bottom-10 size-80 rounded-full bg-fuchsia-600/15 blur-3xl [animation-delay:-6s]" />
    </div>
  )
}
