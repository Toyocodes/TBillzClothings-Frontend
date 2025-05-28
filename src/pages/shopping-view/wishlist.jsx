
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import WishlistPage from "@/components/shopping-view/wishlist/WishlistPage";
import { addToCart } from "@/store/shop/cart-slice";

const Wishlist = () => {
  const user = useSelector((state) => state.auth.user); 
  const dispatch = useDispatch();

  const handleAddToCart = (productId, quantity) => {
    dispatch(addToCart({ productId, quantity }));
  };

  return (
    <WishlistPage userId={user?._id} handleAddToCart={handleAddToCart} />
  );
};

export default Wishlist;
