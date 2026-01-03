import type { ProductWithImage } from "@/interfaces/product-with-image";
import { useState, type FC } from "react";

interface ProductCardProps {
  product: ProductWithImage;
}
const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const images = product.images.split(",").map((img) => {
    return img.startsWith("http")
      ? img
      : `${import.meta.env.PUBLIC_URL}/images/products/${img}`;
  });

  const [currentImage, setCurrentImage] = useState<string>(images[0]);

  return (
    <>
      <a href={`/products/${product.slug}`}>
        <img
          src={currentImage}
          alt={product.title}
          className="h-87.5  object-contain"
          onMouseEnter={() => setCurrentImage(images[1])}
          onMouseLeave={() => setCurrentImage(images[0])}
        />
        <h4>{product.title}</h4>
        <p>
          {Intl.NumberFormat("es-MX", {
            currency: "MXN",
            style: "currency",
            minimumFractionDigits: 2,
          }).format(product.price)}
        </p>
      </a>
    </>
  );
};

export default ProductCard;
