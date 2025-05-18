import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { BiPencil, BiTrash } from 'react-icons/bi';
import PlaylistDetailsModal from './PlaylistDetailsModal';
import '../styles/PlaylistCard.css';

const PlaylistCard = ({ playlist, onDeletePlaylist, onRemoveSong, onEditPlaylist }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const handleSongToggle = (songId) => {
    setSelectedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      }
      return [...prev, songId];
    });
  };

  const handleRemoveSelected = () => {
    onRemoveSong(playlist.id, selectedSongs);
    setSelectedSongs([]);
    setShowModal(false);
  };

  const onEditClick = (id) => {
    onEditPlaylist(id);
  };

  const onDeleteClick = (id) => {
    onDeletePlaylist(id);
  };

  // Garantir que playlist.songs existe
  const songs = playlist.songs || [];

  return (
    <>
      <Card 
        className="mb-3 bg-dark text-light border-secondary interactive" 
        onClick={() => setShowModal(true)}
      >
        <Card.Body className="d-flex justify-content-between align-items-center py-2">
          <div style={{ maxWidth: 'calc(100% - 100px)', minWidth: 0 }}>
            <h3 className="h6 mb-1 text-truncate" title={playlist.name}>
              {playlist.name.length > 25 ? `${playlist.name.substring(0, 25)}...` : playlist.name}
            </h3>
            <small className="text-secondary">
              {songs.length} música{songs.length !== 1 ? 's' : ''}
            </small>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              variant="link"
              className="text-light p-1"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(playlist.id);
              }}
            >
              <BiPencil />
            </Button>
            <Button
              variant="link"
              className="text-danger p-1"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(playlist.id);
              }}
            >
              <BiTrash />
            </Button>
          </div>
        </Card.Body>
      </Card>

      <PlaylistDetailsModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedSongs([]);
        }}
        playlist={playlist}
        selectedSongs={selectedSongs}
        onSongSelect={handleSongToggle}
        onDeleteSelected={handleRemoveSelected}
      />
    </>
  );
};

export default PlaylistCard;
