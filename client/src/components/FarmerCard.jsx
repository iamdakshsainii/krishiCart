import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaLeaf } from "react-icons/fa";

const FarmerCard = ({ farmer }) => {
  return (
    <div className="card transition-transform duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FaLeaf className="text-blue-500 text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{farmer.name}</h3>
            {farmer.address && (
              <div className="flex items-center text-blue-600 text-sm">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  {farmer.address.city}, {farmer.address.state}
                </span>
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/farmers/${farmer._id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Farm
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
