import { loginUser, logout, registerUser } from "./auth";
import { loadProductsFromCart } from "./cart/load-products-from-cart";
import { getProductBySlug } from "./products/get-product-by-slug";
import { getProductsByPageAction } from "./products/get-products-by-page.action";

export const server = {
  // actions
  getProductsByPage: getProductsByPageAction,
  getProductBySlug,
  loadProductsFromCart,

  // Auth
  loginUser,
  logout,
  registerUser,
};
