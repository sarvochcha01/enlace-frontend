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
import ButtonWithIcon from "../../atoms/ButtonWithIcon";
import SearchBar from "../../atoms/SearchBar";

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
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
        </div>
        <ButtonWithIcon
          icon={<Plus size={20} />}
          text="Create"
          onClick={() =>
            showToast("Will be available soon", {
              type: "warning",
            })
          }
        />
      </div>
      <div className="w-1/5 h-full flex items-center justify-end gap-4 pr-4">
        <button>
          <Bell size={20} />
        </button>
        <Link to="settings">
          <Settings size={20} />
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
