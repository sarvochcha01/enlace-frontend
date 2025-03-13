import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../organisms/navigation/NavigationBar";
import SideNav from "../organisms/navigation/SideNav";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { UserService } from "../../services/UserService";
import { useUser } from "../../hooks/useUser";

const loader = async () => {
  return null;
};

const ContentOutlet = () => {
  const [isSideNavPanelOpen, setIsSideNavPanelOpen] = useState(false);
  const [isDBUserLoading, setIsDBUserLoading] = useState(true);

  const navigate = useNavigate();

  const { setDBUser } = useUser();

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

  const fetchDBUser = async () => {
    try {
      const userData = await UserService.GetUser();
      console.log(userData);
      setDBUser(userData);
      setIsDBUserLoading(false);
      return userData;
    } catch (error) {
      console.error("Error fetching user data", error);
      navigate("/down");
    }
  };

  useEffect(() => {
    fetchDBUser();
  }, []);

  if (isDBUserLoading) {
    return <div>Loading DB User...</div>;
  }

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
