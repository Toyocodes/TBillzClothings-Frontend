import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`relative cursor-pointer rounded-2xl border bg-card transition-colors ${
        isSelected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
      }`}
    >
      {isSelected && (
        <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-primary" />
      )}
      <CardContent className="grid gap-1.5 p-4 pr-10 text-sm">
        <p className="font-semibold text-foreground">{addressInfo?.address}</p>
        <p className="text-muted-foreground">
          {addressInfo?.city} &middot; {addressInfo?.pincode}
        </p>
        <p className="text-muted-foreground">{addressInfo?.phone}</p>
        {addressInfo?.notes && (
          <p className="text-xs text-muted-foreground">Notes: {addressInfo?.notes}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-lg text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
