import { Form } from 'react-bootstrap';
import SimpleSearchBar from './SimpleSearchBar';

function PlaylistSearch({ onSearch }) {
  const handleSearch = (query) => {
    onSearch({
      query,
      searchInSongs: document.getElementById('searchInSongs').checked
    });
  };

  return (
    <div>
      <SimpleSearchBar onSearch={handleSearch} placeholder="Buscar playlist" />
      <Form.Group className="mt-2 mb-0">
        <Form.Check
          type="checkbox"
          id="searchInSongs"
          label="Buscar por músicas na playlist"
          onChange={(e) => handleSearch(document.querySelector('input[type="search"]').value)}
          className="text-secondary"
        />
      </Form.Group>
    </div>
  );
}

export default PlaylistSearch;
