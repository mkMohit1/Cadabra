import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setInputValue("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="flex items-center w-4/5 border border-gray-300 rounded-full p-1 bg-white mx-auto">
      <div className="flex items-center flex-grow mr-2 px-2">
        <i className="fa fa-search text-gray-400 mr-2" aria-hidden="true"></i>
        <input
          type="text"
          placeholder="Search your blogs..."
          value={inputValue}
          onChange={handleInputChange}
          className="border-none outline-none flex-grow"
        />
      </div>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded-full mr-2 hover:bg-red-600"
        onClick={handleClear}
      >
        Clear
      </button>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
