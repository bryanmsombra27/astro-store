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

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Rol,
  },
});
