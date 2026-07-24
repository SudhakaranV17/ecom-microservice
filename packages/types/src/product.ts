import type { Product, Category } from "@repo/product-db";

export type ProductType = Product;
export interface StripeProductType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type CategoryType = Category;
export type ProductsType = ProductType[];
