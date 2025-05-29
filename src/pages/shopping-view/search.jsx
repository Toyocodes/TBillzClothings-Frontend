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
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
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

  // function handleAddtoCart(getCurrentProductId, getTotalStock) {
  //   console.log(cartItems);
  //   let getCartItems = cartItems.items || [];

  //   if (getCartItems.length) {
  //     const indexOfCurrentItem = getCartItems.findIndex(
  //       (item) => item.productId === getCurrentProductId
  //     );
  //     if (indexOfCurrentItem > -1) {
  //       const getQuantity = getCartItems[indexOfCurrentItem].quantity;
  //       if (getQuantity + 1 > getTotalStock) {
  //         toast({
  //           title: `Only ${getQuantity} left in stock`,
  //           variant: "destructive",
  //         });

  //         return;
  //       }
  //     }
  //   }

  //   dispatch(
  //     addToCart({
  //       userId: user?.id,
  //       productId: getCurrentProductId,
  //       quantity: 1,
  //     })
  //   ).then((data) => {
  //     if (data?.payload?.success) {
  //       dispatch(fetchCartItems(user?.id));
  //       toast({
  //         title: "Product is added to cart",
  //       });
  //     }
  //   });
  // }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div>
      <div>
        <ShoppingHeader />
      </div>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="mb-7 mt-12 flex justify-center items-center">
          <a
            href="/"
            className="text-sm font-bold flex items-center hover:text-[#82e600]"
          >
            <p> Go Back to Home</p>
            <ArrowRight className="ml-2" />
          </a>
        </div>
        <div>
          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-2xl">
              <Input
                value={keyword}
                name="keyword"
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setHasSearched(true);
                  }
                }}
                className="py-5 px-6 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:outline-none text-base"
                placeholder="🔍 Search for products..."
              />
            </div>
          </div>

          {/* Initial Prompt */}
          {!hasSearched && !keyword && (
            <div className="text-center py-12">
              <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                What are you looking for today? 🛍️
              </h2>
              <p className="text-gray-500">
                Type a keyword and hit Enter to begin.
              </p>
            </div>
          )}

          {/* No Results Found */}
          {hasSearched && keyword && !searchResults.length && (
            <div className="text-center py-16">
              <h2 className="text-4xl font-bold text-gray-700 mb-4">
                No results found 😔
              </h2>
              <p className="text-gray-500">
                Try searching with different keywords.
              </p>
            </div>
          )}

          {/* Search Results */}
          {!!searchResults.length && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="transform transition duration-300 hover:scale-[1.02]"
                >
                  <ShoppingProductTile
                    handleAddtoCart={handleAddtoCart}
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                  />
                </div>
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
    </div>
  );
}

export default SearchProducts;
