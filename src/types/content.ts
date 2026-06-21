export type ContentType = 'case' | 'science' | 'coupon'

export interface ContentItem {
  id: string
  title: string
  description: string
  coverImage: string
  type: ContentType
  typeName: string
  viewCount: number
  likeCount: number
  shareCount: number
  couponId: string | null
  couponName: string | null
  couponDiscount: string | null
  createdAt: string
  selected: boolean
}

export interface Coupon {
  id: string
  name: string
  discount: string
  validUntil: string
  usedCount: number
  totalCount: number
}
