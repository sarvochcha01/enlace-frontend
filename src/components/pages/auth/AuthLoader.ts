import { redirect } from "react-router-dom";
import { checkIfLoggedIn } from "../../../utils/utils";

const AuthLoader = async () => {
  const isUserLoggedIn = await checkIfLoggedIn();

  if (isUserLoggedIn) {
    return redirect("/");
  }
};

export default AuthLoader;
