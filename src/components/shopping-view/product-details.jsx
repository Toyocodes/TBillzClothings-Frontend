import { HeartIcon, StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  fetchCartItems,
  clearCartError,
} from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [cartMsg, setCartMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems, error: cartError } = useSelector(
    (state) => state.shopCart
  );
  const { reviews } = useSelector((state) => state.shopReview);

  const { items: wishlistItems = [] } = useSelector(
    (state) => state.shopWishlist
  );

  const { toast } = useToast();

  const isInWishlist = wishlistItems.some(
    (item) => item?.product?._id === productDetails?._id
  );

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  useEffect(() => {
    if (cartError) {
      setCartMsg(cartError);
      toast({ title: cartError, variant: "destructive" });
    }
  }, [cartError, toast]);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    // 1) Stock‑check
    const items = cartItems.items || [];
    const indexOfCurrentItem = items.findIndex(
      (i) => i.productId === getCurrentProductId
    );
    if (
      indexOfCurrentItem > -1 &&
      items[indexOfCurrentItem].quantity + 1 > getTotalStock
    ) {
      toast({
        title: `Only ${items[indexOfCurrentItem].quantity} left in stock`,
        variant: "destructive",
      });
      return;
    }

    // 2) Clear any previous cart error
    dispatch(clearCartError());

    // 3) Dispatch addToCart and unwrap to catch rejections
    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    )
      .unwrap() // will throw if the thunk was rejected
      .then((resp) => {
        // resp === response.data from your API
        const successMsg = resp.message || "Product added to cart";
        setCartMsg(successMsg);
        toast({ title: successMsg });

        // 4) Refresh the cart
        dispatch(fetchCartItems(user.id));
      })
      .catch((errPayload) => {
        // errPayload === what you returned via rejectWithValue
        const errorMsg = errPayload?.message || "Login to add to cart";
        setCartMsg(errorMsg);
        toast({ title: errorMsg, variant: "destructive" });
      });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    dispatch(clearCartError());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      const message = data?.payload?.message || "Review added successfully";
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: message });
      } else {
        toast({ title: message, variant: "destructive" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  function handleWishlistToggle() {
    if (!isAuthenticated) {
      toast({ title: "Login to add item to wishlist", variant: "destructive" });
      return;
    }

    if (isInWishlist) {
      dispatch(
        removeFromWishlist({ userId: user.id, productId: productDetails._id })
      )
        .unwrap()
        .then(() => toast({ title: "Removed from wishlist" }));
    } else {
      dispatch(
        addToWishlist({ userId: user.id, productId: productDetails._id })
      )
        .unwrap()
        .then(() => toast({ title: "Added to wishlist" }))
        .catch((err) => toast({ title: err.message, variant: "destructive" }));
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] p-4 sm:p-6 md:p-10">
        <div className="w-full flex flex-col md:flex-row gap-8">
          {/* Product image */}
          <div className="w-full flex justify-center md:block md:w-1/2">
            <div className="relative overflow-hidden rounded-lg w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-full md:h-full">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="aspect-square object-cover w-full h-full rounded-md"
              />
            </div>
          </div>

          {/* Product content */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-extrabold">
                  {productDetails?.title}
                </h1>
                <button
                  onClick={handleWishlistToggle}
                  className={`border-none hover:bg-transparent focus:outline-none focus:ring-0 rounded-full p-1 ${
                    isInWishlist ? "fill-[#82e600]" : "bg-transparent"
                  }`}
                >
                  <HeartIcon
                    className="w-8 h-8"
                    fill={isInWishlist ? "#82e600" : "none"}
                    stroke={isInWishlist ? "#82e600" : "#4c7814"}
                  />
                </button>
              </div>

              <p className="text-muted-foreground text-base md:text-lg mb-5 mt-4">
                {productDetails?.description}
              </p>

              <div className="flex gap-5">
                <p
                  className={`text-xl md:text-2xl font-bold text-primary ${
                    productDetails?.salePrice > 0 ? "line-through " : ""
                  }`}
                >
                  ₦{productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 ? (
                  <p className="text-xl md:text-2xl font-bold text-muted-foreground">
                    ₦{productDetails?.salePrice}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-muted-foreground">
                  ({averageReview.toFixed(2)})
                </span>
              </div>

              <div className="mt-5 mb-5">
                {productDetails?.totalStock === 0 ? (
                  <Button className="w-full opacity-60 cursor-not-allowed">
                    Out of Stock
                  </Button>
                ) : (
                  <Button
                    className="w-full py-5 bg-[#6cc000] hover:bg-[#70a131] transition-colors"
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                  >
                    Add to Cart
                  </Button>
                )}
                {cartMsg && (
                  <p className="mt-2 text-sm text-destructive">{cartMsg}</p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Review Section */}
            <div className="max-h-[300px] overflow-auto">
              <h2 className="text-lg md:text-xl font-bold mb-4">Reviews</h2>
              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem, i) => (
                    <div key={i} className="flex gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent
                            rating={reviewItem?.reviewValue}
                          />
                        </div>
                        <p className="text-muted-foreground">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1 className="text-muted-foreground">No Reviews</h1>
                )}
              </div>

              <div className="mt-10 flex-col flex gap-2">
                <Label>Write a review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Write a review..."
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
