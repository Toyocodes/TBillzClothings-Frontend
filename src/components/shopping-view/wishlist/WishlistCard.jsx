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
      className="relative w-full cursor-pointer overflow-hidden rounded-2xl border-border bg-card transition-colors hover:border-primary/40"
      onClick={() => onCardClick(product)}
    >
      <button
        className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-1.5 shadow-sm backdrop-blur"
        onClick={handleRemove}
      >
        <Heart className="h-5 w-5 fill-primary text-primary" />
      </button>

      <div className="flex items-center justify-center bg-muted pt-6">
        <img
          src={product?.image}
          alt={product?.title}
          className="h-44 w-44 object-cover"
        />
      </div>

      <CardContent className="space-y-1.5 p-5">
        <h3 className="truncate font-display text-base font-semibold text-foreground">
          {product?.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {product?.averageReview?.toFixed(1) || "0.0"}
          <StarIcon className="h-4 w-4 fill-primary text-primary" />
        </div>

        <div className="flex items-center gap-2">
          {product?.salePrice > 0 ? (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ₦{product?.price?.toLocaleString()}
              </span>
              <span className="font-display text-base font-bold text-foreground md:text-lg">
                ₦{product?.salePrice?.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="font-display text-base font-bold text-foreground md:text-lg">
              ₦{product?.price?.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WishlistCard;
