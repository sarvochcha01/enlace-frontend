import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
} from "lucide-react";
import { FC, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import SearchBar from "../../atoms/SearchBar";
import { useNotifications } from "../../../hooks/useNotification";
import { DashboardService } from "../../../services/DashboardService";
import { useDebounce } from "../../../hooks/useDebounce";
import { TaskResponseDTO } from "../../../models/dtos/Task";

interface ProjectSearchResult {
  id: string;
  name: string;
  description?: string | null;
  key: string;
  total_tasks: number;
  completed_tasks: number;
  active_tasks_assigned_to_user: number;
}

interface SearchResultData {
  projects: ProjectSearchResult[];
  tasks: TaskResponseDTO[];
}

interface NavigationBarProps {
  sideNavToggle: () => void;
  sideNavState: boolean;
}

const NavigationBar: FC<NavigationBarProps> = ({
  sideNavToggle,
  sideNavState,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultData | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);

  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { unreadCount } = useNotifications();
  const { showToast } = useToast();

  useEffect(() => {
    if (debouncedSearchKeyword.trim() === "") {
      setSearchResults(null);
      setShowResultsDropdown(false);
      setIsSearching(false);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      setShowResultsDropdown(true);
      try {
        const results = await DashboardService.search(debouncedSearchKeyword);
        setSearchResults(results);
      } catch (error) {
        showToast("Search failed. Please try again.", { type: "error" });
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedSearchKeyword, showToast]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResultsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResultClick = () => {
    setShowResultsDropdown(false);
    setSearchKeyword("");
  };

  return (
    <div className="h-12 w-full flex items-center border-b border-gray-200">
      <div className="w-1/5 h-full flex items-center justify-start pl-4">
        <button
          onClick={sideNavToggle}
          className="p-2 rounded hover:bg-gray-100"
        >
          {sideNavState ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
        </button>
        <Link to="/" className="ml-2">
          <img src="/logo.png" alt="Logo" className="h-8 md:h-10" />
        </Link>
      </div>

      <div className="w-3/5 h-full flex items-center justify-center">
        <div className="w-2/3 md:w-1/2 relative" ref={searchContainerRef}>
          <SearchBar
            searchQuery={searchKeyword}
            setSearchQuery={setSearchKeyword}
            onFocus={() => {
              if (searchKeyword.trim() !== "" && searchResults) {
                setShowResultsDropdown(true);
              }
            }}
          />
          {showResultsDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
              {isSearching &&
                (!searchResults ||
                  (searchResults.projects.length === 0 &&
                    searchResults.tasks.length === 0)) && (
                  <div className="p-3 text-sm text-center text-gray-500">
                    Searching...
                  </div>
                )}
              {!isSearching &&
                searchResults &&
                searchResults.projects.length === 0 &&
                searchResults.tasks.length === 0 && (
                  <div className="p-3 text-sm text-center text-gray-500">
                    No results found for "{searchKeyword}".
                  </div>
                )}

              {searchResults && searchResults.projects.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                    Projects
                  </h3>
                  <ul>
                    {searchResults.projects.map((project) => (
                      <li key={project.id}>
                        <Link
                          to={`/projects/${project.id}`}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleResultClick}
                        >
                          <div className="font-medium">
                            {project.name} ({project.key})
                          </div>
                          {project.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {project.description}
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {searchResults && searchResults.tasks.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-t border-b">
                    Tasks
                  </h3>
                  <ul>
                    {searchResults.tasks.map((task) => (
                      <li key={task.id}>
                        <Link
                          to={`/projects/${task.projectId}/tasks/${task.id}`}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleResultClick}
                        >
                          <div className="font-medium">
                            [{task.projectKey}-{task.taskNumber}] {task.title}
                          </div>
                          <p className="text-xs text-gray-500">
                            In: {task.projectName}
                          </p>
                          {task.assignedToName && (
                            <p className="text-xs text-gray-400">
                              Assigned to: {task.assignedToName}
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-1/5 h-full flex items-center justify-end gap-3 md:gap-4 pr-4">
        <Link
          to="/notifications"
          className="relative p-2 rounded hover:bg-gray-100"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute w-4 h-4 bg-red-500 text-white text-center leading-tight rounded-full text-[10px] -top-0.5 -right-0.5">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <Link to="/settings" className="p-2 rounded hover:bg-gray-100">
          <Settings size={20} />
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
