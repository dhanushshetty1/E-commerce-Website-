import { api } from "./client";

export type Order = {
  id: number;
  status?: string;
  total?: number;
};

export async function checkout(userId: number): Promise<Order> {
  const { data } = await api.post<Order>(`/api/orders/checkout/${userId}`);
  return data;
}
export async function pay(orderId: number): Promise<unknown> {
  const { data } = await api.post(`/payment/${orderId}`);
  return data;
}
export async function getOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/api/orders/${id}`);
  return data;
}
