import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import PlaylistCard from './components/PlaylistCard';
import MusicItem from './components/MusicItem';

import SongSearch from './components/SongSearch';
import PlaylistSearch from './components/PlaylistSearch';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  // Constants
  const API_BASE_URL = 'http://localhost:3000/api';

  // Utility functions
  const formatPlaylistData = (playlist) => ({
    ...playlist,
    songs: playlist.playlistSongs
      ? playlist.playlistSongs
          .sort((a, b) => a.order - b.order)
          .map(ps => ps.song)
      : []
  });

  const handleApiError = (error, customMessage) => {
    console.error(customMessage, error);
    setError(customMessage);
  };

  // Data fetching
  const fetchSongs = async () => {
    const response = await axios.get(`${API_BASE_URL}/song`);
    const sortedSongs = response.data.sort((a, b) => sortSongs(a, b, 'title'));
    return sortedSongs;
  };

  const fetchPlaylists = async () => {
    const response = await axios.get(`${API_BASE_URL}/playlists`);
    return response.data.map(formatPlaylistData);
  };

  const handlePlaylistSearch = ({ query, searchInSongs }) => {
    if (!query.trim()) {
      setFilteredPlaylists(playlists);
      return;
    }

    const filtered = playlists.filter(playlist => {
      const nameMatch = playlist.name.toLowerCase().includes(query.toLowerCase());
      
      if (!searchInSongs) return nameMatch;
      
      // Se searchInSongs está ativo, procura também nas músicas da playlist
      const hasSongMatch = playlist.songs.some(song => 
        song.title.toLowerCase().includes(query.toLowerCase())
      );
      
      return nameMatch || hasSongMatch;
    });

    setFilteredPlaylists(filtered);
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [songsData, playlistsData] = await Promise.all([
          fetchSongs(),
          fetchPlaylists()
        ]);
        setSongs(songsData);
        setFilteredSongs(songsData);
        setPlaylists(playlistsData);
        setFilteredPlaylists(playlistsData);
      } catch (err) {
        handleApiError(err, 'Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handlers for playlist operations
  // Playlist operations
  const handleCreatePlaylist = async (name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/playlists`, { name });
      const newPlaylist = formatPlaylistData(response.data);
      setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
      setFilteredPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
      setIsModalOpen(false);
    } catch (error) {
      handleApiError(error, "Não foi possível criar a playlist. Por favor, tente novamente.");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistId}`);
      setPlaylists(prevPlaylists => 
        prevPlaylists.filter(playlist => playlist._id !== playlistId)
      );
      setFilteredPlaylists(prevPlaylists => 
        prevPlaylists.filter(playlist => playlist._id !== playlistId)
      );
    } catch (error) {
      handleApiError(error, "Não foi possível deletar a playlist. Por favor, tente novamente.");
    }
  };

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      await axios.post(`${API_BASE_URL}/playlists/${playlistId}/songs`, { songId });
      const updatedPlaylists = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setSelectedSong(null);
    } catch (error) {
      handleApiError(error, "Não foi possível adicionar a música. Por favor, tente novamente.");
    }
  };

  const handleRemoveSong = async (playlistId, songId) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`);
      const updatedPlaylists = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
    } catch (error) {
      handleApiError(error, "Não foi possível remover a música. Por favor, tente novamente.");
    }
  };

  const handleSongSearch = ({ query, type, sort }) => {
    try {
      const searchTerm = query.trim().toLowerCase();
      let filtered = [...songs];

      // Filtra as músicas se houver termo de busca
      if (searchTerm) {
        filtered = songs.filter(song => {
          if (type === 'all') {
            return song.title.toLowerCase().includes(searchTerm) ||
                   song.artist.toLowerCase().includes(searchTerm);
          } else if (type === 'title') {
            return song.title.toLowerCase().includes(searchTerm);
          } else if (type === 'artist') {
            return song.artist.toLowerCase().includes(searchTerm);
          }
          return true;
        });
      }

      // Ordena os resultados
      filtered.sort((a, b) => sortSongs(a, b, sort));
      setFilteredSongs(filtered);
    } catch (error) {
      console.error('Erro ao filtrar músicas:', error);
      setError('Erro ao filtrar músicas. Por favor, tente novamente.');
    }
  };

  const sortSongs = (a, b, sortBy) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'duration':
        return a.duration - b.duration;
      default:
        return 0;
    }
  };


  return (
    <div className="app-container">
      <Container fluid className="h-100">
        


        <Row className="h-100 g-4">
          {/* Left Sidebar - Songs */}
          <Col md={4} lg={3}>
            <div className="songs-section shadow-sm">
              <div className="songs-header">
                <h2 className="fs-4 fw-bold mb-3">Músicas Disponíveis</h2>
                <SongSearch onSearch={handleSongSearch} />
              </div>
              <div className="songs-list-container">
                {loading ? (
                  <p className="text-center text-secondary">Carregando músicas...</p>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : (
                  <div className="songs-list">
                    {(filteredSongs || songs).map((song) => (
                      <MusicItem
                        key={song.id}
                        song={song}
                        onAddToPlaylist={(song) => setSelectedSong(song)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Main Content - Playlists */}
          <Col md={8} lg={9}>
            <div className="playlists-section shadow-sm">
              <div className="playlists-header">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="fs-4 fw-bold mb-0">Minhas Playlists</h2>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-pill px-3"
                  >
                    <span className="me-2">Nova Playlist</span>
                    <i className="bi bi-plus-circle"></i>
                  </Button>
                </div>
                <PlaylistSearch onSearch={handlePlaylistSearch} />
              </div>
              
              <div className="playlists-grid">
                <Row className="g-4">
                  {loading ? (
                    <Col xs={12}>
                      <p className="text-center text-secondary">Carregando playlists...</p>
                    </Col>
                  ) : error ? (
                    <Col xs={12}>
                      <p className="text-center text-danger">{error}</p>
                    </Col>
                  ) : playlists.length === 0 ? (
                    <Col xs={12}>
                      <div className="text-center py-5">
                        <p className="text-secondary mb-3">Nenhuma playlist criada</p>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setIsModalOpen(true)}
                          className="rounded-pill px-3"
                        >
                          Criar Primeira Playlist
                        </Button>
                      </div>
                    </Col>
                  ) : (
                    (filteredPlaylists).map((playlist) => (
                      <Col key={playlist._id} xs={12} md={6} xl={4}>
                        <PlaylistCard
                          playlist={playlist}
                          onRemoveSong={handleRemoveSong}
                          onDeletePlaylist={handleDeletePlaylist}
                        />
                      </Col>
                    ))
                  )}
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      {/* Song selection modal */}
      {selectedSong && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-white mb-4">
              Adicionar "{selectedSong.title}" à playlist:
            </h3>
            <div className="space-y-2">
              {playlists.map(playlist => (
                <button
                  key={playlist._id}
                  onClick={() => {
                    handleAddToPlaylist(playlist._id, selectedSong._id);
                    setSelectedSong(null);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  {playlist.name}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedSong(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
