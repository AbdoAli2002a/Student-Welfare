import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  totalReviews?: number;
  readonly?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ 
  initialRating = 0, 
  totalReviews = 0,
  readonly = false, 
  onRate,
  size = 'md' 
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleRate = (value: number) => {
    if (readonly || hasRated) return;
    setRating(value);
    setHasRated(true);
    if (onRate) onRate(value);
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly || hasRated}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !readonly && !hasRated && setHoverRating(star)}
            onMouseLeave={() => !readonly && !hasRated && setHoverRating(0)}
            className={`${readonly || hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
          >
            <Star
              className={`${starSizes[size]} transition-colors ${
                star <= (hoverRating || Math.round(rating))
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
        {totalReviews > 0 && !readonly && (
          <span className="text-xs text-slate-500 mr-2 font-semibold">
            {rating.toFixed(1)} ({totalReviews + (hasRated ? 1 : 0)})
          </span>
        )}
      </div>
      {hasRated && <span className="text-xs text-green-600 font-bold mt-1">شكراً لتقييمك!</span>}
    </div>
  );
}
