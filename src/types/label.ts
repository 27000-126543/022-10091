export interface LabelGroup {
  id: string
  name: string
  type: 'project' | 'stage' | 'price' | 'activity' | 'custom'
  options: LabelOption[]
}

export interface LabelOption {
  id: string
  name: string
  selected: boolean
  count: number
}

export interface FilterPreset {
  id: string
  name: string
  description: string
  filters: Record<string, string[]>
}

export interface WechatNote {
  id: string
  customerId: string
  content: string
  createdAt: string
}
