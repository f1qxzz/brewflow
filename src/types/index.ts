export type MenuItem = {
  id: number; name: string; description: string; price: number
  image: string; categoryId: number; available: boolean; order: number
}

export type Category = {
  id: number; name: string; slug: string; items: MenuItem[]
}

export type CartItem = {
  id: number; name: string; price: number; qty: number
}

export type Order = {
  id: number; customerName: string; tableNumber: string
  status: string; total: number; createdAt: string
  items: { id: number; menuItem: MenuItem; quantity: number; price: number }[]
}

export type Feedback = {
  id: number; customerName: string; rating: number
  message: string; createdAt: string
}
