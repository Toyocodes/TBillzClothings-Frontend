import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { getOrderStatusBadgeClass } from "@/lib/utils";

function ShoppingOrders() {
  const dispatch = useDispatch();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetails(getId));
  };

  const sortedOrders = [...(orderList || [])].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base">Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {paginatedOrders.length > 0 ? (
          <>
            {/* Mobile: stacked cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {paginatedOrders.map((orderItem) => (
                <div
                  key={orderItem?._id}
                  className="rounded-xl border border-border bg-secondary/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-muted-foreground">
                        Order #{orderItem?._id?.slice(-8)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {orderItem?.orderDate?.split("T")[0]}
                      </p>
                    </div>
                    <Badge className={`flex-shrink-0 px-2.5 py-1 text-xs ${getOrderStatusBadgeClass(orderItem?.orderStatus)}`}>
                      {orderItem?.orderStatus}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-base font-bold text-foreground">
                      ₦{orderItem?.totalAmount?.toLocaleString()}
                    </span>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        View Details
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Order Price</TableHead>
                    <TableHead>
                      <span className="sr-only">Details</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((orderItem) => (
                    <TableRow key={orderItem?._id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{orderItem?._id?.slice(-8)}
                      </TableCell>
                      <TableCell>{orderItem?.orderDate?.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge className={`px-3 py-1 ${getOrderStatusBadgeClass(orderItem?.orderStatus)}`}>
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₦{orderItem?.totalAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          >
                            View Details
                          </Button>
                          <ShoppingOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No orders found.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant={currentPage === index + 1 ? "default" : "outline"}
                className="rounded-lg"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
