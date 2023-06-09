import React, { useState, useEffect } from 'react';
import { useFetch } from '@uidotdev/usehooks';
import './style.css';

const API_KEY = window.localStorage.getItem('airnow');

const getAirQualityData = (zip) =>
  fetch(
    `https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zip}&date=2023-06-09&distance=25&API_KEY=${API_KEY}`
  ).then((response) => response.json());

export default function App() {
  const [zipcode, setZipCode] = useState('10001');
  const [data, setData] = useState('');

  useEffect(() => {
    getAirQualityData(zipcode).then((response) => {
      setData(JSON.stringify(response));
      console.log(response);
    });

    return () => {};
  }, [zipcode]);

  return (
    <div>
      
      <pre>{data}</pre>
    </div>
  );
}
