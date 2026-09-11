import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { ShoppingCart, StarIcon } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="group w-full max-w-sm mx-auto overflow-hidden rounded-[20px] border-border bg-card transition-colors hover:border-primary/40">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative h-[220px] overflow-hidden bg-muted">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Rating badge */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-neutral-900 shadow">
            <StarIcon className="h-3.5 w-3.5 fill-primary text-primary" />
            {product?.averageReview?.toFixed(1) || "0.0"}
          </div>

          {/* Dynamic badges */}
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3.5 left-3.5 rounded-full border-none bg-destructive px-3 py-1 text-xs text-destructive-foreground shadow-md">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3.5 left-3.5 rounded-full border-none bg-warning px-3 py-1 text-xs text-neutral-900 shadow-md">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3.5 left-3.5 rounded-full border-none bg-success px-3 py-1 text-xs text-white shadow-md">
              Sale
            </Badge>
          ) : null}
        </div>

        <CardContent className="space-y-1.5 px-5 py-4">
          <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>{brandOptionsMap[product?.brand]}</span>
            <span>{categoryOptionsMap[product?.category]}</span>
          </div>
          <h2 className="line-clamp-1 font-display text-base font-semibold text-foreground">
            {product?.title}
          </h2>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span
              className={`font-display font-bold ${
                product?.salePrice > 0
                  ? "text-sm text-muted-foreground line-through"
                  : "text-lg text-foreground md:text-xl"
              }`}
            >
              ₦{product?.price.toLocaleString()}
            </span>
            {product?.salePrice > 0 && (
              <span className="font-display text-lg font-bold text-foreground md:text-xl">
                ₦{product?.salePrice.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="px-5 pb-5 pt-0">
        {product?.totalStock === 0 ? (
          <Button
            className="w-full cursor-not-allowed rounded-2xl bg-secondary text-muted-foreground opacity-70"
            disabled
          >
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full gap-2 rounded-2xl bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
