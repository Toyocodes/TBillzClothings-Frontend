import {
  HeartIcon,
  HomeIcon,
  HousePlug,
  ListOrdered,
  LogOut,
  LucideShoppingCart,
  Menu,
  ShoppingBagIcon,
  ShoppingBasket,
  ShoppingBasketIcon,
  ShoppingCart,
  ShoppingCartIcon,
  StoreIcon,
  UserCog,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems({ closeSheet }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get("category");

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      // Set query param for category
      navigate(`/shop/listing?category=${getCurrentMenuItem.id}`);
    } else {
      navigate(getCurrentMenuItem.path);
    }

    if (closeSheet) closeSheet(); // Close the mobile sheet
  }

  // Determine if menu item is active
  function isActive(menuItem) {
    if (menuItem.id === "home" || menuItem.id === "search") {
      // Check pathname directly for unique paths
      return location.pathname === menuItem.path;
    }

    // For products and category items, check if pathname is /shop/listing
    // AND category query param matches the menu item's id
    if (location.pathname === "/shop/listing") {
      if (menuItem.id === "products") {
        // "Products" menu is active if no category param is set
        return currentCategory === null;
      }
      return currentCategory === menuItem.id;
    }

    return false;
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className={`text-sm font-medium cursor-pointer transition-colors ${
            isActive(menuItem) ? "text-[#82e600] font-bold" : ""
          }`}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}


function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }


  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4 cursor-pointer">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {/* Authenticated User - Show Dropdown */}
      {user?.userName ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>Logged in as {user.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/wishlist")}>
              <HeartIcon className="mr-2 h-4 w-4" />
              My Wishlist
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // Unauthenticated User - Show Login Button
        <Button onClick={() => navigate("/auth/login")} className="text-sm">
          Login
        </Button>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [openMobileSheet, setOpenMobileSheet] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6 md:px-28">
        <Link to="/shop/home" className="flex items-center gap-2">
          <ShoppingBagIcon className="h-6 w-6" />
          <span className="font-bold">TBillzStore</span>
        </Link>

        {/* MOBILE SHEET NAVIGATION */}
        <Sheet open={openMobileSheet} onOpenChange={setOpenMobileSheet}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems closeSheet={() => setOpenMobileSheet(false)} />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}
export default ShoppingHeader;