import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen w-full gap-3 text-gray-700 bg-gray-50"
      role="status"
      aria-live="polite"
    >
      <div
        className="animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-blue-600"
        aria-hidden="true"
      ></div>
      <span className="text-lg font-medium">{message}</span>
    </div>
  );
};

export default Loading;
