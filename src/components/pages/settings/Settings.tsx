import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";

const Settings = () => {
  const { user, logout } = useAuth();
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
    <div className="flex flex-col">
      {user && (
        <div>
          {user.displayName} {user.email}
        </div>
      )}
      <button onClick={handleLogout}>Signout</button>
    </div>
  );
};

export default Settings;
