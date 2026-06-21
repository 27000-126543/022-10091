import type { CampaignResult, CustomerAction, TransactionFeedback } from '@/types/result'

export const mockCampaignResults: CampaignResult[] = [
  {
    id: 'cr1',
    campaignId: 'cm1',
    campaignName: '七夕光电种草群发',
    sentCount: 42,
    openCount: 31,
    clickCount: 18,
    consultCount: 8,
    appointCount: 3,
    unsubscribeCount: 1,
    openRate: 73.8,
    clickRate: 42.9,
    consultRate: 19.0,
    appointRate: 7.1,
    totalRevenue: 25600,
    sentTime: '2026-06-20 10:00'
  },
  {
    id: 'cr2',
    campaignId: 'cm4',
    campaignName: '高净值客户激活',
    sentCount: 15,
    openCount: 12,
    clickCount: 9,
    consultCount: 5,
    appointCount: 2,
    unsubscribeCount: 0,
    openRate: 80.0,
    clickRate: 60.0,
    consultRate: 33.3,
    appointRate: 13.3,
    totalRevenue: 45000,
    sentTime: '2026-06-15 14:00'
  }
]

export const mockCustomerActions: CustomerAction[] = [
  { id: 'a1', customerId: 'c001', customerName: '林小姐', customerAvatar: 'https://picsum.photos/id/64/200/200', campaignId: 'cm1', actionType: 'open', actionTypeName: '打开', actionTime: '2026-06-20 10:05', detail: '打开案例文章' },
  { id: 'a2', customerId: 'c001', customerName: '林小姐', customerAvatar: 'https://picsum.photos/id/64/200/200', campaignId: 'cm1', actionType: 'click', actionTypeName: '点击', actionTime: '2026-06-20 10:08', detail: '点击咨询按钮' },
  { id: 'a3', customerId: 'c001', customerName: '林小姐', customerAvatar: 'https://picsum.photos/id/64/200/200', campaignId: 'cm1', actionType: 'consult', actionTypeName: '咨询', actionTime: '2026-06-20 10:12', detail: '发起在线咨询' },
  { id: 'a4', customerId: 'c003', customerName: '张女士', customerAvatar: 'https://picsum.photos/id/177/200/200', campaignId: 'cm1', actionType: 'open', actionTypeName: '打开', actionTime: '2026-06-20 10:15', detail: '打开案例文章' },
  { id: 'a5', customerId: 'c003', customerName: '张女士', customerAvatar: 'https://picsum.photos/id/177/200/200', campaignId: 'cm1', actionType: 'appoint', actionTypeName: '预约', actionTime: '2026-06-20 11:30', detail: '预约6月25日到店' },
  { id: 'a6', customerId: 'c006', customerName: '赵小姐', customerAvatar: 'https://picsum.photos/id/64/200/200', campaignId: 'cm1', actionType: 'open', actionTypeName: '打开', actionTime: '2026-06-20 10:22', detail: '打开案例文章' },
  { id: 'a7', customerId: 'c006', customerName: '赵小姐', customerAvatar: 'https://picsum.photos/id/64/200/200', campaignId: 'cm1', actionType: 'click', actionTypeName: '点击', actionTime: '2026-06-20 10:25', detail: '点击领券按钮' },
  { id: 'a8', customerId: 'c008', customerName: '周小姐', customerAvatar: 'https://picsum.photos/id/177/200/200', campaignId: 'cm1', actionType: 'unsubscribe', actionTypeName: '退订', actionTime: '2026-06-20 10:30', detail: '标记退订意向' },
  { id: 'a9', customerId: 'c012', customerName: '李小姐', customerAvatar: 'https://picsum.photos/id/91/200/200', campaignId: 'cm1', actionType: 'open', actionTypeName: '打开', actionTime: '2026-06-20 10:35', detail: '打开案例文章' },
  { id: 'a10', customerId: 'c012', customerName: '李小姐', customerAvatar: 'https://picsum.photos/id/91/200/200', campaignId: 'cm1', actionType: 'consult', actionTypeName: '咨询', actionTime: '2026-06-20 10:45', detail: '咨询热玛吉价格' },
  { id: 'a11', customerId: 'c012', customerName: '李小姐', customerAvatar: 'https://picsum.photos/id/91/200/200', campaignId: 'cm1', actionType: 'appoint', actionTypeName: '预约', actionTime: '2026-06-20 14:00', detail: '预约6月28日到店' },
  { id: 'a12', customerId: 'c002', customerName: '王女士', customerAvatar: 'https://picsum.photos/id/91/200/200', campaignId: 'cm1', actionType: 'open', actionTypeName: '打开', actionTime: '2026-06-20 11:00', detail: '打开案例文章' }
]

export const mockTransactionFeedbacks: TransactionFeedback[] = [
  { id: 'tf1', customerId: 'c003', customerName: '张女士', campaignId: 'cm1', amount: 12800, project: '光子嫩肤', feedbackTime: '2026-06-25', status: 'confirmed' },
  { id: 'tf2', customerId: 'c012', customerName: '李小姐', campaignId: 'cm1', amount: 12800, project: '热玛吉', feedbackTime: '2026-06-28', status: 'pending' },
  { id: 'tf3', customerId: 'c002', customerName: '王女士', campaignId: 'cm4', amount: 45000, project: '超声刀全脸', feedbackTime: '2026-06-18', status: 'confirmed' }
]
