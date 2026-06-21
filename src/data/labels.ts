import type { LabelGroup, FilterPreset } from '@/types/label'

export const mockLabelGroups: LabelGroup[] = [
  {
    id: 'project',
    name: '咨询项目',
    type: 'project',
    options: [
      { id: 'p1', name: '光电', selected: false, count: 45 },
      { id: 'p2', name: '注射', selected: false, count: 32 },
      { id: 'p3', name: '手术', selected: false, count: 28 },
      { id: 'p4', name: '皮肤管理', selected: false, count: 56 },
      { id: 'p5', name: '抗衰', selected: false, count: 38 },
      { id: 'p6', name: '体雕', selected: false, count: 15 }
    ]
  },
  {
    id: 'stage',
    name: '术后阶段',
    type: 'stage',
    options: [
      { id: 's1', name: '术前', selected: false, count: 68 },
      { id: 's2', name: '术后1周', selected: false, count: 12 },
      { id: 's3', name: '术后1月', selected: false, count: 18 },
      { id: 's4', name: '术后3月', selected: false, count: 22 },
      { id: 's5', name: '术后半年', selected: false, count: 15 },
      { id: 's6', name: '术后1年', selected: false, count: 9 }
    ]
  },
  {
    id: 'price',
    name: '价格敏感度',
    type: 'price',
    options: [
      { id: 'pr1', name: '高', selected: false, count: 35 },
      { id: 'pr2', name: '中', selected: false, count: 62 },
      { id: 'pr3', name: '低', selected: false, count: 47 }
    ]
  },
  {
    id: 'activity',
    name: '活跃互动',
    type: 'activity',
    options: [
      { id: 'a1', name: '高互动', selected: false, count: 30 },
      { id: 'a2', name: '中互动', selected: false, count: 48 },
      { id: 'a3', name: '低互动', selected: false, count: 35 },
      { id: 'a4', name: '沉默', selected: false, count: 31 }
    ]
  },
  {
    id: 'custom',
    name: '自定义标签',
    type: 'custom',
    options: [
      { id: 'cu1', name: 'VIP客户', selected: false, count: 18 },
      { id: 'cu2', name: '转介绍客户', selected: false, count: 12 },
      { id: 'cu3', name: '复购客户', selected: false, count: 25 },
      { id: 'cu4', name: '投诉风险', selected: false, count: 5 },
      { id: 'cu5', name: '孕期客户', selected: false, count: 8 }
    ]
  }
]

export const mockFilterPresets: FilterPreset[] = [
  {
    id: 'fp1',
    name: '七夕光电种草',
    description: '近3月咨询光电、预算中等、有互动未成交',
    filters: { project: ['光电'], price: ['中'], activity: ['高互动', '中互动'] }
  },
  {
    id: 'fp2',
    name: '术后关怀跟进',
    description: '术后1月内客户，需要关怀回访',
    filters: { stage: ['术后1周', '术后1月'] }
  },
  {
    id: 'fp3',
    name: '高净值激活',
    description: '低价格敏感、沉默期高净值客户',
    filters: { price: ['低'], activity: ['沉默', '低互动'] }
  },
  {
    id: 'fp4',
    name: '注射品类复购',
    description: '注射术后3月以上，复购周期到了',
    filters: { project: ['注射'], stage: ['术后3月', '术后半年', '术后1年'] }
  }
]
