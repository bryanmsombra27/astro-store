import type { CartItem } from "@/interfaces/cart-item";
import { atom } from "nanostores";

export const itemsInCart = atom<number>(0);
