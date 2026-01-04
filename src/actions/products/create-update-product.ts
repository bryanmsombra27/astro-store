import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { getSession } from "auth-astro/server";
import { v7 as uuid } from "uuid";
import { db, eq, Product } from "astro:db";
export const createUpdateProduct = defineAction({
  accept: "form",
  input: z.object({
    id: z.string().optional(),
    stock: z.number(),
    slug: z.string(),
    price: z.number(),
    sizes: z.string(),
    type: z.string(),
    tags: z.string(),
    title: z.string(),
    description: z.string(),
    gender: z.string(),
  }),
  handler: async (form, { request }) => {
    const session = await getSession(request);
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized user");
    }

    const { id = uuid(), ...rest } = form;

    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();
    const product = {
      id,
      user: user.id!,
      ...rest,
    };

    if (!form.id) {
      await db.insert(Product).values(product);
    } else {
      await db.update(Product).set(product).where(eq(Product.id, id));
    }

    return product;
  },
});
