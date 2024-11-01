import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import SearchCities from '@/components/searchCities/searchCities';
import CityList from '@/components/cityList/cityList';
import CityDetails from '@/components/cityDetails/cityDetails';
import FavouriteCities from '@/components/favouriteCities/favouriteCities';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy, WiWindy } from 'react-icons/wi';

const API_KEY = 'db8e720984054d58baf112636243110';

const getWeatherIcon = (condition) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <WiDaySunny />;
    case 'cloudy':
      return <WiCloud />;
    case 'partly cloudy':
      return <WiDayCloudy />;
    case 'rain':
    case 'light rain':
      return <WiRain />;
    case 'snow':
    case 'light snow':
      return <WiSnow />;
    case 'thunderstorm':
      return <WiThunderstorm />;
    case 'fog':
    case 'mist':
      return <WiFog />;
    case 'windy':
      return <WiWindy />;
    default:
      return <WiDaySunny />; // Default icon for unknown conditions
  }
};

export default function Home() {
  const [citiesData, setCitiesData] = useState([]);
  const [searchCitiesData, setSearchCitiesData] = useState({});
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favoriteCities');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, []);

  const getListingCities = async () => {
    const cityNames = ['Karachi', 'Mumbai', 'Lahore', 'Abu Dhabi', 'Tokyo'];
    setError('');

    try {
      const cityRequests = cityNames.map(city =>
        axios.get(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${city}`)
      );
      const cityResponses = await Promise.allSettled(cityRequests);

      const cities = cityResponses
        .filter(response => response.status === 'fulfilled' && response.value.data.length > 0)
        .flatMap(response => response.value.data);

      if (cities.length === 0) {
        setError('No cities found for the given query.');
        return;
      }

      const weatherRequests = cities.map(city =>
        axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city.name}`)
      );
      const weatherResponses = await Promise.allSettled(weatherRequests);

      const citiesWithWeatherData = cities.map((city, index) => {
        const weatherData = weatherResponses[index];
        if (weatherData.status === 'fulfilled') {
          const current = weatherData.value.data.current;
          return {
            ...city,
            temperature: current.temp_c,
            condition: current.condition.text,
            windSpeed: current.wind_kph,
            humidity: current.humidity,
          };
        } else {
          return {
            ...city,
            temperature: 'N/A',
            condition: 'Data Unavailable',
            windSpeed: 'N/A',
            humidity: 'N/A',
          };
        }
      });

      setCitiesData(citiesWithWeatherData);
    } catch (err) {
      console.error('Error fetching city data:', err);
      setError('Failed to fetch city data');
    } finally {
      console.warn('weather')
    }
  };

  useEffect(() => {
    getListingCities();
  }, []);

  const getSearchCityData = async (cityName) => {
    setError('');
    try {
      const searchResponse = await axios.get(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${cityName}`);

      if (searchResponse.status === 200 && searchResponse.data.length > 0) {
        const cities = searchResponse.data;

        const weatherRequests = cities.map(city =>
          axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city.name}`)
        );

        const weatherResponses = await Promise.all(weatherRequests);
        const citiesWithWeather = cities.map((city, index) => {
          const current = weatherResponses[index]?.data?.current;
          return current ? {
            ...city,
            temperature: current.temp_c,
            condition: current.condition.text,
            windSpeed: current.wind_kph,
            humidity: current.humidity,
            icon: getWeatherIcon(current.condition.text)
          } : {
            ...city,
            temperature: 'N/A',
            condition: 'Data Unavailable',
            windSpeed: 'N/A',
            humidity: 'N/A',
            icon: getWeatherIcon('sunny')
          };
        });

        setSearchCitiesData(citiesWithWeather);
      } else {
        setError('No cities found for the given query.');
      }
    } catch (err) {
      console.error('Error fetching city data:', err);
      setError('Failed to fetch city data');
    } finally {
      console.warn('weather')
    }
  };

  const onAddToFavorites = (city) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(favCity => favCity.name === city.name);
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...prevFavorites, city];

        if (typeof window !== 'undefined') {
          localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
        }

        return updatedFavorites;
      }
      return prevFavorites;
    });
  };

  return (
    <>
      <Head>
        <title>Next Weather App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`mainWrapper`}>
        <Container fluid>
          <Row className="mb-4">
            <Col xs={12}>
              <SearchCities onSearch={getSearchCityData} />
            </Col>
          </Row>
          <Row>
            <Col md={6} lg={4} className="mb-4">
              <CityList citiesData={citiesData} getSearchCityData={getSearchCityData} />
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <CityDetails searchCitiesData={searchCitiesData} onAddToFavorites={onAddToFavorites} />
            </Col>
            <Col md={12} lg={4} className="mb-4">
              <FavouriteCities favorites={favorites} getSearchCityData={getSearchCityData} />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}
