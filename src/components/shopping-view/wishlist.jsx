import { useSelector } from "react-redux";
import WishlistPage from "./wishlist/WishlistPage";

const Wishlist = () => {
  const user = useSelector((state) => state.auth.user);
  return <WishlistPage userId={user?._id || user?.id} />;
};

export default Wishlist;

