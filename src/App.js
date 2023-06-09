import React from "react";
import { useFetch } from "@uidotdev/usehooks";
import "./style.css";

const API_KEY = window.localStorage.getItem('airnow');

export default function App() {
  
  
  const { error, data } = useFetch(
    `https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=07306&date=2023-06-09&distance=25&API_KEY=${API_KEY}`
  );

  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
}
