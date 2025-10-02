import { useCartContext } from '@/context/CartProvider';

const useCart = () => {
  const context = useCartContext();
  return context;
};

export default useCart;