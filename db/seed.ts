import { db, Rol, User, Product, ProductImage } from "astro:db";
import { v7 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { seedProducts } from "./seed-data";

// https://astro.build/db/seed
export default async function seed() {
  // TODO
  const roles = [
    {
      id: "admin",
      name: "Administrador",
    },
    {
      id: "user",
      name: "Usuario de sistema",
    },
  ];

  const jhonDoe = {
    id: uuid(),
    name: "Jhon Doe",
    email: "koso@koso.com",
    password: bcrypt.hashSync("123456", 10),
    rol: "admin",
  };
  const janeDoe = {
    id: uuid(),
    name: "Jane Doe",
    email: "koso2@koso.com",
    password: bcrypt.hashSync("123456", 10),
    rol: "user",
  };

  await db.insert(Rol).values(roles);
  await db.insert(User).values([jhonDoe, janeDoe]);

  const queries: any = [];

  seedProducts.forEach((p) => {
    const product = {
      id: uuid(),
      user: jhonDoe.id,
      stock: p.stock,
      slug: p.slug,
      price: p.price,
      sizes: p.sizes.join(","),
      type: p.type,
      tags: p.tags.join(","),
      title: p.title,
      description: p.description,
      gender: p.gender,
    };

    queries.push(db.insert(Product).values(product));

    p.images.forEach((img) => {
      const image = {
        id: uuid(),
        image: img,
        productId: product.id,
      };

      queries.push(db.insert(ProductImage).values(image));
    });
  });

  await db.batch(queries);
}
