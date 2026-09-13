import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { getOrderStatusBadgeClass } from "@/lib/utils";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="max-h-[85vh] w-full max-w-[90vw] overflow-auto rounded-2xl border-border bg-card p-6 sm:max-w-[600px]">
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-foreground">Order Summary</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="truncate font-medium text-foreground">{orderDetails?._id}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Order Date:</span>
              <span className="font-medium text-foreground">{orderDetails?.orderDate.split("T")[0]}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="font-medium text-foreground">₦{orderDetails?.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium capitalize text-foreground">{orderDetails?.paymentMethod}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Payment Status:</span>
              <span className="font-medium capitalize text-foreground">{orderDetails?.paymentStatus}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Order Status:</span>
              <Badge className={getOrderStatusBadgeClass(orderDetails?.orderStatus)}>
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-foreground">Order Items</h3>
          <ul className="space-y-2 text-sm">
            {orderDetails?.cartItems?.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 rounded-xl bg-secondary/50 px-4 py-2.5"
              >
                <span className="truncate font-medium text-foreground">{item.title}</span>
                <div className="flex flex-shrink-0 items-center gap-4 text-muted-foreground">
                  <span>Qty: {item.quantity}</span>
                  <span>₦{item.price?.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-foreground">Shipping Information</h3>
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
