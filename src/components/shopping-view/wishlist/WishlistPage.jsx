import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WishlistCard from "./WishlistCard";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { Link, useNavigate } from "react-router-dom";
import ShoppingHeader from "../header";
import Spinner from "@/components/common/spinner";

const WishlistPage = ({ userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    navigate(`/shop/product/${product._id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <ShoppingHeader />
      <div className="mx-auto max-w-[1344px] px-5 py-8 md:px-10 lg:px-12">
        <h1 className="mb-6 font-display text-2xl font-bold text-foreground">My Wishlist</h1>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Spinner className="h-7 w-7 text-primary" />
          </div>
        )}

        {error && (
          <p className="mb-4 text-sm text-destructive">Error loading wishlist: {error}</p>
        )}

        {!loading && items.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="mb-2 font-display text-xl font-bold text-foreground">
              Your wishlist is empty
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Save items you love and come back to them later!
            </p>
            <Link
              to="/shop/home"
              className="inline-block rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
};

export default WishlistPage;
