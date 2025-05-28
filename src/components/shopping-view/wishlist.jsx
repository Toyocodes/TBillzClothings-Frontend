import WishlistPage from "@/components/Wishlist/WishlistPage";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cart/cartSlice"; // Adjust path if needed

const Wishlist = () => {
  const user = useSelector((state) => state.auth.user); // Assuming auth state
  const dispatch = useDispatch();

  const handleAddToCart = (productId, quantity) => {
    dispatch(addToCart({ productId, quantity }));
  };

  return (
    <WishlistPage userId={user?._id} handleAddToCart={handleAddToCart} />
  );
};

export default Wishlist;
