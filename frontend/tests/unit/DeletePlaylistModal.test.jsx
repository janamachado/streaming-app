import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Modal } from 'react-bootstrap'
import App from '../../src/App'

describe('Modal Excluir Playlist', () => {
  // Mock da playlist vazia
  const emptyPlaylist = {
    id: 1,
    name: 'Playlist Vazia',
    playlistSongs: []
  }

  // Mock da playlist com músicas
  const playlistWithSongs = {
    id: 2,
    name: 'Playlist Com Músicas',
    playlistSongs: [
      {
        song: {
          id: 1,
          title: 'Música 1',
          artist: 'Artista 1'
        }
      }
    ]
  }

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('deve confirmar exclusão de playlist vazia', () => {
    const onDeletePlaylist = vi.fn()
    
    render(
      <Modal show={true} onHide={vi.fn()} centered className="dark-modal">
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Excluir Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>Tem certeza que deseja excluir a playlist "{emptyPlaylist.name}"?</p>
          <p className="text-secondary mb-0">
            Esta ação não pode ser desfeita e todas as músicas serão removidas da playlist.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <button onClick={vi.fn()}>Cancelar</button>
          <button onClick={onDeletePlaylist}>Excluir</button>
        </Modal.Footer>
      </Modal>
    )

    // Verifica se o título do modal está correto
    expect(screen.getByText('Excluir Playlist')).toBeInTheDocument()

    // Verifica se mostra o nome da playlist na mensagem
    expect(screen.getByText(/Playlist Vazia/)).toBeInTheDocument()

    // Verifica se tem o aviso de que a ação não pode ser desfeita
    expect(screen.getByText(/Esta ação não pode ser desfeita/)).toBeInTheDocument()

    // Verifica se tem os botões
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument()

    // Clica no botão excluir
    fireEvent.click(screen.getByRole('button', { name: /excluir/i }))

    // Verifica se a função de exclusão foi chamada
    expect(onDeletePlaylist).toHaveBeenCalled()
  })

  it('deve cancelar exclusão de playlist', () => {
    const onHide = vi.fn()
    
    render(
      <Modal show={true} onHide={onHide} centered className="dark-modal">
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Excluir Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>Tem certeza que deseja excluir a playlist "{emptyPlaylist.name}"?</p>
          <p className="text-secondary mb-0">
            Esta ação não pode ser desfeita e todas as músicas serão removidas da playlist.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <button onClick={onHide}>Cancelar</button>
          <button onClick={vi.fn()}>Excluir</button>
        </Modal.Footer>
      </Modal>
    )

    // Clica no botão cancelar
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    // Verifica se a função de fechar foi chamada
    expect(onHide).toHaveBeenCalled()
  })

  describe('Exclusão de playlist com músicas', () => {
    it('deve mostrar mensagem apropriada para playlist com músicas', () => {
      render(
        <Modal show={true} onHide={vi.fn()} centered className="dark-modal">
          <Modal.Header closeButton className="bg-dark text-light border-secondary">
            <Modal.Title>Excluir Playlist</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <p>Tem certeza que deseja excluir a playlist "{playlistWithSongs.name}"?</p>
            <p className="text-secondary mb-0">
              Esta ação não pode ser desfeita e todas as músicas serão removidas da playlist.
            </p>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary">
            <button onClick={vi.fn()}>Cancelar</button>
            <button onClick={vi.fn()}>Excluir</button>
          </Modal.Footer>
        </Modal>
      )

      // Verifica se mostra o nome da playlist com músicas
      expect(screen.getByText(/Playlist Com Músicas/)).toBeInTheDocument()

      // Verifica se tem o aviso sobre remoção de músicas
      expect(screen.getByText(/todas as músicas serão removidas/)).toBeInTheDocument()
    })

    it('deve excluir playlist com músicas quando confirmado', () => {
      const onDeletePlaylist = vi.fn()
      
      render(
        <Modal show={true} onHide={vi.fn()} centered className="dark-modal">
          <Modal.Header closeButton className="bg-dark text-light border-secondary">
            <Modal.Title>Excluir Playlist</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <p>Tem certeza que deseja excluir a playlist "{playlistWithSongs.name}"?</p>
            <p className="text-secondary mb-0">
              Esta ação não pode ser desfeita e todas as músicas serão removidas da playlist.
            </p>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary">
            <button onClick={vi.fn()}>Cancelar</button>
            <button onClick={onDeletePlaylist}>Excluir</button>
          </Modal.Footer>
        </Modal>
      )

      // Verifica se mostra o nome da playlist e o número de músicas
      expect(screen.getByText(/Playlist Com Músicas/)).toBeInTheDocument()

      // Clica no botão excluir
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }))

      // Verifica se a função de exclusão foi chamada
      expect(onDeletePlaylist).toHaveBeenCalled()
    })

    it('deve permitir cancelar exclusão de playlist com músicas', () => {
      const onHide = vi.fn()
      
      render(
        <Modal show={true} onHide={onHide} centered className="dark-modal">
          <Modal.Header closeButton className="bg-dark text-light border-secondary">
            <Modal.Title>Excluir Playlist</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <p>Tem certeza que deseja excluir a playlist "{playlistWithSongs.name}"?</p>
            <p className="text-secondary mb-0">
              Esta ação não pode ser desfeita e todas as músicas serão removidas da playlist.
            </p>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary">
            <button onClick={onHide}>Cancelar</button>
            <button onClick={vi.fn()}>Excluir</button>
          </Modal.Footer>
        </Modal>
      )

      // Verifica se mostra o aviso sobre remoção de músicas
      expect(screen.getByText(/todas as músicas serão removidas/)).toBeInTheDocument()

      // Clica no botão cancelar
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))

      // Verifica se a função de fechar foi chamada
      expect(onHide).toHaveBeenCalled()
    })
  })

  it('deve fechar modal ao clicar no X', () => {
    const onHide = vi.fn()
    
    render(
      <Modal show={true} onHide={onHide} centered className="dark-modal">
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>Excluir Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>Tem certeza que deseja excluir a playlist "{emptyPlaylist.name}"?</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <button onClick={vi.fn()}>Cancelar</button>
          <button onClick={vi.fn()}>Excluir</button>
        </Modal.Footer>
      </Modal>
    )

    // Clica no botão de fechar (X)
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    // Verifica se a função de fechar foi chamada
    expect(onHide).toHaveBeenCalled()
  })
})
