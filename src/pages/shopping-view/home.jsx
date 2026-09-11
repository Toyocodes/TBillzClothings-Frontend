import { Button } from "@/components/ui/button";
import heroPhone from "../../assets/home-one.png";
import heroLaptop from "../../assets/home-three.png";
import heroAudio from "../../assets/home-two.png";
import {
  Headphones,
  BatteryCharging,
  Smartphone,
  Watch,
  Laptop,
  Sparkles,
} from "lucide-react";

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
import Footer from "./footer";
import CategorySection from "@/components/shopping-view/category-section-below";

const categoriesWithIcon = [
  { id: "headphones", label: "Headphones", icon: Headphones },
  { id: "airpods", label: "AirPods", icon: Headphones },
  { id: "powerbanks", label: "Power Banks", icon: BatteryCharging },
  { id: "phones", label: "Phones", icon: Smartphone },
  { id: "smartwatch", label: "Smartwatch", icon: Watch },
  { id: "laptop", label: "Laptop", icon: Laptop },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const featureImageList = [
    {
      id: 1,
      image: heroPhone,
      tag: "Smartphones",
      icon: Smartphone,
      title: "Discover Our Exclusive Tech Collection",
      description: "Handpicked gadgets built for performance, style, and everyday use.",
    },
    {
      id: 2,
      image: heroLaptop,
      tag: "Laptops",
      icon: Laptop,
      title: "Experience Innovation at Your Fingertips",
      description: "Upgrade your life with the latest phones, laptops, and smart devices.",
    },
    {
      id: 3,
      image: heroAudio,
      tag: "New Arrivals",
      icon: Sparkles,
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden px-5 py-16 md:px-10 md:py-24 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 560px at 12% -15%, hsl(var(--primary)/0.20), transparent 60%), radial-gradient(900px 520px at 92% 5%, hsl(var(--brand-2)/0.16), transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex max-w-[1344px] flex-col items-center gap-12 md:flex-row md:justify-between">
          <div className="flex max-w-xl flex-col items-start gap-6 text-left">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
              New &middot; Fresh arrivals every week
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl 2xl:text-[3.6rem]">
              {featureImageList[currentSlide].title}
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              {featureImageList[currentSlide].description}
            </p>
            <Button
              onClick={() => navigate("/shop/listing")}
              className="rounded-2xl bg-gradient-brand px-7 py-6 text-sm font-bold text-white shadow-[0_8px_32px_-6px_hsl(var(--primary)/0.55)] hover:opacity-90"
            >
              Shop Now
            </Button>
            <div className="flex gap-8 pt-2">
              <div>
                <div className="font-display text-xl font-bold text-foreground">4.8&#9733;</div>
                <div className="text-xs text-muted-foreground">Average rating</div>
              </div>
              <div>
                <div className="font-display text-xl font-bold text-foreground">24h</div>
                <div className="text-xs text-muted-foreground">Fast delivery</div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            {/* ambient glow, no flat background behind the image */}
            <div className="pointer-events-none absolute -right-10 -top-12 h-64 w-64 rounded-full bg-primary/25 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 h-64 w-64 rounded-full bg-brand2/20 blur-[90px]" />

            <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-[32px] md:h-[460px]">
              {featureImageList.map((slide, index) => (
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={slide.title}
                  className={`absolute inset-0 h-full w-full object-contain p-8 transition-opacity duration-700 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              {/* glassmorphic floating chip */}
              <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-2xl bg-black/30 px-4 py-3 backdrop-blur-xl">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full  text-white">
                  {(() => {
                    const SlideIcon = featureImageList[currentSlide].icon;
                    return <SlideIcon className="h-4 w-4" />;
                  })()}
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-white/60">
                    Featured this week
                  </div>
                  <div className="truncate font-display text-sm font-bold text-white">
                    {featureImageList[currentSlide].tag}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-10 flex justify-center gap-2">
          {featureImageList.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlide
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORY */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-5 md:px-12">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lg:gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="group mx-auto flex w-full max-w-[130px] cursor-pointer flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-3 py-6 shadow-sm transition-colors hover:border-primary/40"
              >
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <categoryItem.icon className="h-6 w-6" />
                </div>
                <span className="text-center text-sm font-semibold text-foreground">
                  {categoryItem.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS  */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-5 md:px-12">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem?._id}
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
