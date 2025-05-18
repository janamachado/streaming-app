import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MusicItem from './components/MusicItem';
import PlaylistCard from './components/PlaylistCard';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch songs and playlists
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [songsRes, playlistsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/song`),
          axios.get(`${API_BASE_URL}/playlists`)
        ]);
        setSongs(songsRes.data);
        
        // Mapear as playlists para incluir as músicas diretamente
        const playlistsWithSongs = playlistsRes.data.map(playlist => ({
          ...playlist,
          songs: playlist.playlistSongs
            ? playlist.playlistSongs
                .sort((a, b) => a.order - b.order)
                .map(ps => ps.song)
            : []
        }));
        setPlaylists(playlistsWithSongs);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handlers for playlist operations
  const handleCreatePlaylist = async (name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/playlists`, { name });
      const newPlaylist = {
        ...response.data,
        songs: response.data.playlistSongs
          ? response.data.playlistSongs
              .sort((a, b) => a.order - b.order)
              .map(ps => ps.song)
          : []
      };
      setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
      setError("Não foi possível criar a playlist. Por favor, tente novamente.");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistId}`);
      setPlaylists(prevPlaylists => prevPlaylists.filter(playlist => playlist._id !== playlistId));
    } catch (error) {
      console.error("Erro ao deletar playlist:", error);
      setError("Não foi possível deletar a playlist. Por favor, tente novamente.");
    }
  };

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      await axios.post(`${API_BASE_URL}/playlists/${playlistId}/songs`, { songId });
      const response = await axios.get(`${API_BASE_URL}/playlists`);
      const updatedPlaylists = response.data.map(playlist => ({
        ...playlist,
        songs: playlist.playlistSongs
          ? playlist.playlistSongs
              .sort((a, b) => a.order - b.order)
              .map(ps => ps.song)
          : []
      }));
      setPlaylists(updatedPlaylists);
      setSelectedSong(null);
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
      setError("Não foi possível adicionar a música. Por favor, tente novamente.");
    }
  };

  const handleRemoveSong = async (playlistId, songId) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`);
      const response = await axios.get(`${API_BASE_URL}/playlists`);
      const updatedPlaylists = response.data.map(playlist => ({
        ...playlist,
        songs: playlist.playlistSongs
          ? playlist.playlistSongs
              .sort((a, b) => a.order - b.order)
              .map(ps => ps.song)
          : []
      }));
      setPlaylists(updatedPlaylists);
    } catch (error) {
      console.error("Erro ao remover música:", error);
      setError("Não foi possível remover a música. Por favor, tente novamente.");
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark border-bottom border-secondary px-4 py-3">
        <span className="navbar-brand mb-0 h1 fs-3">Gerenciador de Playlists</span>
      </nav>

      {/* Main Content */}
      <Container fluid className="h-100 py-4">
        <Row className="h-100 g-4">
          {/* Left Sidebar - Songs */}
          <Col md={4} lg={3} className="h-100">
            <div className="bg-dark-subtle p-3 rounded-3 shadow-sm h-100">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fs-4 fw-bold mb-0">Músicas Disponíveis</h2>
              </div>
              <div className="songs-container overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {loading ? (
                  <p className="text-center text-secondary">Carregando músicas...</p>
                ) : error ? (
                  <p className="text-center text-danger">{error}</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {songs.map((song) => (
                      <MusicItem
                        key={song._id}
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
            <div className="bg-dark-subtle p-4 rounded-3 shadow-sm h-100">
              <div className="d-flex align-items-center justify-content-between mb-4">
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
              
              <div className="playlists-container overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
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
                    playlists.map((playlist) => (
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
