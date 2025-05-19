import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const SongSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleClear = () => {
    setQuery('');
    onSearch({ query: '' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query, type: searchType });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch({ query });
    }
  };

  return (
    <Form className="mb-3" onSubmit={handleSearch}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Buscar por título ou artista..."
          value={query}
          onChange={handleQueryChange}
          onKeyPress={handleKeyPress}
          className="bg-dark text-light border-secondary"
        />
        {query && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            type="button"
            className="d-flex align-items-center"
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        )}
        <Button type="submit" variant="primary">
          <i className="bi bi-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SongSearch;
