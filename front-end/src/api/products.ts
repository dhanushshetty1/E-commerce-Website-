import { api } from "./client";

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

export async function listProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/api/products");
  return data;
}
export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/api/product/${id}`);
  return data;
}
export async function createProduct(body: Omit<Product, "id">): Promise<Product> {
  const { data } = await api.post<Product>("/api/product", body);
  return data;
}
export async function updateProduct(id: number, body: Partial<Omit<Product, "id">>): Promise<Product> {
  const { data } = await api.put<Product>(`/api/product/${id}`, body);
  return data;
}
export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/api/product/${id}`);
}
