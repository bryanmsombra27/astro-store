export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
}
export interface CartItemDB {
  productId: string;
  title: string;
  size: string;
  quantity: number;
  price: number;
  slug: string;
  image: string;
}
