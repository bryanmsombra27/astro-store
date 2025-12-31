import { db, Rol, User } from "astro:db";
import { v7 as uuid } from "uuid";
import bcrypt from "bcryptjs";
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
}
