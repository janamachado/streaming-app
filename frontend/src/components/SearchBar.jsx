import React, { useState } from 'react';
import { Form, InputGroup, Button, Dropdown } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('playlist');
  const [query, setQuery] = useState('');

  const searchTypes = {
    playlist: 'Nome da Playlist',
    description: 'Descrição da Playlist',
    song: 'Música'
  };

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.trim()) {
      onSearch(searchType, newQuery.trim());
    } else {
      onSearch(null, ''); // Limpa a busca quando o campo está vazio
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch(null, ''); // Limpa a busca
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o reload da página
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <InputGroup>
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="search-type-dropdown">
            {searchTypes[searchType]}
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            {Object.entries(searchTypes).map(([type, label]) => (
              <Dropdown.Item 
                key={type}
                active={searchType === type}
                onClick={() => setSearchType(type)}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Form.Control
          type="text"
          placeholder="Digite para buscar..."
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

export default SearchBar;
