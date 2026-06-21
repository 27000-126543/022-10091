import type { Campaign } from '@/types/campaign'

export const mockCampaigns: Campaign[] = [
  {
    id: 'cm1',
    name: '七夕光电种草群发',
    status: 'sent',
    statusName: '已发送',
    audienceCount: 42,
    contentTitle: '热玛吉真人案例：35岁职场妈妈的逆龄蜕变',
    contentType: '案例种草',
    scheduledTime: '2026-06-20 10:00',
    sentTime: '2026-06-20 10:00',
    excludeSensitive: true,
    filterSummary: '咨询光电 + 预算中等 + 有互动未成交',
    customerIds: ['c001', 'c006', 'c009'],
    createdAt: '2026-06-19'
  },
  {
    id: 'cm2',
    name: '术后关怀回访',
    status: 'scheduled',
    statusName: '待发送',
    audienceCount: 30,
    contentTitle: '术后护理指南：如何让效果翻倍',
    contentType: '医生科普',
    scheduledTime: '2026-06-25 09:00',
    sentTime: null,
    excludeSensitive: true,
    filterSummary: '术后1周至1月客户',
    customerIds: ['c002', 'c007', 'c008', 'c012'],
    createdAt: '2026-06-21'
  },
  {
    id: 'cm3',
    name: '七夕限时优惠推送',
    status: 'draft',
    statusName: '草稿',
    audienceCount: 68,
    contentTitle: '七夕限定：光电套餐7.7折起',
    contentType: '限时权益',
    scheduledTime: '',
    sentTime: null,
    excludeSensitive: true,
    filterSummary: '咨询光电 + 价格敏感高/中',
    customerIds: ['c001', 'c002', 'c006', 'c010', 'c012'],
    createdAt: '2026-06-22'
  },
  {
    id: 'cm4',
    name: '高净值客户激活',
    status: 'sent',
    statusName: '已发送',
    audienceCount: 15,
    contentTitle: '超声刀 vs 热玛吉：抗衰怎么选？',
    contentType: '医生科普',
    scheduledTime: '2026-06-15 14:00',
    sentTime: '2026-06-15 14:00',
    excludeSensitive: true,
    filterSummary: '低价格敏感 + 沉默/低互动',
    customerIds: ['c004', 'c007', 'c010'],
    createdAt: '2026-06-14'
  },
  {
    id: 'cm5',
    name: '注射复购提醒',
    status: 'failed',
    statusName: '发送失败',
    audienceCount: 22,
    contentTitle: '玻尿酸隆鼻3个月效果实录',
    contentType: '案例种草',
    scheduledTime: '2026-06-18 11:00',
    sentTime: null,
    excludeSensitive: true,
    filterSummary: '注射术后3月以上',
    customerIds: ['c003', 'c008'],
    createdAt: '2026-06-17'
  }
]
