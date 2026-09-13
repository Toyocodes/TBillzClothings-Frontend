import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShoppingBag } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-success/20 blur-[90px]" />

        <div className="relative rounded-[28px] border border-border bg-card p-8 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </span>

          <h1 className="mt-5 font-display text-2xl font-bold text-foreground md:text-3xl">
            Payment Successful!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed and is
            being prepared for delivery.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={() => navigate("/shop/account")}
              className="w-full gap-2 rounded-2xl bg-gradient-brand py-6 text-sm font-bold text-white hover:opacity-90"
            >
              View My Orders
            </Button>
            <Button
              onClick={() => navigate("/shop/home")}
              variant="outline"
              className="w-full gap-2 rounded-2xl border-border py-6 text-sm font-semibold"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
