import React, { useEffect, useState } from "react";
import InputField from "../atoms/InputField";

// Generic interface with a required id field
interface HasId {
  id: string | number;
}

interface SearchableDropdownProps<T extends HasId> {
  label: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearchFunction: (value: string) => Promise<T[]>;
  onItemSelect?: (item: T) => void;
  flexDir?: "row" | "col";
  // These functions allow customization of display and selected value
  getDisplayValue: (item: T) => string;
  getPrimaryText: (item: T) => string;
  getSecondaryText: (item: T) => string;
  shouldAllowSelection?: (item: T) => boolean;
  notAllowedText?: (item: T) => string;
}

const SearchableDropdown = <T extends HasId>({
  label,
  flexDir = "col",
  searchValue,
  setSearchValue,
  onSearchFunction,
  onItemSelect,
  getDisplayValue,
  getPrimaryText,
  getSecondaryText,
  shouldAllowSelection = () => true,
  notAllowedText = () => "Not allowed",
}: SearchableDropdownProps<T>) => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchValue.trim()) {
        setIsLoading(true);
        try {
          const res = await onSearchFunction(searchValue);
          setResults(res);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    };
    const timeoutId = setTimeout(fetchResults, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearchFunction]);

  const handleSelectItem = (item: T) => {
    if (onItemSelect && shouldAllowSelection(item)) {
      onItemSelect(item);
      setSearchValue(getDisplayValue(item));
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col relative">
      <InputField
        type="text"
        label={label}
        flexDir={flexDir}
        value={searchValue}
        onChange={setSearchValue}
        onFocus={() => {
          setIsSearching(true);
        }}
        onBlur={(e) => {
          // Delay closing the dropdown to allow clicks on the results
          setTimeout(() => setIsSearching(false), 200);
        }}
        className="w-full"
      />
      {isSearching && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto top-full">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">Loading...</div>
          ) : results.length > 0 ? (
            results.map((item) => {
              const isSelectable = shouldAllowSelection(item);
              return (
                <div
                  key={item.id}
                  className={`px-4 py-2 ${
                    isSelectable
                      ? "hover:bg-gray-100 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onMouseDown={(e) => {
                    if (!isSelectable) {
                      e.preventDefault();
                      return;
                    }
                    handleSelectItem(item);
                  }}
                >
                  <div className="font-medium">{getPrimaryText(item)}</div>
                  <div className="text-sm text-gray-500">
                    {getSecondaryText(item)}
                  </div>
                  {!isSelectable && (
                    <div className="text-xs text-red-500 italic">
                      {notAllowedText(item)}
                    </div>
                  )}
                </div>
              );
            })
          ) : searchValue.trim() ? (
            <div className="p-3 text-center text-gray-500">
              No results found
            </div>
          ) : (
            <div className="p-3 text-center text-gray-500">
              Start typing to search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
