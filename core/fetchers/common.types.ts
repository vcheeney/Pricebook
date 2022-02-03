export interface CommonConfig {
  apiKey: string
  pageSize: number
  date: string
  lang: string
  pickupType: string
}

export interface BannerConfig {
  categoryId: string
  storeId: string
  banner: string
  cartId: string
}

export interface ImageAsset {
  smallUrl: string
  mediumUrl: string
  largeUrl: string
  smallRetinaUrl: string
  mediumRetinaUrl: string
  largeRetinaUrl: string
}

export interface Price {
  value: number
  unit: string
  quantity: number
}

export interface WasPrice {
  value: number
  unit: string
  quantity: number
}

export interface ComparisonPrice {
  value: number
  unit: string
  quantity: number
}

export interface Prices {
  price: Price
  wasPrice: WasPrice
  comparisonPrices: ComparisonPrice[]
}

export interface PricingUnits {
  type: string
  unit: string
  interval: number
  minOrderQuantity: number
  maxOrderQuantity: number
  weighted: boolean
}

export interface DealBadge {
  type: string
  text: string
  expiryDate: Date
}

export interface Badges {
  textBadge?: any
  loyaltyBadge?: any
  dealBadge: DealBadge
}

export interface Result {
  code: string
  name: string
  description: string
  brand: string
  link: string
  imageAssets: ImageAsset[]
  packageSize: string
  shoppable: boolean
  prices: Prices
  pricingUnits: PricingUnits
  badges: Badges
  breadcrumbs: any[]
  averageWeight?: any
  stockStatus?: any
  upcs: any[]
  articleNumber: string
  uom?: any
  ingredients: string
  promotions?: any
  nutritionFacts?: any
}

export interface Pagination {
  pageNumber: number
  pageSize: number
  totalResults: number
}

export interface Sort {
  code: string
  name: string
  selected: boolean
}

export interface Value {
  code: string
  name: string
  count: number
  disabled?: any
  selected: boolean
}

export interface FilterGroup {
  code: string
  name: string
  multiSelect: boolean
  values: Value[]
}

export interface FetchPageResponse {
  query?: any
  requestId: string
  correctedQuery?: any
  results: Result[]
  pagination: Pagination
  sorts: Sort[]
  filterGroups: FilterGroup[]
  breadcrumbs: any[]
  categoryName?: any
}

export interface CategoryBreadcrumb {
  url: string
  name: string
  categoryCode: string
}

export interface Category {
  code: string
  name: string
  title?: any
  marketingPromoData?: any
  categoryType: string
  subCategories: string[]
  categoryBreadcrumbs: CategoryBreadcrumb[]
  categoryProductPromoData?: any
  collectionCategory: boolean
  brandHubPage: boolean
  showHero: boolean
}

export type SortOption = {
  title: 'asc' | 'desc'
}
