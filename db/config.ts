import { column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      unique: true,
    }),
    name: column.text(),
    email: column.text({
      unique: true,
    }),
    password: column.text(),
    createdAt: column.date({
      default: new Date(),
    }),
    rol: column.text({
      references: () => Rol.columns.id,
    }),
  },
});

const Rol = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),

    name: column.text(),
  },
});

const Product = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    stock: column.number(),
    slug: column.text({
      unique: true,
    }),
    price: column.number(),
    sizes: column.text(),
    type: column.text(),
    tags: column.text(),
    title: column.text(),
    description: column.text(),
    gender: column.text(),

    user: column.text({
      references: () => User.columns.id,
    }),
  },
});

const ProductImage = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    productId: column.text({
      references: () => Product.columns.id,
    }),
    image: column.text(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Rol,
    Product,
    ProductImage,
  },
});
