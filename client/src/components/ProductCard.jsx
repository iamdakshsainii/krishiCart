import { Link } from "react-router-dom";
import { FaLeaf, FaEye } from "react-icons/fa";
import placeholder from "../assets/placeholder.svg";

const ProductCard = ({ product }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  return (
    <div className="group card h-full flex flex-col transition-all duration-300 rounded-xl shadow-md hover:shadow-xl bg-white hover:-translate-y-1 border border-gray-100 hover:border-blue-200">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden rounded-t-xl">
        {product.images && product.images.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={product.images[0]}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center z-10">
              <Link
                to={`/products/${product._id}`}
                className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-blue-600 px-3 py-2 rounded-lg shadow-lg hover:bg-blue-50 flex items-center gap-1 font-medium text-sm"
              >
                <FaEye className="text-xs" />
                View
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-gray-100 transition-all duration-300">
            <img
              src={placeholder}
              alt="placeholder"
              className="w-20 h-20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
            />
          </div>
        )}

        {/* Organic Badge */}
        {product.isOrganic && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-1 shadow-md flex items-center gap-1 transform group-hover:scale-105 transition-transform duration-300 z-20">
            <FaLeaf className="text-xs" />
            Organic
          </span>
        )}

        {/* Out of Stock Banner */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-t-xl z-30">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300 overflow-hidden whitespace-nowrap text-ellipsis">
          {product.name}
        </h3>

        <p className="text-blue-500 text-sm mb-3 font-medium">
          {product.category?.name || "General"}
        </p>

        {product.description && (
          <p
            className="text-gray-600 text-sm mb-3 overflow-hidden flex-grow"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.description}
          </p>
        )}

        {/* Price & Buy */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-600">
              ₨{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">per {product.unit}</span>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium shadow-sm hover:shadow-md"
          >
            Buy Now
          </Link>
        </div>

        {/* Farmer Info */}
        {product.farmer && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              From:{" "}
              <span className="font-medium text-gray-700">
                {product.farmer.name || "Local Farmer"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
