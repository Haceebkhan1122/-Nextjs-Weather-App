import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styles from './searchCities.module.scss';

const SearchCities = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault(); // Prevent default form submission
        onSearch(query); // Call the onSearch function passed from the parent
    };

    return (
        <div className={styles.searchContainer}>
            <form onSubmit={handleSearch}> {/* Add a form element */}
                <InputGroup className={styles.inputGroup}>
                    <Form.Control
                        type="text"
                        placeholder="Search cities..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <Button type="submit" className={styles.searchButton}>
                        Search
                    </Button>
                </InputGroup>
            </form>
        </div>
    );
};

export default SearchCities;
