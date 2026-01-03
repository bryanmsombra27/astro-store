import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import type { CartItem } from "@/interfaces/cart-item";
import { db, eq, inArray, Product, ProductImage } from "astro:db";

export const loadProductsFromCart = defineAction({
  accept: "json",
  handler: async (_, { cookies }) => {
    const cart = JSON.parse(cookies.get("cart")?.value ?? "[]") as CartItem[];

    if (cart.length == 0) return [];

    // load products
    const productsIds = cart.map((item) => item.productId);

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productsIds));

    return cart.map((item) => {
      const product = dbProducts.find((p) => p.Product.id == item.productId);

      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado`);
      }

      const { title, price, slug } = product.Product;
      const image = product.ProductImage.image;

      return {
        productId: item.productId,
        title,
        size: item.size,
        quantity: item.quantity,
        price,
        slug,
        image: image.startsWith("http")
          ? image
          : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
      };
    });
  },
});
