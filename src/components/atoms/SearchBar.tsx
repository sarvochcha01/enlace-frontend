import { Search } from "lucide-react";
import React from "react";

interface SearchBarProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchKeyword,
  setSearchKeyword,
  isSearching,
  setIsSearching,
  placeholder,
}) => {
  return (
    <div
      className={`w-full h-8 bg-white  rounded-lg flex items-center justify-between p-1 outline ${
        isSearching
          ? " outline-2 outline-primary transition-all duration-200"
          : " outline-1 outline-black transition-all duration-200"
      }`}
    >
      <button>
        <Search size={20} />
      </button>
      <input
        type="text"
        className="w-full outline-none px-2"
        placeholder={placeholder || "Search..."}
        value={searchKeyword}
        onClick={() => setIsSearching(true)}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onBlur={() => setIsSearching(false)}
      />
    </div>
  );
};

export default SearchBar;
