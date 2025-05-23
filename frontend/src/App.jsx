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
  const [selectedSongForNewPlaylist, setSelectedSongForNewPlaylist] = useState(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [playlistReloadKey, setPlaylistReloadKey] = useState(0); // Controla reload das playlists
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
      const response = await axios.get(`${API_BASE_URL}/deezer/top`);
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
              .sort((a, b) => b.order - a.order)
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
  const handleCreatePlaylist = async (data, songToAdd = null) => {
    try {
      // Cria a playlist
      const response = await axios.post(`${API_BASE_URL}/playlists`, data);
      const newPlaylistId = response.data.id;

      // Se tem música para adicionar, adiciona
      if (songToAdd) {
        await axios.post(`${API_BASE_URL}/playlists/${newPlaylistId}/songs`, { 
          songIds: [parseInt(songToAdd.externalId.split(':')[1])]
        });
      }

      // Busca todas as playlists atualizadas do servidor
      const updatedPlaylists = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setIsModalOpen(false);

      // Mostra mensagem de sucesso
      setToast({
        show: true,
        message: songToAdd 
          ? `Playlist criada e música "${songToAdd.title}" adicionada com sucesso!`
          : 'Playlist criada com sucesso!',
        variant: 'success'
      });

      return true; // Indica sucesso
    } catch (error) {
      const message = error.response?.data?.message || "Não foi possível criar a playlist. Por favor, tente novamente.";
      setToast({
        show: true,
        message,
        variant: 'danger'
      });
      return false; // Indica falha
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
      // Extrai o número do ID do Deezer (formato: "deezer:3076071401")
      const deezerId = parseInt(selectedSong.externalId.split(':')[1]);
      if (isNaN(deezerId)) {
        throw new Error('ID da música inválido');
      }

      for (const playlistId of playlistIds) {
        await axios.post(`${API_BASE_URL}/playlists/${playlistId}/songs`, { 
          songIds: [deezerId]
        });
      }
      
      setShowAddToPlaylistModal(false);
      const updatedPlaylists = await fetchPlaylists();
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setSelectedSong(null);
      setPlaylistReloadKey(prev => prev + 1); // Força reload quando adiciona música

      // Mostra mensagem de sucesso
      setToast({
        show: true,
        message: playlistIds.length > 1
          ? `Música "${selectedSong.title}" adicionada às playlists selecionadas!`
          : `Música "${selectedSong.title}" adicionada à playlist!`,
        variant: 'success'
      });
    } catch (error) {
      handleApiError(error, "Não foi possível adicionar a música a todas as playlists. Por favor, tente novamente.");
    }
  };

// ...
  const handleRemoveSong = async (playlistId, songIds) => {
    try {
      await axios.delete(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
        data: { songIds: songIds.map(id => parseInt(id)) }
      });
      const updatedPlaylists = playlists.map(p => {
        if (p.id === playlistId) {
          return {
            ...p,
            playlistSongs: p.playlistSongs.filter(ps => !songIds.includes(ps.song.id))
          };
        }
        return p;
      });
      setPlaylists(updatedPlaylists);
      setFilteredPlaylists(updatedPlaylists);
      setPlaylistReloadKey(prev => prev + 1); // Força reload quando remove música
    } catch (error) {
      const message = songIds.length > 1
        ? "Não foi possível remover as músicas da playlist. Por favor, tente novamente."
        : "Não foi possível remover a música da playlist. Por favor, tente novamente.";
      handleApiError(error, message);
    }
  };

  const handleSongSearch = async ({ query }) => {
    try {
      const searchTerm = query.trim();
      if (!searchTerm) {
        // Se não houver termo de busca, carrega as top músicas
        const response = await axios.get(`${API_BASE_URL}/deezer/top`);
        setSongs(response.data);
        setFilteredSongs(response.data);
        return;
      }

      // Busca músicas usando a rota de busca do backend
      const response = await axios.get(`${API_BASE_URL}/deezer/search`, {
        params: {
          query: searchTerm
        }
      });
      
      setSongs(response.data);
      setFilteredSongs(response.data);
    } catch (err) {
      handleApiError(err, 'Erro ao buscar músicas');
    }
  };

  return (
    <div className="app-container">
      <Container fluid className="py-2 px-4">
        <Row>
          <Col xs={12} lg={4}>
            <div className="bg-dark rounded-3 p-3 mb-3 mb-lg-0 sticky-top" style={{ top: '0.5rem', height: 'calc(100vh - 1rem)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h4 mb-0 text-light">Músicas</h2>
              </div>
              <div className="mb-3">
                <SongSearch onSearch={handleSongSearch} />
              </div>
              <div className="pt-2 pe-2" style={{ overflowY: 'auto', flex: 1 }}>
                {filteredSongs.map((song) => (
                  <MusicItem
                    key={song.externalId}
                    song={song}
                    onAddToPlaylist={() => {
                      setSelectedSong(song);
                      setShowAddToPlaylistModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </Col>
          <Col xs={12} lg={8}>
            <div className="bg-dark rounded-3 p-3" style={{ height: 'calc(100vh - 1rem)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="mb-2">
                <div className="d-flex align-items-center gap-2">
                  <h2 className="h4 mb-0 text-light">Minhas Playlists</h2>
                  <span className="text-secondary">•</span>
                  <span className="text-secondary">
                    {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <PlaylistSearch 
                  onSearch={handlePlaylistSearch}
                  onCreatePlaylist={() => setIsModalOpen(true)}
                />
              </div>

              <div style={{ overflowY: 'auto', flex: 1, overflowX: 'hidden' }}>
                <Row className="g-2 mx-0 pt-2 pe-2">
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
                    filteredPlaylists
                      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                      .map((playlist) => (
                      <Col key={playlist.id} xs={12} md={6} xl={4}>
                        <PlaylistCard
                          playlist={playlist}
                          onDeletePlaylist={confirmDeletePlaylist}
                          onRemoveSong={handleRemoveSong}
                          onEditPlaylist={handleEditPlaylist}
                          reloadKey={playlistReloadKey}
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
        onHide={() => {
          setIsModalOpen(false);
          setSelectedSongForNewPlaylist(null);
        }}
        onCreatePlaylist={(data) => handleCreatePlaylist(data, selectedSongForNewPlaylist)}
      />

      <AddToPlaylistModal
        show={showAddToPlaylistModal}
        onHide={() => setShowAddToPlaylistModal(false)}
        playlists={playlists}
        onSelectPlaylist={handleAddToPlaylist}
        selectedSong={selectedSong}
        onCreatePlaylist={() => {
          setShowAddToPlaylistModal(false);
          setIsModalOpen(true);
          // Guarda a música selecionada para ser adicionada após criar a playlist
          setSelectedSongForNewPlaylist(selectedSong);
        }}
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
