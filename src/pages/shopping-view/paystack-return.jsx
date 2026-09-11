import Spinner from "@/components/common/spinner";
import { verifyPayment } from "@/store/shop/order-slice"; // Adjust the path as needed
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaystackReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reference = params.get("reference"); // Paypal returns the payment reference in 'reference'

  useEffect(() => {
    if (reference) {
      // Retrieve the orderId stored in sessionStorage from checkout
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      dispatch(verifyPayment({ reference, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [reference, dispatch]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <Spinner className="h-9 w-9 text-primary" />
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Processing Payment&hellip;
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Please wait while we confirm your payment. Do not close this page.
        </p>
      </div>
    </div>
  );
}

export default PaystackReturnPage;
