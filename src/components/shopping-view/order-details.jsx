import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent
      className="w-full sm:max-w-[600px] max-w-[90vw] max-h-[80vh] overflow-auto rounded-xl border bg-white p-6 shadow-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      }}
      overlayClassName="!bg-black/10"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date:</span>
              <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Price:</span>
              <Label>₦{orderDetails?.totalAmount}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status:</span>
              <Label>{orderDetails?.paymentStatus}</Label>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Status:</span>
              <Badge
                className={`text-white ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-orange-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "inShipping"
                    ? "bg-yellow-500"
                    : orderDetails?.orderStatus === "delivered"
                    ? "bg-green-600"
                    : "bg-slate-500"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4">Order Items</h3>
          <ul className="space-y-2 text-sm">
            {orderDetails?.cartItems?.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center rounded-lg bg-muted px-4 py-2"
              >
                <span className="text-foreground font-medium">{item.title}</span>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>Qty: {item.quantity}</span>
                  <span>₦{item.price}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Name:</span> {user.userName}</p>
            <p>{orderDetails?.addressInfo?.address}</p>
            <p>{orderDetails?.addressInfo?.city}</p>
            <p>{orderDetails?.addressInfo?.pincode}</p>
            <p>{orderDetails?.addressInfo?.phone}</p>
            {orderDetails?.addressInfo?.notes && (
              <p className="italic">Notes: {orderDetails?.addressInfo?.notes}</p>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
