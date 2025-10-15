export interface CategoriesRoot {
  status: number
  message: string
  data: CategoriesData
}

export interface CategoriesData {
  rows: Row[]
  count: number
}

export interface Row {
  id: string
  name: string
  description: string
  icon: string
  color: any
  backgroundColor: any
  createdAt: string
  updatedAt: string
  deletedAt: any
  productCount: number
}
