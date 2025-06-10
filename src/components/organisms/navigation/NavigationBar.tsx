import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import Button from "../../atoms/Button";
import SearchBar from "../../atoms/SearchBar";
import { useNotifications } from "../../../hooks/useNotification";

interface NavigationBarProps {
  sideNavToggle: () => void;
  sideNavState: boolean;
}

const NavigationBar: FC<NavigationBarProps> = ({
  sideNavToggle,
  sideNavState,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { unreadCount } = useNotifications();
  const { showToast } = useToast();

  return (
    <div className="h-12 w-full flex items-center">
      <div className="w-1/5 h-full  flex items-center justify-start pl-4">
        <button onClick={sideNavToggle}>
          {sideNavState ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
        <Link to="/" className="ml-4">
          <img src="/logo.png" alt="" className="h-12" />
        </Link>
      </div>
      <div className="w-3/5 h-full  flex gap-4 items-center justify-center">
        <div className="w-2/3">
          <SearchBar
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            searchQuery={searchKeyword}
            setSearchQuery={setSearchKeyword}
          />
        </div>
        {/* <Button
          icon={<Plus size={20} />}
          text="Create"
          onClick={() =>
            showToast("Will be available soon", {
              type: "warning",
            })
          }
        /> */}
      </div>
      <div className="w-1/5 h-full flex items-center justify-end gap-4 pr-4">
        <Link to="notifications" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute w-4 h-4 bg-red-500 text-white rounded-full px-1 text-xs -top-2 -right-1">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link to="settings">
          <Settings size={20} />
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
