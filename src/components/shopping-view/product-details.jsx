import { HeartIcon, ShoppingCart } from "lucide-react";
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
import { brandOptionsMap, categoryOptionsMap } from "@/config";

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
  const hasSale = productDetails?.salePrice > 0;
  const percentOff = hasSale
    ? Math.round((1 - productDetails.salePrice / productDetails.price) * 100)
    : 0;
  const inStock = productDetails?.totalStock > 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[28px] border-border bg-card p-4 sm:max-w-[95vw] sm:p-6 md:max-w-[90vw] md:p-10 lg:max-w-[80vw]">
        <div className="flex w-full flex-col gap-10 md:flex-row">
          {/* Product image */}
          <div className="relative mx-auto w-full max-w-[420px] md:w-1/2 md:max-w-none">
            <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-primary/25 blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-brand2/20 blur-[70px]" />
            <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-border bg-muted">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product content */}
          <div className="flex w-full flex-col justify-between md:w-1/2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                {brandOptionsMap[productDetails?.brand]}
                {productDetails?.category
                  ? ` · ${categoryOptionsMap[productDetails?.category]}`
                  : ""}
              </span>

              <div className="mt-1.5 flex items-start justify-between gap-4">
                <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {productDetails?.title}
                </h1>
                <button
                  onClick={handleWishlistToggle}
                  className="flex-shrink-0 rounded-full border border-border bg-background p-2.5 transition-colors hover:border-primary/40"
                >
                  <HeartIcon
                    className="h-5 w-5"
                    fill={isInWishlist ? "hsl(var(--primary))" : "none"}
                    stroke={isInWishlist ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <StarRatingComponent rating={averageReview} />
                  <span className="ml-1 text-sm text-muted-foreground">
                    {averageReview.toFixed(1)} ({reviews?.length || 0})
                  </span>
                </div>
                <span className="h-3.5 w-px bg-border" />
                <span
                  className={`flex items-center gap-1.5 text-sm font-medium ${
                    inStock ? "text-success" : "text-destructive"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-success" : "bg-destructive"}`}
                  />
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <p className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  ₦{(hasSale ? productDetails.salePrice : productDetails?.price)?.toLocaleString()}
                </p>
                {hasSale && (
                  <>
                    <p className="text-base text-muted-foreground line-through">
                      ₦{productDetails?.price?.toLocaleString()}
                    </p>
                    <span className="rounded-full bg-success px-2.5 py-1 text-xs font-bold text-white">
                      {percentOff}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="mb-5 mt-4 text-base leading-relaxed">
                {productDetails?.description} 
              </p>

              <div className="mb-5">
                {!inStock ? (
                  <Button className="w-full cursor-not-allowed rounded-2xl bg-secondary text-muted-foreground opacity-70">
                    Out of Stock
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2 rounded-2xl bg-gradient-brand py-6 text-white shadow-[0_8px_28px_-8px_hsl(var(--primary)/0.55)] hover:opacity-90"
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                  >
                    <ShoppingCart className="h-4 w-4" />
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
              <h2 className="font-display text-lg md:text-xl font-bold mb-4 text-foreground">
                Reviews
              </h2>
              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem, i) => (
                    <div key={i} className="flex gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{reviewItem?.userName}</h3>
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
                  className="rounded-xl border-border bg-background"
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                  className="rounded-xl"
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
