import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Dropdown, ButtonGroup } from 'react-bootstrap';

const SongSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  const searchTypes = {
    all: 'Todos',
    title: 'Título',
    artist: 'Artista'
  };

  const sortOptions = {
    title: 'Título',
    artist: 'Artista',
    duration: 'Duração'
  };

  useEffect(() => {
    onSearch({
      query,
      type: searchType,
      sort: sortBy
    });
  }, [query, searchType, sortBy, onSearch]);

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  return (
    <Form className="mb-3">
      <div className="d-flex gap-2 mb-2">
        <ButtonGroup>
          {Object.entries(searchTypes).map(([type, label]) => (
            <Button
              key={type}
              variant={searchType === type ? 'secondary' : 'outline-secondary'}
              onClick={() => setSearchType(type)}
              size="sm"
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>

        <Dropdown align="end">
          <Dropdown.Toggle variant="outline-secondary" size="sm">
            Ordenar por: {sortOptions[sortBy]}
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            {Object.entries(sortOptions).map(([value, label]) => (
              <Dropdown.Item
                key={value}
                active={sortBy === value}
                onClick={() => handleSortChange(value)}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Buscar por título ou artista..."
          value={query}
          onChange={handleQueryChange}
          className="bg-dark text-light border-secondary"
        />
        {query && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            className="d-flex align-items-center"
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        )}
      </InputGroup>
    </Form>
  );
};

export default SongSearch;
