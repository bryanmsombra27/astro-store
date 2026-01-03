import type { ProductWithImage } from "@/interfaces/product-with-image";
import type { FC } from "react";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: ProductWithImage[];
}
const ProductList: FC<ProductListProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-items-center">
      {products.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
        />
      ))}
    </div>
  );
};

export default ProductList;
