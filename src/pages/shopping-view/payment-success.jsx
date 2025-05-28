import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl bg-white text-center animate-fade-in">
        <CardHeader className="flex flex-col items-center gap-4">
          <CheckCircle className="text-[#78b627]" size={64} />
          <CardTitle className="text-3xl font-semibold">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <p className="text-gray-600 mt-2 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <Button
          className="bg-[#78b627] hover:bg-[#6aa021] transition-colors w-full"
          onClick={() => navigate("/shop/account")}
        >
          View My Orders
        </Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
