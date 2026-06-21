export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'

export interface Campaign {
  id: string
  name: string
  status: CampaignStatus
  statusName: string
  audienceCount: number
  contentTitle: string
  contentType: string
  scheduledTime: string
  sentTime: string | null
  excludeSensitive: boolean
  filterSummary: string
  customerIds: string[]
  createdAt: string
}
