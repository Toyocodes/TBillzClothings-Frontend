import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import WishlistCard from "./WishlistCard";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { Link } from "react-router-dom";
import ShoppingHeader from "../header";
import ProductDetailsDialog from "../product-details";

const WishlistPage = ({ userId }) => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    items = [],
    loading,
    error,
  } = useSelector((state) => state.shopWishlist || {});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [dispatch, user?.id]);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <ShoppingHeader />
      <div className="container mx-auto px-12 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {loading && <p>Loading wishlist...</p>}

        {error && (
          <p className="text-red-600 mb-4">Error loading wishlist: {error}</p>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your wishlist is empty 💤
            </h2>
            <p className="text-gray-500 mb-6">
              Save items you love and come back to them later!
            </p>
            <Link
              to="/shop/home"
              className="inline-block bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(({ product }) =>
              product ? (
                <WishlistCard
                  key={product._id}
                  product={product}
                  userId={userId}
                  onCardClick={handleCardClick}
                />
              ) : null
            )}
          </div>
        )}
      </div>

      <ProductDetailsDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        productDetails={selectedProduct}
      />
    </div>
  );
};

export default WishlistPage;
