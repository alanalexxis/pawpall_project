import React from "react";

const Stadistics = () => {
  const renderRating = (rating, leftLabel, rightLabel) => {
    return (
      <div className="relative mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-gray-500 text-sm font-extralight">
            {leftLabel}
          </span>
          <span className="text-gray-500 text-sm font-extralight">
            {rightLabel}
          </span>
        </div>
        <div className="flex items-center space-x-1 relative">
          <div className="flex-1 flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded ${
                  i < rating ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">
        Breed Traits & Characteristics
      </h1>
      <div className="flex space-x-4 mb-4">
        <button className="px-4 py-2 border-b-2 border-black">
          FAMILY LIFE
        </button>
        <button className="px-4 py-2">PHYSICAL</button>
        <button className="px-4 py-2">SOCIAL</button>
        <button className="px-4 py-2">PERSONALITY</button>
        <button className="px-4 py-2">ALL TRAITS</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-36 md:gap:0">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">AFFECTIONATE WITH FAMILY</h2>
            <button className="relative left-4 text-blue-600 font-bold text-lg">
              +
            </button>
          </div>
          {renderRating(3, "Independent", "Lovey-Dovey")}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">GOOD WITH YOUNG CHILDREN</h2>
            <button className="relative left-4 text-blue-600 font-bold text-lg">
              +
            </button>
          </div>
          {renderRating(2, "Not Recommended", "Good With Children")}
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">GOOD WITH OTHER DOGS</h2>
            <button className="relative left-4 text-blue-600 font-bold text-lg">
              +
            </button>
          </div>
          {renderRating(2, "Not Recommended", "Good With Other Dogs")}
        </div>
      </div>
    </div>
  );
};

export default Stadistics;
