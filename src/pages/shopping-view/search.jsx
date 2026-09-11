import ShoppingHeader from "@/components/shopping-view/header";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { ArrowRight, SearchIcon, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const trimmed = keyword.trim();
    if (trimmed.length > 3) {
      const timeout = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${trimmed}`));
        dispatch(getSearchResults(trimmed));
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  // useEffect(() => {
  //   if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
  //     setTimeout(() => {
  //       setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
  //       dispatch(getSearchResults(keyword));
  //     }, 1000);
  //   } else {
  //     setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
  //     dispatch(resetSearchResults());
  //   }
  // }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user?.id) {
      toast({
        title: "Please log in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    const getCartItems = cartItems.items || [];
    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId
    );
    if (indexOfCurrentItem > -1) {
      const getQuantity = getCartItems[indexOfCurrentItem].quantity;
      if (getQuantity + 1 > getTotalStock) {
        toast({
          title: `Only ${getQuantity} left in stock`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="min-h-screen bg-background">
      <ShoppingHeader />
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-10">
        <div className="mb-8 flex justify-center">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            Go Back to Home
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Search Bar */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              name="keyword"
              autoFocus
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setHasSearched(true);
                }
              }}
              className="h-14 rounded-2xl border-border bg-card pl-12 pr-5 text-base focus-visible:ring-primary"
              placeholder="Search for phones, laptops, headphones…"
            />
          </div>
        </div>

        {/* Initial Prompt */}
        {!hasSearched && !keyword && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <SearchIcon className="h-6 w-6" />
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground">
              What are you looking for today?
            </h2>
            <p className="text-muted-foreground">
              Type a keyword and hit Enter to begin.
            </p>
          </div>
        )}

        {/* No Results Found */}
        {hasSearched && keyword && !searchResults.length && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <SearchX className="h-6 w-6" />
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground">
              No results found
            </h2>
            <p className="text-muted-foreground">
              Try searching with different keywords.
            </p>
          </div>
        )}

        {/* Search Results */}
        {!!searchResults.length && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.map((item) => (
              <ShoppingProductTile
                key={item.id}
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        )}

        {/* Product Details Modal */}
        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      </div>
    </div>
  );
}

export default SearchProducts;
