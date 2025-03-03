import SideNavItem from "../../atoms/SideNavItem";
import { FolderKanban, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const SideNav = () => {
  const sideNavVariants = {
    hidden: { x: -80, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "tween", duration: 0.3 } },
    exit: { x: -80, opacity: 0, transition: { type: "tween", duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={sideNavVariants}
      className="w-80 flex flex-col gap-1 p-2 bg-white shadow-lg border-r"
    >
      <SideNavItem
        title="Dashboard"
        icon={<LayoutDashboard size={16} />}
        to="/"
      />
      <SideNavItem
        title="Projects"
        icon={<FolderKanban size={16} />}
        to="/projects"
      />
    </motion.div>
  );
};

export default SideNav;
