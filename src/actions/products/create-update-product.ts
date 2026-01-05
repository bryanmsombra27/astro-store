import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { getSession } from "auth-astro/server";
import { v7 as uuid } from "uuid";
import { db, eq, Product, ProductImage } from "astro:db";
import { ImageUpload } from "@/utils/image-upload";

const MAX_FILE_SIZE = 15_000_000; // 5MB
const ACCEPTED_IMAGE_FILES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const createUpdateProduct = defineAction({
  accept: "form",
  input: z.object({
    id: z.string().optional(),
    description: z.string(),
    gender: z.string(),
    price: z.number(),
    sizes: z.string(),
    slug: z.string(),
    stock: z.number(),
    tags: z.string(),
    title: z.string(),
    type: z.string(),

    imageFiles: z.any().optional(),
    // .array(
    //   z
    //     .instanceof(File)
    //     .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size 5MB")
    //     .refine((file) => {
    //       if (file.size === 0) return true;

    //       return ACCEPTED_IMAGE_FILES.includes(file.type);
    //     }, `Only supported image files are valid, ${ACCEPTED_IMAGE_FILES.join(",")}`)
    // )
    // .optional(),
  }),
  handler: async (form, { request }) => {
    const session = await getSession(request);
    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { id = uuid(), imageFiles, ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

    const product = {
      id: id,
      user: user.id!,
      ...rest,
    };

    const queries: any = [];

    if (!form.id) {
      queries.push(db.insert(Product).values(product));
    } else {
      queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
    }

    // Imágenes
    const secureUrls: string[] = [];
    if (
      form.imageFiles &&
      form.imageFiles.length > 0 &&
      form.imageFiles[0].size > 0
    ) {
      const urls = await Promise.all(
        form.imageFiles.map((file) => ImageUpload.upload(file))
      );

      secureUrls.push(...urls);
    }

    secureUrls.forEach((imageUrl) => {
      const imageObj = {
        id: uuid(),
        image: imageUrl,
        productId: product.id,
      };
      queries.push(db.insert(ProductImage).values(imageObj));
    });

    // imageFiles?.forEach(async (imageFile) => {
    //   if (imageFile.size <= 0) return;

    //   const url = await ImageUpload.upload(imageFile);
    // });

    await db.batch(queries);

    return product;
  },
});
