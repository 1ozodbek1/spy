"use client"

import { useMemo } from "react"
import { builtinCategories, type Category } from "@/data/categories"
import { useCategoriesStore } from "@/store/categories-store"

export function useAllCategories(): Category[] {
  const custom = useCategoriesStore((s) => s.custom)
  return useMemo(() => [...builtinCategories, ...custom], [custom])
}
