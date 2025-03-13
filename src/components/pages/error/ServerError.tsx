import axios from "axios";
import { useEffect } from "react";
import { baseUrl } from "../../../utils/utils";

const ServerError = () => {
  useEffect(() => {
    const ping = async () => {
      try {
        const res = await axios.post(`${baseUrl}/health`, {});
        console.log(res.data);
      } catch (error) {
        console.error("Server is down", error);
      }
    };

    ping();
  }, []);

  return <div>SERVER ERROR</div>;
};

export default ServerError;
