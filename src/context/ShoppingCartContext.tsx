import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { ShoppingCart } from '../components/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface IShoppingCartProviderProps {
  children: ReactNode;
}

interface ICartItem {
  id: number;
  quantity: number;
}

interface IShoppingCartContext {
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  openCart: () => void;
  closeCart: () => void;
  getCartQuantity: number;
  cartItems: ICartItem[];
}

const ShoppingCartContext = createContext(
  {} as IShoppingCartContext
);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({
  children,
}: IShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<ICartItem[]>(
    "shopping-cart", 
    []
  )

  const [isCartOpen, setIsCartOpen] = useState(false);

  const getCartQuantity = cartItems.reduce(
    (qtd, item) => item.quantity + qtd,
    0
  );

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  function getItemQuantity(id: number) {
    return (
      cartItems.find((item) => item.id === id)?.quantity ||
      0
    );
  }

  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (
        currItems.find((item) => item.id === id) == null
      ) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (
        currItems.find((item) => item.id === id)
          ?.quantity === 1
      ) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        getCartQuantity,
        closeCart,
        openCart,
      }}
    >
      {children}
    <ShoppingCart isOpen={isCartOpen}/>
    </ShoppingCartContext.Provider>
  );
}
