import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/spinner";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, ShieldCheck } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function payWithPaystack(orderId, totalAmount, email) {
    // Generate a unique reference for the transaction
    const reference = new Date().getTime().toString();
    // Save the orderId in sessionStorage to verify payment later
    sessionStorage.setItem("currentOrderId", JSON.stringify(orderId));

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // your paystack public test key
      email: email,
      amount: totalAmount * 100, // Paystack amount in kobo
      currency: "NGN",
      ref: reference,
      callback: function (response) {
        // Payment complete; redirect to our verification callback page
        window.location.href = `/shop/paystack-return?reference=${response.reference}`;
      },
      onClose: function () {
        setIsPaymentStart(false);
        toast({ title: "Payment was cancelled", variant: "destructive" });
      },
    });
    handler.openIframe();
  }

  function handleInitiatePaystackPayment() {
    if (!cartItems || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paystack", // Changed to paystack
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
        payWithPaystack(data.payload.orderId, totalCartAmount, user.email);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-10 md:py-10">
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground md:text-3xl">
        Checkout
      </h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-base font-bold text-foreground">Order Summary</h2>

          <div className="max-h-[340px] space-y-4 overflow-y-auto pr-1">
            {cartItems && cartItems.items && cartItems.items.length > 0 ? (
              cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Total</span>
              <span className="font-display text-xl font-bold text-foreground">
                ₦{totalCartAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            onClick={handleInitiatePaystackPayment}
            disabled={isPaymentStart}
            className="w-full gap-2 rounded-2xl bg-gradient-brand py-6 text-sm font-bold text-white shadow-[0_10px_30px_-8px_hsl(var(--primary)/0.55)] hover:opacity-90"
          >
            {isPaymentStart ? (
              <>
                <Spinner />
                Processing Payment&hellip;
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Checkout with Paystack
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure payment powered by Paystack
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;



