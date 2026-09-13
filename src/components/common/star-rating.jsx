import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
  const isInteractive = Boolean(handleRatingChange);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!isInteractive}
            onClick={isInteractive ? () => handleRatingChange(star) : undefined}
            className={`p-0 ${
              isInteractive
                ? "cursor-pointer transition-transform hover:scale-110"
                : "cursor-default"
            }`}
          >
            <StarIcon
              className={`h-4 w-4 ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-border"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default StarRatingComponent;
