
import { Heart } from "lucide-react"; 
import { useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/shop/wishlist-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const WishlistCard = ({ product, userId, handleAddToCart }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromWishlist({ userId, productId: product?._id }));
  };

  return (
    <Card className="w-full max-w-xs p-2 relative rounded-xl border">
      {/* Heart Icon */}
      <div className="absolute top-3 right-3 z-10 cursor-pointer" onClick={handleRemove}>
        <Heart className="text-red-500 fill-red-500" />
      </div>

      {/* Image & Badge */}
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-52 object-cover rounded-lg"
        />
        {/* <Badge className="absolute top-2 left-2 bg-lime-500 text-white">New Arrival</Badge> */}
      </div>

      {/* Product Info */}
      <CardContent className="pt-4">
        <h3 className="text-md font-semibold truncate">{product?.title}</h3>
        <div className="text-sm text-muted-foreground mb-1">
          {product?.rating?.toFixed(1)} ⭐ ({product?.numReviews})
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2">
          {product?.salePrice > 0 ? (
            <>
              <span className="text-sm line-through text-gray-500">₦{product?.price}</span>
              <span className="text-lg font-bold text-green-600">₦{product?.salePrice}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">₦{product?.price}</span>
          )}
        </div>
      </CardContent>

      {/* Add to Cart Button */}
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => handleAddToCart(product?._id, product?.totalStock)}
          disabled={product?.totalStock === 0}
        >
          {product?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WishlistCard;
