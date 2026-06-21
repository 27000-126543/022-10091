import { create } from 'zustand'

interface FilterState {
  selectedFilters: Record<string, string[]>
  excludeSensitive: boolean
  resultCount: number
  setSelectedFilters: (filters: Record<string, string[]>) => void
  toggleFilter: (groupId: string, optionName: string) => void
  setExcludeSensitive: (val: boolean) => void
  setResultCount: (count: number) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedFilters: {},
  excludeSensitive: true,
  resultCount: 0,
  setSelectedFilters: (filters) => set({ selectedFilters: filters }),
  toggleFilter: (groupId, optionName) =>
    set((state) => {
      const current = state.selectedFilters[groupId] || []
      const next = current.includes(optionName)
        ? current.filter((n) => n !== optionName)
        : [...current, optionName]
      return { selectedFilters: { ...state.selectedFilters, [groupId]: next } }
    }),
  setExcludeSensitive: (val) => set({ excludeSensitive: val }),
  setResultCount: (count) => set({ resultCount: count }),
  resetFilters: () => set({ selectedFilters: {}, resultCount: 0 })
}))
