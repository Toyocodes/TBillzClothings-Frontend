import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  HeartIcon,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Spinner from "@/components/common/spinner";
import StarRatingComponent from "@/components/common/star-rating";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/components/ui/use-toast";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import {
  addToCart,
  fetchCartItems,
  clearCartError,
} from "@/store/shop/cart-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";

function formatDescriptionAsList(description) {
  if (!description) return [];
  const lines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;

  return description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function ShoppingProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [cartMsg, setCartMsg] = useState("");

  const { productDetails, productList } = useSelector((state) => state.shopProducts);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems, error: cartError } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { items: wishlistItems = [] } = useSelector((state) => state.shopWishlist);

  useEffect(() => {
    dispatch(fetchProductDetails(productId));
    dispatch(getReviews(productId));
    setQuantity(1);
    setActiveTab("description");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [productId, dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" })
    );
  }, [dispatch]);

  useEffect(() => {
    if (cartError) {
      setCartMsg(cartError);
      toast({ title: cartError, variant: "destructive" });
    }
  }, [cartError, toast]);

  const isLoaded = productDetails && productDetails._id === productId;

  const isInWishlist = wishlistItems.some(
    (item) => item?.product?._id === productId
  );

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const hasSale = productDetails?.salePrice > 0;
  const percentOff = hasSale
    ? Math.round((1 - productDetails.salePrice / productDetails.price) * 100)
    : 0;
  const inStock = (productDetails?.totalStock || 0) > 0;
  const descriptionItems = formatDescriptionAsList(productDetails?.description);

  const relatedProducts = (productList || [])
    .filter((p) => p?._id !== productId && p?.category === productDetails?.category)
    .slice(0, 4);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleQuantityChange(delta) {
    setQuantity((prev) => {
      const next = prev + delta;
      const max = productDetails?.totalStock || 1;
      return Math.min(Math.max(1, next), max);
    });
  }

  function handleAddToCart(goToCheckout = false) {
    if (!isAuthenticated) {
      toast({ title: "Login to add to cart", variant: "destructive" });
      return;
    }

    const items = cartItems.items || [];
    const existing = items.find((i) => i.productId === productId);
    const nextQty = (existing?.quantity || 0) + quantity;
    if (nextQty > productDetails?.totalStock) {
      toast({
        title: `Only ${productDetails?.totalStock - (existing?.quantity || 0)} left in stock`,
        variant: "destructive",
      });
      return;
    }

    dispatch(clearCartError());

    dispatch(addToCart({ userId: user.id, productId, quantity }))
      .unwrap()
      .then((resp) => {
        const successMsg = resp.message || "Product added to cart";
        setCartMsg("");
        toast({ title: successMsg });
        dispatch(fetchCartItems(user.id));
        if (goToCheckout) navigate("/shop/checkout");
      })
      .catch((errPayload) => {
        const errorMsg = errPayload?.message || "Login to add to cart";
        setCartMsg(errorMsg);
        toast({ title: errorMsg, variant: "destructive" });
      });
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId,
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
        dispatch(getReviews(productId));
        toast({ title: message });
      } else {
        toast({ title: message, variant: "destructive" });
      }
    });
  }

  function handleWishlistToggle() {
    if (!isAuthenticated) {
      toast({ title: "Login to add item to wishlist", variant: "destructive" });
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist({ userId: user.id, productId }))
        .unwrap()
        .then(() => toast({ title: "Removed from wishlist" }));
    } else {
      dispatch(addToWishlist({ userId: user.id, productId }))
        .unwrap()
        .then(() => toast({ title: "Added to wishlist" }))
        .catch((err) => toast({ title: err.message, variant: "destructive" }));
    }
  }

  function handleGetProductDetails(id) {
    navigate(`/shop/product/${id}`);
  }

  function handleRelatedAddToCart(id) {
    dispatch(addToCart({ userId: user?.id, productId: id, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: "Product is added to cart" });
        }
      }
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1344px] px-5 pt-6 text-sm text-muted-foreground md:px-10 lg:px-12">
        <Link to="/shop/home" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link
          to={`/shop/listing?category=${productDetails?.category}`}
          className="hover:text-foreground"
        >
          {categoryOptionsMap[productDetails?.category]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{productDetails?.title}</span>
      </div>

      {/* Main */}
      <div className="mx-auto grid max-w-[1344px] gap-10 px-5 pb-4 pt-6 md:grid-cols-2 md:px-10 lg:px-12">
        {/* Image */}
        <div className="relative mx-auto w-full max-w-[480px] md:sticky md:top-24 md:self-start">
          <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-primary/25 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-brand2/20 blur-[70px]" />
          <div className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-border bg-card">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
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
              className="flex-shrink-0 rounded-full border border-border bg-card p-2.5 transition-colors hover:border-primary/40"
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
              <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-success" : "bg-destructive"}`} />
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

          {descriptionItems.length > 0 && (
            <ul className="mb-2 mt-4 space-y-2">
              {descriptionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {inStock && (
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-4 rounded-full border border-border px-2 py-1.5">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-foreground disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[16px] text-center text-sm font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= productDetails?.totalStock}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-foreground disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {productDetails?.totalStock} in stock
              </span>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            {!inStock ? (
              <Button className="w-full cursor-not-allowed rounded-2xl bg-secondary text-muted-foreground opacity-70">
                Out of Stock
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 rounded-2xl border-border py-6 font-semibold"
                  onClick={() => handleAddToCart(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  className="flex-1 gap-2 rounded-2xl bg-gradient-brand py-6 font-bold text-white shadow-[0_8px_28px_-8px_hsl(var(--primary)/0.55)] hover:opacity-90"
                  onClick={() => handleAddToCart(true)}
                >
                  Buy Now
                </Button>
              </>
            )}
          </div>
          {cartMsg && <p className="mt-2 text-sm text-destructive">{cartMsg}</p>}

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-2 py-4 text-center">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-[11px] leading-tight text-muted-foreground">
                Free delivery in Lagos
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-2 py-4 text-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[11px] leading-tight text-muted-foreground">
                Manufacturer warranty
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-2 py-4 text-center">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span className="text-[11px] leading-tight text-muted-foreground">
                7-day returns
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Reviews */}
      <div className="mx-auto max-w-[1344px] px-5 pb-14 pt-10 md:px-10 lg:px-12">
        <div className="mb-6 flex gap-8 border-b border-border">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "description"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "reviews"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Reviews ({reviews?.length || 0})
          </button>
        </div>

        {activeTab === "description" ? (
          descriptionItems.length > 0 ? (
            <ul className="max-w-2xl space-y-3">
              {descriptionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No description available.</p>
          )
        ) : (
          <div className="max-w-2xl">
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, i) => (
                  <div key={i} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <h3 className="font-bold text-foreground">{reviewItem?.userName}</h3>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">{reviewItem.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
                className="rounded-xl border-border bg-card"
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
                className="mt-1 w-fit rounded-xl"
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mx-auto max-w-[1344px] px-5 pb-16 md:px-10 lg:px-12">
          <Separator className="mb-10" />
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            You may also like
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleRelatedAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingProductDetailPage;
