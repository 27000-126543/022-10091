export type ConsultProject = '光电' | '注射' | '手术' | '皮肤管理' | '抗衰' | '体雕'

export type SurgeryStage = '术前' | '术后1周' | '术后1月' | '术后3月' | '术后半年' | '术后1年'

export type PriceSensitivity = '高' | '中' | '低'

export type ActivityLevel = '高互动' | '中互动' | '低互动' | '沉默'

export interface CustomerTag {
  id: string
  name: string
  type: 'project' | 'stage' | 'price' | 'activity' | 'custom'
  color: string
}

export interface Customer {
  id: string
  name: string
  avatar: string
  phone: string
  wechatNote: string
  tags: CustomerTag[]
  consultProjects: ConsultProject[]
  surgeryStage: SurgeryStage
  priceSensitivity: PriceSensitivity
  activityLevel: ActivityLevel
  lastActiveTime: string
  totalConsultations: number
  totalSpent: number
  isSensitive: boolean
  unsubscribed: boolean
  createdAt: string
}
