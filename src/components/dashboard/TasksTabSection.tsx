import { FC, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import TasksTab from "./TasksTab";
import TaskList from "./TaskList";
import { TaskResponseDTO } from "../../models/dtos/Task";
import { DashboardService } from "../../services/DashboardService";

interface Tab {
  id: string;
  label: string;
}

interface TasksTabSectionProps {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
}

const TasksTabSection: FC<TasksTabSectionProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const tabs: Tab[] = [
    { id: "assigned", label: "Recently Assigned" },
    { id: "progress", label: "In Progress" },
    { id: "deadline", label: "Approaching Deadline" },
  ];

  const [recentTasks, setRecentTasks] = useState<TaskResponseDTO[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<TaskResponseDTO[]>([]);
  const [deadlineTasks, setDeadlineTasks] = useState<TaskResponseDTO[]>([]);

  const fetchRecentTasks = async () => {
    try {
      const tasks = await DashboardService.getRecentlyAssignedTasks(3);
      setRecentTasks(Array.isArray(tasks) ? tasks : []);
    } catch (error) {
      console.error("Error fetching recently assigned tasks:", error);
      setRecentTasks([]);
    }
  };

  const fetchInProgressTasks = async () => {
    try {
      const tasks = await DashboardService.getInProgressTasks(3);
      setInProgressTasks(Array.isArray(tasks) ? tasks : []);
    } catch (error) {
      console.error("Error fetching in-progress tasks:", error);
      setInProgressTasks([]);
    }
  };

  const fetchDeadlineTasks = async () => {
    try {
      const tasks = await DashboardService.getApproachingDeadlineTasks(3);
      setDeadlineTasks(Array.isArray(tasks) ? tasks : []);
    } catch (error) {
      console.error("Error fetching approaching deadline tasks:", error);
      setDeadlineTasks([]);
    }
  };

  useEffect(() => {
    if (activeSection === "assigned" && recentTasks.length === 0) {
      fetchRecentTasks();
    } else if (activeSection === "progress" && inProgressTasks.length === 0) {
      fetchInProgressTasks();
    } else if (activeSection === "deadline" && deadlineTasks.length === 0) {
      fetchDeadlineTasks();
    }
  }, [activeSection]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <TasksTab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={activeSection === tab.id}
            onClick={() => setActiveSection(tab.id)}
          />
        ))}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-12 text-xs font-medium text-gray-500 pb-2 border-b mb-2">
          <div className="col-span-5">TASK</div>
          <div className="col-span-2">PROJECT</div>
          <div className="col-span-2">PRIORITY</div>
          <div className="col-span-2">DUE DATE</div>
          <div className="col-span-1">STATUS</div>
        </div>

        {activeSection === "assigned" && <TaskList tasks={recentTasks || []} />}
        {activeSection === "progress" && (
          <TaskList tasks={inProgressTasks || []} />
        )}
        {activeSection === "deadline" && (
          <TaskList tasks={deadlineTasks || []} />
        )}

        {/* <div className="mt-4 text-right">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 ml-auto">
            View all tasks
            <ArrowRight size={16} />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TasksTabSection;
