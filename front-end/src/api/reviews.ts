import { api } from "./client";

export type Review = {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  authorEmail?: string;
  createdAt?: string;
};

export async function listReviews(productId: number): Promise<Review[]> {
  const { data } = await api.get<Review[]>(`/reviews/product/${productId}`);
  return data;
}

export async function addReview(body: { productId: number; rating: number; comment: string }): Promise<Review> {
  const { data } = await api.post<Review>("/reviews", body);
  return data;
}
