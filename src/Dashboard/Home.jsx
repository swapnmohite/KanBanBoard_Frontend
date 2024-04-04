import React, { useEffect, useState } from "react";
// import axios from "axios";
import KanbanBoard from "../components/KanbanBoard";

const Home = () => {
  // const [userdata, setUserdata] = useState(null);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8080/hello")
  //     .then((response) => {
  //       console.log(response.data);
  //       setUserdata(response.data); // Save the data in the state
  //     })
  //     .catch((error) => console.error("Error:", error));
  // }, []);

  return (
    <div>
      <KanbanBoard />
    </div>
  );
};

export default Home;
