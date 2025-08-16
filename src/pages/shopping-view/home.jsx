import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/home-one.png";
import bannerTwo from "../../assets/home-two.png";
import bannerThree from "../../assets/home-three.png";
// import {
//   Airplay,
//   BabyIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CloudLightning,
//   Heater,
//   Images,
//   Shirt,
//   ShirtIcon,
//   ShoppingBasket,
//   UmbrellaIcon,
//   WashingMachine,
//   WatchIcon,
// } from "lucide-react";
import {
  Headphones,
  BatteryCharging,
  Smartphone,
  ChevronLeftIcon,
  ChevronRightIcon,
  Watch,
  Laptop,
  Apple,
  Battery,
  Cpu,
  SmartphoneIcon,
  Monitor,
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
import CategorySection from "@/components/shopping-view/category-section-below";

// const categoriesWithIcon = [
//   { id: "men", label: "Men", icon: ShirtIcon },
//   { id: "women", label: "Women", icon: CloudLightning },
//   { id: "kids", label: "Kids", icon: BabyIcon },
//   { id: "accessories", label: "Accessories", icon: WatchIcon },
//   { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
// ];

// const brandsWithIcon = [
//   { id: "nike", label: "Nike", icon: Shirt },
//   { id: "adidas", label: "Adidas", icon: WashingMachine },
//   { id: "puma", label: "Puma", icon: ShoppingBasket },
//   { id: "levi", label: "Levi's", icon: Airplay },
//   { id: "zara", label: "Zara", icon: Images },
//   { id: "h&m", label: "H&M", icon: Heater },
// ];

const categoriesWithIcon = [
  { id: "headphones", label: "Headphones", icon: Headphones },
  { id: "airpods", label: "AirPods", icon: Headphones }, // still headphones icon, but works for AirPods too
  { id: "powerbanks", label: "Power Banks", icon: BatteryCharging },
  { id: "phones", label: "Phones", icon: Smartphone },
  { id: "smartwatch", label: "Smartwatch", icon: Watch },
  { id: "laptop", label: "Laptop", icon: Laptop },
];

const brandsWithIcon = [
  { id: "apple", label: "Apple", icon: Apple },
  { id: "oraimo", label: "Oraimo", icon: Battery },
  { id: "techno", label: "Tecno", icon: SmartphoneIcon },
  { id: "huawei", label: "Huawei", icon: Cpu },
  { id: "samsung", label: "Samsung", icon: Monitor },
  { id: "dell", label: "Dell", icon: Laptop },
  { id: "hp", label: "HP", icon: Laptop },
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
    title: "Discover Our Exclusive Tech Collection",
    description: "Handpicked gadgets built for performance, style, and everyday use.",
  },
  {
    id: 2,
    image: bannerTwo,
    title: "Experience Innovation at Your Fingertips",
    description: "Upgrade your life with the latest phones, laptops, and smart devices.",
  },
  {
    id: 3,
    image: bannerThree,
    title: "Shop the Best in Tech",
    description: "Top brands. Cutting-edge quality. Tech you can trust.",
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
    }, 4000);

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
      <div className="relative w-full flex flex-col md:flex-row items-center justify-between py-12 px-16 md:px-28 bg-black/90">
        {/* Text Section */}
        <div className=" space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl 2xl:text-[3.8rem] font-bold text-[#82e600]  max-w-xl md:leading-[50px] 2xl:leading-[70px]">
            {featureImageList[currentSlide].title}
          </h1>
          <p className="text-lg text-white">
            {featureImageList[currentSlide].description}
          </p>
          <Button
            onClick={() => navigate("/shop/listing")}
            className="bg-white text-black hover:bg-[#82e600] hover:text-white px-6 py-2.5 rounded-lg cursor-pointer"
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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer group w-[120px] mx-auto rounded-xl border-none bg-[#000000] transition-transform duration-300 hover:bg-[#70a131] hover:scale-95 shadow-md"
              >
                <CardContent className="flex flex-col items-center justify-center p-3 space-y-1 text-white">
                  <div className="bg-white/20 rounded-full p-3">
                    <categoryItem.icon className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-sm lg:text-base text-center">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 lg:gap-6">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer group w-[100px] mx-auto rounded-xl border-none bg-[#000000] transition-transform duration-300 hover:bg-[#70a131] hover:scale-105 shadow-md"
              >
                <CardContent className="flex flex-col items-center justify-center p-3 space-y-1 text-white">
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
      </section>  */}

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

      {/* CATEGORY PICTURE CARD */}
      <section>
        <CategorySection />
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
