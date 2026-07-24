import type { Product, Category } from "@repo/product-db";

export interface StripeProductType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type ProductType = Product;
export type CategoryType = Category;
export type ProductsType = ProductType[];
