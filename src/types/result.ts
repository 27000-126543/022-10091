export interface CampaignResult {
  id: string
  campaignId: string
  campaignName: string
  sentCount: number
  openCount: number
  clickCount: number
  consultCount: number
  appointCount: number
  unsubscribeCount: number
  openRate: number
  clickRate: number
  consultRate: number
  appointRate: number
  totalRevenue: number
  sentTime: string
}

export interface CustomerAction {
  id: string
  customerId: string
  customerName: string
  customerAvatar: string
  campaignId: string
  actionType: 'open' | 'click' | 'consult' | 'appoint' | 'unsubscribe'
  actionTypeName: string
  actionTime: string
  detail: string
}

export interface TransactionFeedback {
  id: string
  customerId: string
  customerName: string
  campaignId: string
  amount: number
  project: string
  feedbackTime: string
  status: 'confirmed' | 'pending'
}
