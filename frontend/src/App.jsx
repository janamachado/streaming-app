import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import EditPlaylistModal from './components/EditPlaylistModal';
import DeletePlaylistModal from './components/DeletePlaylistModal';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'danger' });
  const [loading, setLoading] = useState(true);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  // Constants
  const API_BASE_URL = 'http://localhost:3000/api';



  const handleApiError = (error, defaultMessage) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    setToast({ show: true, message: errorMessage, variant: 'danger' });
  };

  // Data fetching
  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/song`);
      setSongs(response.data);
      setFilteredSongs(response.data);
    } catch (error) {
      handleApiError(error, "Não foi possível carregar as músicas. Por favor, tente novamente.");
      // Mantém os dados anteriores em caso de erro
      if (!songs.length) {
        setSongs([]);
        setFilteredSongs([]);
      }
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/playlists`);
      // Formata as playlists antes de retornar
      return response.data.map(playlist => ({
        ...playlist,
        songs: playlist.playlistSongs
          ? playlist.playlistSongs
              .sort((a, b) => a.order - b.order)
              .map(ps => ps.song)
          : []
      }));
    } catch (error) {
      handleApiError(error, "Não foi possível carregar as playlists. Por favor, tente novamente.");
      // Em caso de erro, retorna as playlists atuais para manter o estado
      return playlists;
    }
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
  const handleCreatePlaylist = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/playlists`, data);
      // Formata a nova playlist antes de adicionar ao estado
      const newPlaylist = {
        ...response.data,
        songs: []
      };
      const updatedPlaylists = [...playlists, newPlaylist];
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
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
      const response = await axios.put(`${API_BASE_URL}/playlists/${selectedPlaylist.id}`, formData);
      // Mantém as músicas da playlist ao atualizar
      const currentPlaylist = playlists.find(p => p.id === selectedPlaylist.id);
      const updatedPlaylist = {
        ...response.data,
        songs: currentPlaylist ? currentPlaylist.songs : []
      };
      const updatedPlaylists = playlists.map(p => 
        p.id === selectedPlaylist.id ? updatedPlaylist : p
      );
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setShowEditPlaylistModal(false);
      setSelectedPlaylist(null);
    } catch (error) {
      handleApiError(error, "Não foi possível editar a playlist. Por favor, tente novamente.");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistId}`);
      const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setShowDeleteModal(false);
      setSelectedPlaylist(null);
    } catch (error) {
      handleApiError(error, "Não foi possível excluir a playlist. Por favor, tente novamente.");
    }
  };

  const confirmDeletePlaylist = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      setSelectedPlaylist(playlist);
      setShowDeleteModal(true);
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

  const handleRemoveSong = async (playlistId, songIds) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
        data: { songIds: songIds.map(id => parseInt(id)) }
      });
      // Atualiza localmente a playlist
      const updatedPlaylists = playlists.map(p => {
        if (p.id === playlistId) {
          return {
            ...p,
            songs: p.songs.filter(s => !songIds.includes(s.id))
          };
        }
        return p;
      });
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
    } catch (error) {
      const message = songIds.length > 1
        ? "Não foi possível remover as músicas da playlist. Por favor, tente novamente."
        : "Não foi possível remover a música da playlist. Por favor, tente novamente.";
      handleApiError(error, message);
    }
  };

  const handleSongSearch = ({ query, type, sort }) => {
    try {
      const searchTerm = query.trim().toLowerCase();
      let filtered = [...songs];

      if (query) {
        filtered = filtered.filter(song => {
          const searchQuery = query.toLowerCase();
          const matchTitle = song.title.toLowerCase().includes(searchQuery);
          const matchArtist = song.artist.toLowerCase().includes(searchQuery);
          return type === 'artist' ? matchArtist : type === 'title' ? matchTitle : (matchTitle || matchArtist);
        });
      }

      if (sort) {
        filtered.sort((a, b) => sortSongs(a, b, sort));
      }

      setFilteredSongs(filtered);
    } catch (err) {
      handleApiError(err, 'Erro ao filtrar músicas');
      // Mantém o estado anterior em caso de erro
      setFilteredSongs(songs);
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
      <Container fluid className="py-4 bg-dark min-vh-100">
      <ToastContainer 
        className="p-3" 
        position="top-end"
        style={{ zIndex: 1000 }}
      >
        <Toast 
          show={toast.show} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
          delay={5000} 
          autohide
          bg={toast.variant}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Aviso</strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'danger' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
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
                ) : (
                  <div className="songs-list">
                    {filteredSongs.length === 0 ? (
                      <p className="text-center text-secondary">Nenhuma música encontrada</p>
                    ) : (
                      filteredSongs.map((song) => (
                        <MusicItem
                          key={song.id}
                          song={song}
                          onAddToPlaylist={() => {
                            setSelectedSong(song);
                            setShowAddToPlaylistModal(true);
                          }}
                        />
                      ))
                    )}
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
                  ) : filteredPlaylists.length === 0 ? (
                    <Col xs={12}>
                      <p className="text-center text-secondary">Nenhuma playlist encontrada</p>
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
                          key={playlist.id}
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

      <DeletePlaylistModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedPlaylist(null);
        }}
        onConfirm={handleDeletePlaylist}
        playlist={selectedPlaylist}
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
