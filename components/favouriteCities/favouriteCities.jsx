import React from 'react';
import styles from './favouriteCities.module.scss';
import { FaTimes } from 'react-icons/fa'; // Importing a cross icon from react-icons

const FavouriteCities = ({ favorites, getSearchCityData }) => {

    return (
        <div className={styles.favouriteCitiesContainer}>
            <h2 className={styles.title}>{favorites?.length > 0 ? 'Favourite Cities' : 'No Favourite Cities'} </h2>
            <div className={styles.citiesList}>
                {favorites?.map((city, index) => (
                    <div key={index} className={styles.cityTag} onClick={() => getSearchCityData(city?.name)}>
                        {city?.name}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavouriteCities;
