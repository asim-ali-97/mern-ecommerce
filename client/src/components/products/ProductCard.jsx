import { Link } from "react-router-dom";
import Rating from "../ui/Rating";

const ProductCard = ({ product }) => (
  <Link to={`/products/${product._id}`} className="group">
    <div className="card hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        <Rating value={product.rating} numReviews={product.numReviews} />
        <p className="text-lg font-bold text-blue-600 mt-auto pt-3">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  </Link>
);

export default ProductCard;
