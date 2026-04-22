import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProductByIdQuery,
  useCreateReviewMutation,
} from "../services/productsApiSlice";
import { addToCart } from "../features/cart/cartSlice";
import Spinner from "../components/ui/Spinner";
import Message from "../components/ui/Message";
import Rating from "../components/ui/Rating";
import { toast } from "react-toastify";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(id);
  const [createReview, { isLoading: reviewLoading }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({ id, rating, comment }).unwrap();
      toast.success("Review submitted");
      setComment("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Could not submit review");
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Message type="error">Product not found.</Message>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="btn-secondary mb-6 text-sm"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={product.images[imgIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <Rating value={product.rating} numReviews={product.numReviews} />
          <p className="text-3xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
          {product.images.length > 0 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  className={`w-12 h-12 object-cover rounded-lg cursor-pointer ${imgIndex == index ? "border-4 border-white" : ""}`}
                  onClick={() => setImgIndex(index)}
                ></img>
              ))}
            </div>
          )}
          <p className="text-gray-600">{product.description}</p>

          <div className="card mt-2">
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-gray-600">Status</span>
              <span
                className={
                  product.countInStock > 0
                    ? "text-green-600 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {!userInfo?.isAdmin && product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-600">Qty</span>
                <select
                  className="input-field w-24"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                    (x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}

            {!userInfo?.isAdmin && (
              <button
                className="btn-primary w-full"
                disabled={product.countInStock === 0}
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          {product.reviews.length === 0 ? (
            <Message>No reviews yet.</Message>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((r) => (
                <div key={r._id} className="card">
                  <p className="font-medium">{r.name}</p>
                  <Rating value={r.rating} />
                  <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {!userInfo?.isAdmin && userInfo && (
          <div>
            <h2 className="text-xl font-bold mb-4">Write a Review</h2>
            <form onSubmit={submitReview} className="card space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  className="input-field"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} stars
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn-primary w-full"
                type="submit"
                disabled={reviewLoading}
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
