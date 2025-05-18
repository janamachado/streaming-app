import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Toast, ToastContainer, Modal } from 'react-bootstrap';
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
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
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
      setToast({
        show: true,
        message: 'Playlist excluída com sucesso!',
        variant: 'success'
      });
    } catch (error) {
      handleApiError(error, "Não foi possível excluir a playlist. Por favor, tente novamente.");
    }
  };

  const handleAddToPlaylist = async (playlistIds) => {
    if (!selectedSong || !playlistIds?.length) return;
    
    try {
      for (const playlistId of playlistIds) {
        const numericPlaylistId = parseInt(playlistId);
        if (isNaN(numericPlaylistId)) continue; 

        await axios.post(`${API_BASE_URL}/playlists/${numericPlaylistId}/songs`, { 
          songIds: [parseInt(selectedSong.id)] 
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
      <Container className="py-4">
        <Row>
          <Col xs={12} lg={4}>
            <div className="bg-dark rounded-3 p-4 mb-4 mb-lg-0 sticky-top" style={{ top: '1rem' }}>
              <SongSearch onSearch={handleSongSearch} />
              <div className="mt-4">
                {filteredSongs.map((song) => (
                  <MusicItem
                    key={song.id}
                    song={song}
                    onAddToPlaylist={() => setSelectedSong(song)}
                  />
                ))}
              </div>
            </div>
          </Col>
          <Col xs={12} lg={8}>
            <div className="bg-dark rounded-3 p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h2 className="h4 mb-1">Minhas Playlists</h2>
                  <p className="text-secondary mb-0">
                    {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-pill px-3"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Nova Playlist
                </Button>
              </div>

              <PlaylistSearch onSearch={handlePlaylistSearch} />

              <div className="mt-4">
                <Row>
                  {loading ? (
                    <Col xs={12}>
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                      </div>
                    </Col>
                  ) : filteredPlaylists.length === 0 ? (
                    <Col xs={12}>
                      <div className="text-center py-5">
                        <i className="bi bi-music-note-list display-4 text-secondary mb-3"></i>
                        <h3 className="h5 text-secondary">Nenhuma playlist encontrada</h3>
                        <Button
                          variant="primary"
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

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          bg={toast.variant}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default App;
