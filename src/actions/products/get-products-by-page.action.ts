import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { count, db, eq, Product, ProductImage, sql } from "astro:db";
import type { ProductWithImage } from "@/interfaces/product-with-image";

export const getProductsByPageAction = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(12),
  }),
  handler: async ({ limit, page }) => {
    page = page <= 0 ? 1 : page;
    const [totalRecords] = await db.select({ count: count() }).from(Product);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(totalRecords.count / limit);
    const offset = (+page - 1) * limit;

    if (page > totalPages) {
      // page = totalPages
      return {
        products: [] as ProductWithImage[],
        totalPages,
      };
    }
    const rawQuery = sql`select a.*,
( select GROUP_CONCAT(image,',') from 
	( select * from ${ProductImage} where productId = a.id limit 2 )
 ) as images
from ${Product} a
LIMIT ${limit} OFFSET ${offset};`;

    const { rows } = await db.run(rawQuery);
    const products = rows.map((product) => {
      return {
        ...product,
        images: product.images ? product.images : "no-image.png",
      };
    });

    // const products = await db
    //   .select()
    //   .from(Product)
    //   //   .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
    //   .limit(limit)
    //   .offset(offset);

    return {
      products: products as unknown as ProductWithImage[],
      totalPages,
    };
  },
});
