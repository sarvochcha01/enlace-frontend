import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useUser } from "../../../hooks/useUser";

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
    <div className="flex flex-col">
      {user && (
        <div>
          {dbUser?.name} : {user.email}
        </div>
      )}
      <button onClick={handleLogout}>Signout</button>
    </div>
  );
};

export default Settings;
