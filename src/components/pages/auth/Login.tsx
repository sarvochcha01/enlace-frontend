import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import { getAdditionalUserInfo } from "firebase/auth";
import { UserService } from "../../../services/UserService";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const navigate = useNavigate();

  // const { handleEmailLogin } = useEmailLogin(email, password, setIsLoggingIn);
  // const { handleGoogleLogin } = useGoogleLogin(setIsLoggingIn);

  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);

      const result = await loginWithGoogle();

      const additionalUserInfo = getAdditionalUserInfo(result);
      console.log(additionalUserInfo);

      if (additionalUserInfo?.isNewUser) {
        try {
          await UserService.CreateUser(result.user);
          navigate("/");
        } catch (error) {
          console.error("Error creating user:", error);
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className=" w-96 flex flex-col items-center">
        <div className="text-center text-5xl font-bold">Enlace</div>
        <div className="flex flex-col gap-2 mt-6">
          <input
            type="text"
            name=""
            id=""
            className="border border-black w-64 h-8 px-2"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            name=""
            id=""
            className="border border-black w-64 h-8 px-2"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-[#0055cc] hover:bg-[#2b5da2] w-64 h-8 mt-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoggingIn}
            // onClick={handleEmailLogin}
          >
            Login
          </button>
        </div>
        <div className="mt-6">Or continue with</div>
        <div className="flex">
          <button
            className="border border-black w-64 h-8 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoggingIn}
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={30} />
            <span className="">Google</span>
          </button>
        </div>

        <Link to="/signup" className="mt-4">
          Sign Up?
        </Link>
      </div>
    </div>
  );
};

export default Login;
