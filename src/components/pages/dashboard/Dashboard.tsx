import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { DashboardService } from "../../../services/DashboardService";
import { TaskResponseDTO } from "../../../models/dtos/Task";
import TaskList from "../../dashboard/TaskList";

const Dashboard = () => {
  const { dbUser } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const [recentTasks, setRecentTasks] = useState<TaskResponseDTO[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<TaskResponseDTO[]>([]);
  const [deadlineTasks, setDeadlineTasks] = useState<TaskResponseDTO[]>([]);

  const fetchRecentTasks = async () => {
    try {
      const tasks = await DashboardService.getRecentlyAssignedTasks(5);
      setRecentTasks(Array.isArray(tasks) ? tasks : []);
    } catch (error) {
      console.error("Error fetching recently assigned tasks:", error);
      setRecentTasks([]);
    }
  };

  const fetchInProgressTasks = async () => {
    try {
      const tasks = await DashboardService.getInProgressTasks(5);
      setInProgressTasks(Array.isArray(tasks) ? tasks : []);
    } catch (error) {
      console.error("Error fetching in-progress tasks:", error);
      setInProgressTasks([]);
    }
  };

  const fetchDeadlineTasks = async () => {
    try {
      const tasks = await DashboardService.getApproachingDeadlineTasks(5);
      setDeadlineTasks(Array.isArray(tasks) ? tasks : []);
    } catch (error) {
      console.error("Error fetching approaching deadline tasks:", error);
      setDeadlineTasks([]);
    }
  };

  useEffect(() => {
    fetchRecentTasks();
    fetchInProgressTasks();
    fetchDeadlineTasks();
  }, []);

  return (
    <div className="flex flex-col overflow-y-auto h-full w-full bg-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {getGreeting()}, {dbUser?.name}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your tasks today
          </p>
        </div>

        {/* Task Sections */}
        <div className="space-y-8">
          <TaskList
            tasks={deadlineTasks || []}
            heading="Approaching Deadlines"
          />
          <TaskList tasks={inProgressTasks || []} heading="Tasks in Progress" />
          <TaskList
            tasks={recentTasks || []}
            heading="Recently Assigned Tasks"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
