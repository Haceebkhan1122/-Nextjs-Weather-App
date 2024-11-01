import React from 'react';
import styles from './cityList.module.scss';
import { WiCelsius } from 'react-icons/wi';

const CityList = ({ citiesData, getSearchCityData }) => {

    return (
        <div className={styles.cityListContainer}>
            <h2 className={styles.title}>City List</h2>
            <ul className={styles.cityList}>
                {citiesData?.map((city, index) => (
                    <li key={index} className={styles.cityItem} onClick={() => getSearchCityData(city?.name)}>
                        <span className={styles.cityName}>{city.name}</span>
                        <span className={styles.cityPopulation}>{city.temperature}<WiCelsius /></span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CityList;
