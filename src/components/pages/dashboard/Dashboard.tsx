import { useState } from "react";
import { useUser } from "../../../hooks/useUser";
import TasksTabSection from "../../dashboard/TasksTabSection";

const Dashboard = () => {
  const { dbUser } = useUser();
  const [activeSection, setActiveSection] = useState("assigned");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col overflow-y-auto h-full w-full p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {getGreeting()}, {dbUser?.name} 👋
          </h1>
          <p className="text-gray-500">
            Here's what's happening with your tasks today
          </p>
        </div>
      </div>

      <TasksTabSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
};

export default Dashboard;
