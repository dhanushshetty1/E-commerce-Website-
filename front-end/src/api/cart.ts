import { api } from "./client";
import type { Product } from "./products";

export type CartItem = {
  productId?: number;
  quantity?: number;
  product?: Product;
  price?: number;
  total?: number;
} & Record<string, unknown>;

export type Cart = {
  items: CartItem[];
  totalPrice?: number;
} & Record<string, unknown>;

export async function getCart(userId: number): Promise<Cart | CartItem[]> {
  const { data } = await api.get<Cart | CartItem[]>(`/cart/${userId}`);
  return data;
}
export async function addToCart(userId: number, productId: number): Promise<unknown> {
  const { data } = await api.post(`/cart/add/${userId}/${productId}`);
  return data;
}
export async function removeFromCart(userId: number, productId: number): Promise<unknown> {
  const { data } = await api.delete(`/cart/remove/${userId}/${productId}`);
  return data;
}
export async function clearCart(userId: number): Promise<unknown> {
  const { data } = await api.delete(`/cart/clear/${userId}`);
  return data;
}
