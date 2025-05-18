import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const SimpleSearchBar = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <Form>
      <InputGroup>
        <Form.Control
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
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

export default SimpleSearchBar;
