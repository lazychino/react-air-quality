import React, { useState, useEffect } from 'react';
import { useFetch } from '@uidotdev/usehooks';
import './style.css';

const API_KEY = window.localStorage.getItem('airnow');

const formatDate = (date) => new Intl.DateTimeFormat('en-US').format(date);

const getAirQualityData = async (zip) => {
  const url = `https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zip}&date=2023-06-09&distance=25&API_KEY=${API_KEY}`;
  const cacheKey = `airnow-forecast-${zip}`;

  let cacheResponse = JSON.parse(window.localStorage.getItem(cacheKey));

  if (!cacheResponse || cacheResponse.DateIssue !== formatDate(Date.now())) {
    const response = await fetch(url);
    const data = await response.json();

    console.log('request', data);
    const forecastData = data.reduce((list, forecast, index) => {
      if (
        list.length > 0 &&
        list[list.length - 1].date === forecast.DateForecast
      ) {
        list[list.length - 1].params.push(forecast);
      } else {
        const forecastDate = {
          date: forecast.DateForecast,
          dateIssue: formatDate(Date.parse(forecast.DateIssue)),
        };
        forecastDate.params = [forecast];
        list.push(forecastDate);
      }
      return list;
    }, []);

    window.localStorage.setItem(cacheKey, JSON.stringify(forecastData));
    return forecastData;
  }

  return cacheResponse;
};

export default function App() {
  const [zipcode, setZipCode] = useState('07306');
  const [location, setLocation] = useState('');
  const [data, setData] = useState([]);

  const updateZip = (event) => {
    setZipCode(event.target.value);
  };

  useEffect(() => {
    if (zipcode.length !== 5) return;

    getAirQualityData(zipcode)
      .then((response) => {
        console.log(response);
        setData(response);
        setLocation(response?.[0].params?.[0].ReportingArea);
      })
      .catch((error) => {
        console.error(error);
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
        return <Forecast forecast={forecast} />;
      })}
    </div>
  );
}

const Forecast = ({ forecast }) => {
  return (
    <div className="forecast">
      <div>Date: {forecast.date}</div>
      {forecast.params.map((data) => (
        <div className={'parameter category-' + data.Category.Number}>
          {data.ParameterName} | AQI: {data.AQI} ({data.Category.Name})
        </div>
      ))}
    </div>
  );
};

// sample = {
//   DateIssue: '2023-06-09 ',
//   DateForecast: '2023-06-09 ',
//   ReportingArea: 'New York City Region',
//   StateCode: 'NY',
//   Latitude: 40.8419,
//   Longitude: -73.8359,
//   ParameterName: 'O3',
//   AQI: 42,
//   Category: { Number: 1, Name: 'Good' },
//   ActionDay: false,
//   Discussion: '',
// };
