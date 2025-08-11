import React from "react";
import { FaComments } from "react-icons/fa";

const ChatToggleButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
      title="खेती सहायक"
    >
      <FaComments size={24} />
    </button>
  );
};

export default ChatToggleButton;
