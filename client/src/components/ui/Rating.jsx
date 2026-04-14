const Rating = ({ value, numReviews }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-yellow-400 text-sm">
          {value >= star ? "★" : value >= star - 0.5 ? "✭" : "☆"}
        </span>
      ))}
      {numReviews !== undefined && (
        <span className="text-gray-500 text-xs ml-1">({numReviews})</span>
      )}
    </div>
  );
};

export default Rating;
