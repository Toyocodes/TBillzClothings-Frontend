/* eslint-disable react/prop-types */
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="flex w-full flex-col gap-0 border-border bg-card p-0 sm:max-w-md">
      <SheetHeader className="flex-row items-center gap-2.5 space-y-0 border-b border-border px-6 py-5 text-left">
        <ShoppingCart className="h-[18px] w-[18px] text-foreground" />
        <SheetTitle className="font-display text-lg">
          Your Cart ({cartItems?.length || 0})
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item?.productId} cartItem={item} />
          ))
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Your cart is empty.
          </p>
        )}
      </div>

      <div className="space-y-4 border-t border-border bg-card px-6 py-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-muted-foreground">Total</span>
          <span className="font-display text-xl font-bold text-foreground">
            ₦{totalCartAmount.toLocaleString()}
          </span>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full rounded-2xl bg-gradient-brand py-6 text-sm font-bold text-white shadow-[0_10px_30px_-8px_hsl(var(--primary)/0.55)] hover:opacity-90"
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
