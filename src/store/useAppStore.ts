import { create } from 'zustand'
import type { Customer } from '@/types/customer'
import type { LabelGroup } from '@/types/label'
import type { ContentItem } from '@/types/content'
import type { Campaign } from '@/types/campaign'
import { mockCustomers } from '@/data/customers'
import { mockLabelGroups } from '@/data/labels'
import { mockCampaigns } from '@/data/campaigns'
import { mockContents } from '@/data/contents'

interface SelectedContent {
  items: ContentItem[]
  couponIds: string[]
}

interface AppState {
  customers: Customer[]
  labelGroups: LabelGroup[]
  campaigns: Campaign[]
  selectedFilters: Record<string, string[]>
  excludeSensitive: boolean
  selectedContent: SelectedContent
  activePreset: string | null

  toggleFilter: (groupId: string, optionName: string) => void
  setFilters: (filters: Record<string, string[]>) => void
  resetFilters: () => void
  setExcludeSensitive: (val: boolean) => void
  setActivePreset: (id: string | null) => void

  setSelectedContent: (content: SelectedContent) => void
  clearSelectedContent: () => void

  addCampaign: (campaign: Campaign) => void

  markCustomerUnsubscribed: (customerId: string) => void

  getFilteredCustomers: () => Customer[]
  getFilterSummary: () => string
}

export const useAppStore = create<AppState>((set, get) => ({
  customers: mockCustomers,
  labelGroups: JSON.parse(JSON.stringify(mockLabelGroups)),
  campaigns: [...mockCampaigns],
  selectedFilters: {},
  excludeSensitive: true,
  selectedContent: { items: [], couponIds: [] },
  activePreset: null,

  toggleFilter: (groupId, optionName) => {
    set((state) => {
      const current = state.selectedFilters[groupId] || []
      const isSelected = current.includes(optionName)
      const next = isSelected
        ? current.filter((n) => n !== optionName)
        : [...current, optionName]

      const newFilters = { ...state.selectedFilters, [groupId]: next }
      if (next.length === 0) delete newFilters[groupId]

      const newLabelGroups = state.labelGroups.map((g) => {
        if (g.id !== groupId) return g
        return {
          ...g,
          options: g.options.map((o) => ({
            ...o,
            selected: o.name === optionName ? !isSelected : o.selected
          }))
        }
      })

      return {
        selectedFilters: newFilters,
        labelGroups: newLabelGroups,
        activePreset: null
      }
    })
  },

  setFilters: (filters) => {
    set((state) => {
      const newLabelGroups = state.labelGroups.map((g) => ({
        ...g,
        options: g.options.map((o) => ({
          ...o,
          selected: (filters[g.id] || []).includes(o.name)
        }))
      }))
      return { selectedFilters: filters, labelGroups: newLabelGroups }
    })
  },

  resetFilters: () => {
    set((state) => {
      const newLabelGroups = state.labelGroups.map((g) => ({
        ...g,
        options: g.options.map((o) => ({ ...o, selected: false }))
      }))
      return { selectedFilters: {}, labelGroups: newLabelGroups, activePreset: null }
    })
  },

  setExcludeSensitive: (val) => set({ excludeSensitive: val }),
  setActivePreset: (id) => set({ activePreset: id }),

  setSelectedContent: (content) => set({ selectedContent: content }),
  clearSelectedContent: () => set({ selectedContent: { items: [], couponIds: [] } }),

  addCampaign: (campaign) => {
    set((state) => ({
      campaigns: [campaign, ...state.campaigns]
    }))
  },

  markCustomerUnsubscribed: (customerId) => {
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId
          ? { ...c, unsubscribed: true, tags: c.tags.some((t) => t.name === '已退订') ? c.tags : [...c.tags, { id: `unsub_${c.id}`, name: '已退订', type: 'custom' as const, color: '#EF4444' }] }
          : c
      )
    }))
  },

  getFilteredCustomers: () => {
    const state = get()
    let filtered = state.customers

    const projectFilters = state.selectedFilters['project'] || []
    const stageFilters = state.selectedFilters['stage'] || []
    const priceFilters = state.selectedFilters['price'] || []
    const activityFilters = state.selectedFilters['activity'] || []

    if (projectFilters.length > 0) {
      filtered = filtered.filter((c) => c.consultProjects.some((p) => projectFilters.includes(p)))
    }
    if (stageFilters.length > 0) {
      filtered = filtered.filter((c) => stageFilters.includes(c.surgeryStage))
    }
    if (priceFilters.length > 0) {
      filtered = filtered.filter((c) => priceFilters.includes(c.priceSensitivity))
    }
    if (activityFilters.length > 0) {
      filtered = filtered.filter((c) => activityFilters.includes(c.activityLevel))
    }
    if (state.excludeSensitive) {
      filtered = filtered.filter((c) => !c.isSensitive && !c.unsubscribed)
    }
    if (state.activePreset === 'fp1') {
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      const cutoff = threeMonthsAgo.toISOString().split('T')[0]
      filtered = filtered.filter((c) => c.createdAt >= cutoff && c.totalSpent === 0)
    }
    return filtered
  },

  getFilterSummary: () => {
    const state = get()
    const parts: string[] = []
    const projectFilters = state.selectedFilters['project'] || []
    const stageFilters = state.selectedFilters['stage'] || []
    const priceFilters = state.selectedFilters['price'] || []
    const activityFilters = state.selectedFilters['activity'] || []

    if (projectFilters.length > 0) parts.push('咨询' + projectFilters.join('/'))
    if (stageFilters.length > 0) parts.push(stageFilters.join('/'))
    if (priceFilters.length > 0) parts.push('预算' + priceFilters.join('/'))
    if (activityFilters.length > 0) parts.push(activityFilters.join('/'))
    if (state.activePreset === 'fp1') parts.push('近3月未成交')
    if (state.excludeSensitive) parts.push('排敏排退订')

    return parts.join(' + ') || '未设置筛选条件'
  }
}))
