import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../utils/utils";
import { Link } from "react-router-dom";

const Health = () => {
  const [isServerUp, setIsServerUp] = useState(false);

  useEffect(() => {
    const ping = async () => {
      try {
        const res = await axios.post(`${baseUrl}/health`);
        setIsServerUp(true);
        console.log(res.data);
      } catch (error) {
        console.error("Server is down", error);
      }
    };

    ping();
  }, []);

  return (
    <div>
      <h1>Health</h1>
      <p>{isServerUp ? "Server is up" : "Server is down"}</p>
    </div>
  );
};

export default Health;
