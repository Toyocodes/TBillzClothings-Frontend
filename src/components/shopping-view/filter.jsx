import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="rounded-[20px] border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="font-display text-base font-bold text-foreground">Filters</h2>
      </div>
      <div className="space-y-5 p-5">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {keyItem}
              </h3>
              <div className="grid gap-2.5">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground"
                  >
                    <Checkbox
                      className="h-[18px] w-[18px] rounded-[6px]"
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
