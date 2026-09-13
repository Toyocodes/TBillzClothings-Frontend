/* eslint-disable react/prop-types */
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems} = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} left in stock`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully ",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex gap-3.5">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="h-[72px] w-[72px] flex-shrink-0 rounded-2xl border border-border object-cover"
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-foreground">
            {cartItem?.title}
          </h3>
          <button
            onClick={() => handleCartItemDelete(cartItem)}
            className="flex-shrink-0 p-0.5 text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2.5 rounded-full border border-border p-1">
            <Button
              variant="ghost"
              className="h-[22px] w-[22px] rounded-full bg-secondary p-0"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="h-2.5 w-2.5" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="min-w-[10px] text-center text-sm font-bold text-foreground">
              {cartItem?.quantity}
            </span>
            <Button
              variant="ghost"
              className="h-[22px] w-[22px] rounded-full bg-secondary p-0"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="h-2.5 w-2.5" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <p className="font-display text-sm font-bold text-foreground">
            ₦
            {(
              (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
              cartItem?.quantity
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
