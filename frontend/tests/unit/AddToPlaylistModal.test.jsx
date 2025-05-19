import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AddToPlaylistModal from '../../src/components/AddToPlaylistModal'

describe('Modal Adicionar à Playlist', () => {
  const mockSong = {
    title: 'Música Teste',
    artist: 'Artista Teste',
    externalId: 'deezer:3076071401'
  }

  const mockPlaylists = [
    { id: 1, name: 'Playlist 1', playlistSongs: [] },
    { id: 2, name: 'Playlist 2', playlistSongs: [{ id: 1 }] }
  ]

  const defaultProps = {
    show: true,
    onHide: vi.fn(),
    playlists: mockPlaylists,
    onSelectPlaylist: vi.fn(),
    selectedSong: mockSong,
    onCreatePlaylist: vi.fn()
  }

  it('deve renderizar o modal corretamente', () => {
    render(<AddToPlaylistModal {...defaultProps} />)

    // Verifica se o título contém o nome da música
    expect(screen.getByText(/Música Teste/)).toBeInTheDocument()
    
    // Verifica se mostra o artista
    expect(screen.getByText(/Artista Teste/)).toBeInTheDocument()
    
    // Verifica se as playlists estão listadas
    expect(screen.getByText('Playlist 1')).toBeInTheDocument()
    expect(screen.getByText('Playlist 2')).toBeInTheDocument()
  })

  it('deve permitir buscar playlists', () => {
    render(<AddToPlaylistModal {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/buscar playlist/i)
    fireEvent.change(searchInput, { target: { value: 'Playlist 1' } })
    
    // Deve mostrar apenas Playlist 1
    expect(screen.getByText('Playlist 1')).toBeInTheDocument()
    expect(screen.queryByText('Playlist 2')).not.toBeInTheDocument()
  })

  it('deve chamar onSelectPlaylist com as playlists selecionadas', () => {
    render(<AddToPlaylistModal {...defaultProps} />)
    
    // Seleciona duas playlists
    const checkbox1 = screen.getByLabelText(/Playlist 1/)
    const checkbox2 = screen.getByLabelText(/Playlist 2/)
    
    fireEvent.click(checkbox1)
    fireEvent.click(checkbox2)
    
    // Clica em adicionar
    const addButton = screen.getByRole('button', { name: /adicionar/i })
    fireEvent.click(addButton)
    
    // Verifica se chamou com os IDs corretos
    expect(defaultProps.onSelectPlaylist).toHaveBeenCalledWith([1, 2])
  })

  it('deve limpar seleções ao fechar o modal', () => {
    render(<AddToPlaylistModal {...defaultProps} />)
    
    // Seleciona uma playlist
    const checkbox = screen.getByLabelText(/Playlist 1/)
    fireEvent.click(checkbox)
    
    // Fecha o modal
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)
    
    // Verifica se chamou onHide
    expect(defaultProps.onHide).toHaveBeenCalled()
    
    // Reabre o modal
    render(<AddToPlaylistModal {...defaultProps} />)
    
    // Verifica se a seleção foi limpa
    const checkboxAfterReopen = screen.getByLabelText(/Playlist 1/)
    expect(checkboxAfterReopen.checked).toBe(false)
  })

  it('deve permitir criar nova playlist', () => {
    render(<AddToPlaylistModal {...defaultProps} />)
    
    // Clica no botão de criar playlist
    const createButton = screen.getByText(/criar nova playlist/i)
    fireEvent.click(createButton)
    
    // Verifica se chamou onHide e onCreatePlaylist
    expect(defaultProps.onHide).toHaveBeenCalled()
    expect(defaultProps.onCreatePlaylist).toHaveBeenCalled()
  })
})
