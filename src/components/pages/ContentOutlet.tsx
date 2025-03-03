import { Outlet } from "react-router-dom";
import NavigationBar from "../organisms/navigation/NavigationBar";
import SideNav from "../organisms/navigation/SideNav";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

const loader = async () => {
  return null;
};

const ContentOutlet = () => {
  const [isSideNavPanelOpen, setIsSideNavPanelOpen] = useState(false);

  const toggleSideNavPanel = () => {
    setIsSideNavPanelOpen((prev) => {
      localStorage.setItem("isSideNavPanelOpen", JSON.stringify(!prev));
      return !prev;
    });
  };

  useEffect(() => {
    const isSideNavPanelOpen = JSON.parse(
      localStorage.getItem("isSideNavPanelOpen") || "false"
    );
    setIsSideNavPanelOpen(isSideNavPanelOpen);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      <NavigationBar
        sideNavToggle={toggleSideNavPanel}
        sideNavState={isSideNavPanelOpen}
      />
      <div className="flex">
        <AnimatePresence>{isSideNavPanelOpen && <SideNav />}</AnimatePresence>
        <div
          className={`h-[calc(100svh-48px)] w-full p-2 border-t border-black ${
            isSideNavPanelOpen ? "border-l rounded-tl-lg" : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ContentOutlet;
export { loader };
