import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WishlistCard from "./WishlistCard";
import { fetchWishlist } from "@/store/shop/wishlist-slice";

const WishlistPage = ({ userId, handleAddToCart }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.shopWishlist);
  const { user } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(fetchWishlist(userId));
  // }, [dispatch, userId]);

  useEffect(() => {
  if (user?.id) {
    dispatch(fetchWishlist(user.id));
  }
}, [dispatch, user?.id]);

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wish</h1>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(({ productId }) => (
            <WishlistCard
              key={productId._id}
              product={productId}
              userId={userId}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
