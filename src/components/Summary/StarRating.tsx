interface StarRatingProps {
  stars: 1 | 2 | 3;
  maxStars?: number;
}

export default function StarRating({ stars, maxStars = 3 }: StarRatingProps) {
  const starCount = Math.max(maxStars, stars);

  return (
    <div className="summary-stars" role="img" aria-label={`${stars} out of ${starCount} stars`}>
      {Array.from({ length: starCount }, (_, index) => {
        const filled = index < stars;

        return (
          <span
            key={index}
            className={`summary-stars__star ${filled ? 'is-filled' : 'is-empty'}`}
            style={{ animationDelay: `${index * 90}ms` }}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
