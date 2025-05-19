import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { BiPencil, BiTrash, BiMusic } from 'react-icons/bi';
import '../styles/PlaylistCard.css';
import PlaylistDetailsModal from './PlaylistDetailsModal';

const PlaylistCard = ({ playlist, onDeletePlaylist, onRemoveSong, onEditPlaylist, reloadKey }) => {
  const [showModal, setShowModal] = useState(false);


  const onEditClick = (id) => {
    onEditPlaylist(id);
  };

  const onDeleteClick = (id) => {
    onDeletePlaylist(id);
  };
  // Garantir que playlist.songs existe e está ordenado por order
  const songs = (playlist.playlistSongs || []).sort((a, b) => {
    // Se não tiver order, usa a ordem original da lista
    if (!a.order && !b.order) return 0;
    if (!a.order) return 1;
    if (!b.order) return -1;
    return b.order - a.order;
  }).map(ps => ps.song);

  return (
    <>
      <Card key={reloadKey} 
        className="mb-2 bg-dark text-light border-secondary interactive me-0" 
        onClick={() => setShowModal(true)}
        style={{ width: '240px' }}
      >
        <div className="position-relative">
          {songs.length > 0 ? (
            <>
              <div style={{ height: '160px', overflow: 'hidden' }}>
                {songs[songs.length - 1].url ? (
                  <Card.Img 
                    variant="top" 
                    src={songs[songs.length - 1].url} 
                    alt=""
                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="d-none justify-content-center align-items-center bg-dark" 
                  style={{ height: '100%', width: '100%' }}
                >
                  <BiMusic size={50} className="text-secondary" />
                </div>
                <div 
                  className="position-absolute bottom-0 start-0 end-0" 
                  style={{ 
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    padding: '10px'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="me-2">
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
                        className="text-light p-1 playlist-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(playlist.id);
                        }}
                      >
                        <BiPencil />
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger p-1 playlist-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClick(playlist.id);
                        }}
                      >
                        <BiTrash />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="position-relative" style={{ height: '160px' }}>
              <div className="d-flex flex-column justify-content-start align-items-center h-100 bg-dark pt-4">
                <BiMusic size={32} className="text-secondary mb-2" />
                <p className="text-secondary mb-0">Adicione músicas</p>
              </div>
              <div 
                className="position-absolute bottom-0 start-0 end-0" 
                style={{ 
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(5px)',
                  padding: '10px'
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-2">
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
                      className="text-light p-1 playlist-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(playlist.id);
                      }}
                    >
                      <BiPencil />
                    </Button>
                    <Button
                      variant="link"
                      className="text-danger p-1 playlist-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(playlist.id);
                      }}
                    >
                      <BiTrash />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </Card>

      <PlaylistDetailsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        playlist={playlist}
        onRemoveSong={(songIds) => {
          onRemoveSong(playlist.id, songIds);
          setShowModal(false);
          setKey(prev => prev + 1); // Força re-render
        }}
      />
    </>
  );
};

export default PlaylistCard;
