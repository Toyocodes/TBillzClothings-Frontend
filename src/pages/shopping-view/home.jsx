import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner1.png";
import bannerTwo from "../../assets/banner2.png";
import bannerThree from "../../assets/banner3.png";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import Footer from "./footer";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  // const { featureImageList } = useSelector((state) => state.commonFeature);

  const featureImageList = [
    {
      id: 1,
      image: bannerOne,
      title: "Discover Our Exclusive Collection",
      description: "We picked all items with care, you must try at least one.",
    },
    {
      id: 2,
      image: bannerTwo,
      title: "Discover Style that Speaks for You",
      description: "Upgrade your wardrobe with our latest trends.",
    },
    {
      id: 3,
      image: bannerThree,
      title: "Discover the Best of the Best",
      description:
        "Quality and comfort like never before for you and your family.",
    },
  ];

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="relative w-full flex flex-col md:flex-row items-center justify-between py-12 px-16 md:px-28 rounded-lg shadow-lg">
        {/* Text Section */}
        <div className=" space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl 2xl:text-[3.8rem] font-bold text-[#78b627]  max-w-xl md:leading-[50px] 2xl:leading-[70px]">
            {featureImageList[currentSlide].title}
          </h1>
          <p className="text-lg text-gray-700">
            {featureImageList[currentSlide].description}
          </p>
          <Button
            onClick={() => navigate("/shop/listing")}
            className="bg-[#78b627] text-white px-6 py-2.5 rounded-lg cursor-pointer"
          >
            Shop Now
          </Button>
        </div>

        {/* Image Section */}
        <div className="">
          <img
            src={featureImageList[currentSlide].image}
            alt="Feature"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Button>
      </div>
      {/* CATEGORY */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer group w-full max-w-[130px] mx-auto rounded-xl border-none bg-[#6cc000] transition-transform duration-300 hover:bg-[#70a131] hover:scale-105 shadow-md"
              >
                <CardContent className="flex flex-col items-center justify-center p-3 space-y-3 text-white">
                  <div className="bg-white/20 rounded-full p-3">
                    <categoryItem.icon className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-base text-center">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND */}
      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-12">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer group w-full max-w-[130px] mx-auto rounded-xl border-none bg-[#6cc000] transition-transform duration-300 hover:bg-[#70a131] hover:scale-105 shadow-md"
              >
                <CardContent className="flex flex-col items-center justify-center p-3 space-y-3 text-white">
                  <div className="bg-white/20 rounded-full p-3">
                    <brandItem.icon className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-base text-center">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* ALL PRODUCTS  */}

      <section className="py-12">
        <div className="container mx-auto px-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
