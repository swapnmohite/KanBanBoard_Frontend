import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/hello')
      .then(response => {
        console.log(response.data);
        setUserdata(response.data); // Save the data in the state
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>{userdata ? userdata : 'Loading...'}</h1>
    </div>
  );
}

export default Home;