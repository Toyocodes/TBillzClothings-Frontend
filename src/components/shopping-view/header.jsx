import {
  HeartIcon,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import ThemeToggle from "../common/theme-toggle";

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
      getCurrentMenuItem.id !== "faq" &&
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
    if (menuItem.id === "home" || menuItem.id === "faq" || menuItem.id === "search") {
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
    <nav className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-7">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <span
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className={`cursor-pointer text-sm font-semibold transition-colors ${
            isActive(menuItem)
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {menuItem.label}
        </span>
      ))}
    </nav>
  );
}

function HeaderRightContent({ afterAction }) {
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

  const cartCount = cartItems?.items?.length || 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ThemeToggle />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          navigate("/wishlist");
          afterAction?.();
        }}
        className="h-10 w-10 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
      >
        <HeartIcon className="h-[18px] w-[18px]" />
        <span className="sr-only">Wishlist</span>
      </Button>

      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        >
          <ShoppingCart className="h-[18px] w-[18px]" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand2 px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
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
            <Avatar className="h-10 w-10 cursor-pointer bg-gradient-brand text-white">
              <AvatarFallback className="bg-transparent font-display font-bold text-white">
                {user.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" className="w-56">
            <DropdownMenuLabel>Logged in as {user.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigate("/shop/account");
                afterAction?.();
              }}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate("/wishlist");
                afterAction?.();
              }}
            >
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
        <Button
          onClick={() => {
            navigate("/auth/login");
            afterAction?.();
          }}
          className="rounded-full bg-gradient-brand text-sm font-semibold text-white hover:opacity-90"
        >
          Login
        </Button>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const [openMobileSheet, setOpenMobileSheet] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="flex h-[76px] items-center justify-between gap-6 px-5 md:px-10 lg:px-12">
        <div className="flex items-center gap-9">
          <Link to="/shop/home" className="flex items-center gap-2.5">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-gradient-brand">
              <ShoppingBag className="h-[18px] w-[18px] text-white" strokeWidth={2} />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Nexa <span className="text-primary">Gadgets</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:block">
            <MenuItems />
          </div>
        </div>

        <Link
          to="/search"
          className="hidden max-w-md flex-1 items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground md:flex"
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <span className="truncate text-sm">
            Search phones, laptops, headphones&hellip;
          </span>
        </Link>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>

        {/* MOBILE SHEET NAVIGATION */}
        <Sheet open={openMobileSheet} onOpenChange={setOpenMobileSheet}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-full max-w-xs flex-col gap-6">
            <MenuItems closeSheet={() => setOpenMobileSheet(false)} />
            <div className="h-px bg-border" />
            <HeaderRightContent afterAction={() => setOpenMobileSheet(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
export default ShoppingHeader;
