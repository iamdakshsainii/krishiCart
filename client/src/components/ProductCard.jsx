import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.svg";

const ProductCard = ({ product }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  return (
    <div className="card transition-transform duration-300 rounded-xl shadow-md hover:shadow-lg bg-white">
      <div className="relative h-56 overflow-hidden rounded-t-xl">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-50 flex items-center justify-center">
            <img src={placeholder} alt="placeholder" className="w-20 h-20" />
          </div>
        )}
        {product.isOrganic && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold rounded-full px-2 py-1 shadow-md">
            Organic
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate text-blue-900">{product.name}</h3>
        <p className="text-blue-600 text-sm mb-2">
          {product.category?.name || "General"}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-blue-700 font-bold">
            ₨{product.price.toFixed(2)} / {product.unit}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
