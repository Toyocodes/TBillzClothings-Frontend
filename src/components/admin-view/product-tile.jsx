import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="w-full max-w-sm mx-auto">
        <div>
          <div className="relative">
            <img
              key={product.image}
              src={product?.image}
              alt={product?.title}
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
          </div>
          <CardContent>
            <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span
                className={`${
                  product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
              >
                ₦{product?.price}
              </span>
              {product?.salePrice > 0 && (
                <span className="text-lg font-bold">₦{product?.salePrice}</span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowModal(true)}
            >
              Delete
            </Button>
          </CardFooter>
        </div>
      </Card>

      {/* Simple Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete this product?
            </h2>
            <p className="mb-6 text-gray-600">
              This action cannot be undone. This will permanently remove{" "}
              <span className="font-bold">{product?.title}</span>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(product?._id);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminProductTile;
