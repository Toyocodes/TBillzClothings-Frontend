import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";

function ProductFilter({
  filters,
  handleFilter,
  priceRange,
  onPriceRangeChange,
  priceBounds,
}) {
  const [minBound, maxBound] = priceBounds;
  const isPriceNarrowed =
    priceRange[0] !== minBound || priceRange[1] !== maxBound;

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

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Price Range
            </h3>
            {isPriceNarrowed && (
              <button
                type="button"
                onClick={() => onPriceRangeChange([minBound, maxBound])}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <Slider
            value={priceRange}
            min={minBound}
            max={maxBound}
            step={10000}
            minStepsBetweenThumbs={1}
            onValueChange={onPriceRangeChange}
            className="mb-3"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>&#8358;{priceRange[0].toLocaleString()}</span>
            <span>&#8358;{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
