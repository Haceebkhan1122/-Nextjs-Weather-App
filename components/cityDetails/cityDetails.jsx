import React from 'react';
import styles from './cityDetails.module.scss';

const CityDetails = ({ searchCitiesData, onAddToFavorites }) => {
    const city = searchCitiesData?.[0];

    const handleAddToFavorites = () => {
        if (city) {
            onAddToFavorites(city); 
        }
    };

    return (
        <div className={styles.cityDetailsContainer}>
            {city ? (
                <>
                    <h2 className={styles.cityName}>{city.name}</h2>
                    <div className={styles.weatherInfo}>
                        <div className={styles.weatherIcon}>
                            <span>{city.icon}</span> {/* Display the weather icon */}
                        </div>
                        <div className={styles.weatherDetails}>
                            <p className={styles.temperature}>{city.temperature}°C</p>
                            <p className={styles.condition}>{city.condition}</p>
                            <p className={styles.windSpeed}>Wind Speed: {city.windSpeed} km/h</p>
                            <p className={styles.humidity}>Humidity: {city.humidity}%</p>
                        </div>
                    </div>
                    <button onClick={handleAddToFavorites} className={styles.favoriteButton}>
                        Add to Favorites
                    </button>
                </>
            ) : (
                <h2 className={styles.cityName}>No cities found</h2>
            )}
        </div>
    );
};

export default CityDetails;
