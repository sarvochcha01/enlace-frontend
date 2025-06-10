import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useUser } from "../../../hooks/useUser";
import { ChevronRight, LogOut } from "lucide-react";

const Settings = () => {
  const { user, logout } = useAuth();
  const { dbUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Profile Section */}
      <div className=" border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>
        {user && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {dbUser?.name
                  ? dbUser.name.charAt(0).toUpperCase()
                  : user.email!.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {dbUser?.name || "User"}
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Account Actions
        </h2>

        {/* Settings Options */}
        <div className="space-y-3 mb-6">
          <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-600">
                Update your personal information
              </p>
            </div>
            <ChevronRight />
          </button>

          <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Privacy Settings</h3>
              <p className="text-sm text-gray-600">
                Manage your privacy preferences
              </p>
            </div>
            <ChevronRight />
          </button>

          <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">
                Configure notification preferences
              </p>
            </div>
            <ChevronRight />
          </button>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-32 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
