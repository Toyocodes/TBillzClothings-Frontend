import { Heart, StarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "@/store/shop/wishlist-slice";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const WishlistCard = ({ product, onCardClick }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const userId = useSelector((state) => state.auth?.user?.id);
  const handleRemove = (e) => {
    e.stopPropagation();
    if (!userId) {
      toast({
        title: "User not logged in",
        variant: "destructive",
      });
      return;
    }
    dispatch(removeFromWishlist({ userId, productId: product?._id }))
      .unwrap()
      .then(() => {
        toast({ title: "Removed from wishlist" });
      })
      .catch((error) => {
        toast({
          title: error?.message || "Failed to remove from wishlist",
          variant: "destructive",
        });
      });
  };

  return (
    <Card
      className="w-full mt-10 max-w-sm rounded-2xl border shadow-md overflow-hidden transition hover:shadow-xl relative cursor-pointer"
      onClick={() => onCardClick(product)}
    >
      <div
        className="absolute top-3 right-5 z-10 p-1 bg-white rounded-full shadow-sm"
        onClick={handleRemove}
      >
        <Heart className="text-red-500 fill-red-500 w-6 h-6" />
      </div>

      <div className="relative flex items-center justify-center pt-6 bg-gray-50">
        <img
          src={product?.image}
          alt={product?.title}
          className="h-44 w-44 object-cover rounded-t-2xl"
        />
      </div>

      <CardContent className="p-6 space-y-1.5">
        <h3 className="text-lg font-semibold text-gray-900 truncate hover:underline">
          {product?.title}
        </h3>

        <div className="flex gap-2 items-center text-lg text-muted-foreground">
          {product?.averageReview?.toFixed(1) || "0.0"} 
          <StarIcon className="w-5 h-5 fill-[#82e600] text-[#82e600]" /> 
        </div>

        <div className="flex items-center gap-y-3 gap-x-2 text-gray-800">
          {product?.salePrice > 0 ? (
            <>
              <span className="line-through text-sm text-gray-400">
                ₦{product?.price}
              </span>
              <span className="text-base md:text-lg font-bold text-gray-4000">
                ₦{product?.salePrice}
              </span>
            </>
          ) : (
            <span className="text-base md:text-lg font-bold">
              ₦{product?.price}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WishlistCard;
