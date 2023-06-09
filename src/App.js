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
  const [location, setLocation] = useState('');
  const [data, setData] = useState([]);

  const updateZip = (event) => {
    setZipCode(event.target.value);
  };

  useEffect(() => {
    getAirQualityData(zipcode)
      .then((response) => {
        setData(response);
        setLocation(response[0].ReportingArea);
        console.log(response);
      })
      .catch((error) => {
        setData([]);
        setLocation('');
      });

    return () => {};
  }, [zipcode]);

  return (
    <div>
      <input type="text" value={zipcode} onChange={updateZip} />
      <h2>Air quality for: {location}</h2>
      {data.map((forecast) => {
        return <Forecast data={forecast} />;
      })}
    </div>
  );
}

const Forecast = ({ data }) => {
  return (
    <div className={"forecast " + data.Category.Name.toLowerCase()}>
      <div>Date: {data.DateForecast}</div>
      <div>
        {data.ParameterName} | AQI: {data.AQI} ({data.Category.Name})
      </div>
    </div>
  );
};

// {"DateIssue":"2023-06-09 ","DateForecast":"2023-06-09 ","ReportingArea":"New York City Region","StateCode":"NY","Latitude":40.8419,"Longitude":-73.8359,"ParameterName":"O3","AQI":42,"Category":{"Number":1,"Name":"Good"},"ActionDay":false,"Discussion":""}
