import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/common/spinner";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { ArrowUpDownIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, isLoading: isProductsLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  const priceBounds = useMemo(() => {
    const prices = (productList || [])
      .map((p) => (p?.salePrice > 0 ? p.salePrice : p?.price))
      .filter((n) => typeof n === "number" && !Number.isNaN(n));

    if (!prices.length) return [0, 100000];

    const min = Math.floor(Math.min(...prices) / 1000) * 1000;
    const maxRaw = Math.ceil(Math.max(...prices) / 1000) * 1000;
    const max = maxRaw === min ? min + 10000 : maxRaw;
    return [min, max];
  }, [productList]);

  const [priceRange, setPriceRange] = useState(priceBounds);

  useEffect(() => {
    setPriceRange(priceBounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceBounds[0], priceBounds[1]]);

  const priceFilteredList = (productList || []).filter((product) => {
    const effectivePrice =
      product?.salePrice > 0 ? product.salePrice : product?.price;
    return effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
  });

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
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
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  return (
    <div className="mx-auto grid max-w-[1344px] grid-cols-1 gap-8 px-5 py-8 md:grid-cols-[264px_1fr] md:px-10 md:py-10 lg:px-12">
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        priceBounds={priceBounds}
      />
      <div className="w-full">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {isProductsLoading
              ? "Loading products…"
              : `${priceFilteredList.length} products found`}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-xl border-border bg-card"
              >
                <ArrowUpDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Sort by</span>
                <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem
                    value={sortItem.id}
                    key={sortItem.id}
                  >
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isProductsLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Spinner className="h-7 w-7 text-primary" />
            <p className="text-sm text-muted-foreground">Loading products&hellip;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {priceFilteredList.length > 0
              ? priceFilteredList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem?._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : (
                  <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                    No products match the selected price range.
                  </p>
                )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingListing;
