import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Alert, Modal } from 'react-bootstrap';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import EditPlaylistModal from './components/EditPlaylistModal';
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
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
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

  const handleEditPlaylist = async (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      setSelectedPlaylist(playlist);
      setShowEditPlaylistModal(true);
    }
  };

  const handleSavePlaylist = async (formData) => {
    try {
      await axios.put(`${API_BASE_URL}/playlists/${selectedPlaylist.id}`, formData);
      const updatedPlaylists = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setShowEditPlaylistModal(false);
      setSelectedPlaylist(null);
    } catch (error) {
      handleApiError(error, "Não foi possível atualizar a playlist. Por favor, tente novamente.");
    }
  };

  const confirmDeletePlaylist = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      setPlaylistToDelete(playlist);
      setShowDeleteModal(true);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlistToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistToDelete.id}`);
      const updatedPlaylists = playlists.filter(p => p.id !== playlistToDelete.id);
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setShowDeleteModal(false);
      setPlaylistToDelete(null);
    } catch (error) {
      handleApiError(error, "Não foi possível excluir a playlist. Por favor, tente novamente.");
    }
  };

  const handleAddToPlaylist = async (playlistIds) => {
    if (!selectedSong || !playlistIds?.length) return;
    
    try {
      // Adiciona a música a cada playlist sequencialmente
      for (const playlistId of playlistIds) {
        const numericPlaylistId = parseInt(playlistId);
        if (isNaN(numericPlaylistId)) continue; // Pula se não for um número válido

        await axios.post(`${API_BASE_URL}/playlists/${numericPlaylistId}/songs`, { 
          songIds: [parseInt(selectedSong.id)] // Convertendo para número
        });
      }
      
      setShowAddToPlaylistModal(false);
      const updatedPlaylists = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setSelectedSong(null);
    } catch (error) {
      handleApiError(error, "Não foi possível adicionar a música a todas as playlists. Por favor, tente novamente.");
    }
  };

  const handleRemoveSong = async (playlistId, songId) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
        data: { songIds: [parseInt(songId)] }
      });
      const updatedPlaylists = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
    } catch (error) {
      handleApiError(error, "Não foi possível remover a música da playlist. Por favor, tente novamente.");
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
                        key={song._id}
                        song={song}
                        onAddToPlaylist={() => {
                          setSelectedSong(song);
                          setShowAddToPlaylistModal(true);
                        }}
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
              <div className="playlists-container">
                <div className="playlists-header">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h4 mb-0">Minhas Playlists</h2>
                    <Button
                      variant="primary"
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
                  <Row className="g-2">
                    {loading ? (
                      <Col xs={12}>
                        <p className="text-center text-secondary">Carregando playlists...</p>
                      </Col>
                    ) : error ? (
                      <Col xs={12}>
                        <p className="text-center text-danger">{error}</p>
                      </Col>
                    ) : filteredPlaylists.length === 0 ? (
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
                      filteredPlaylists.map((playlist) => (
                        <Col key={playlist.id} xs={12} md={6} xl={4}>
                          <PlaylistCard
                            playlist={playlist}
                            onDeletePlaylist={confirmDeletePlaylist}
                            onRemoveSong={handleRemoveSong}
                            onEditPlaylist={handleEditPlaylist}
                          />
                        </Col>
                      ))
                    )}
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <CreatePlaylistModal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        onCreatePlaylist={handleCreatePlaylist}
      />

      <AddToPlaylistModal
        show={showAddToPlaylistModal}
        onHide={() => setShowAddToPlaylistModal(false)}
        playlists={playlists}
        onSelectPlaylist={handleAddToPlaylist}
        selectedSong={selectedSong}
      />

      <EditPlaylistModal
        show={showEditPlaylistModal}
        onHide={() => {
          setShowEditPlaylistModal(false);
          setSelectedPlaylist(null);
        }}
        onSave={handleSavePlaylist}
        playlist={selectedPlaylist}
      />

      {/* Delete Playlist Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setPlaylistToDelete(null);
        }}
        centered
        className="dark-modal"
      >
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Excluir Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>Tem certeza que deseja excluir a playlist "{playlistToDelete?.name}"?</p>
          <p className="text-secondary mb-0">
            Esta ação não pode ser desfeita e todas as músicas serão removidas da playlist.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setPlaylistToDelete(null);
            }}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeletePlaylist}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

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
