import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { StarIcon } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
      <Card className="w-full max-w-sm mx-auto rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
          />

          {/* ⭐ Rating badge */}
          <div className="absolute top-4 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow">
            <span className="text-sm font-medium text-gray-800">
              {product?.averageReview?.toFixed(1) || "0.0"}
            </span>
            <StarIcon className="w-4 h-4 fill-[#82e600] text-[#82e600]" />
          </div>

          {/* Dynamic badges */}
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-4 left-3 bg-red-500 text-white rounded-full px-3 py-1 text-xs shadow-md">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-4 left-3 bg-orange-500 text-white rounded-full px-3 py-1 text-xs shadow-md">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-4 left-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs shadow-md">
              Sale
            </Badge>
          ) : null}
        </div>

        <CardContent className="px-5 py-4 space-y-1.5">
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-1 hover:text-primary transition-colors">
            {product?.title}
          </h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{categoryOptionsMap[product?.category]}</span>
            <span>{brandOptionsMap[product?.brand]}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-gray-400" : "text-primary"
              } font-semibold text-lg md:text-xl`}
            >
              ₦{product?.price.toLocaleString()}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-black font-semibold text-lg md:text-xl">
                ₦{product?.salePrice.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="px-5 pb-4">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-[#6cc000] py-6 hover:bg-primary/90 transition-colors"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
