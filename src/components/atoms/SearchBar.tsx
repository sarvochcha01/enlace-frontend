import { Search } from "lucide-react";
import React from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  isSearching,
  setIsSearching,
  placeholder,
}) => {
  return (
    <div className="relative w-full border border-gray-400 rounded-lg">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        className="bg-white border p-2 w-full h-full border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10  shadow-sm"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearching(true)}
        onBlur={() => setIsSearching(false)}
      />
    </div>
  );
};

export default SearchBar;
