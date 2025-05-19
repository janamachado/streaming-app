import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import App from '../../src/App'

// Mock do axios
vi.mock('axios')

describe('Integração - Adicionar Música à Playlist', () => {
  const API_BASE_URL = 'http://localhost:3000/api'
  
  // Mock da música
  const mockSong = {
    id: 1,
    title: 'Música de Teste',
    artist: 'Artista Teste',
    album: 'Album Teste',
    duration: 180,
    cover: 'http://example.com/cover.jpg',
    externalId: 'deezer:1'
  }

  // Mock da playlist
  const mockPlaylist = {
    id: 1,
    name: 'Playlist de Teste',
    description: 'Playlist para testar',
    playlistSongs: [],
    updatedAt: new Date().toISOString()
  }

  beforeEach(() => {
    // Mock do GET de músicas
    axios.get.mockImplementation((url) => {
      if (url === `${API_BASE_URL}/deezer/top`) {
        return Promise.resolve({ data: [mockSong] })
      }
      if (url === `${API_BASE_URL}/playlists`) {
        return Promise.resolve({ data: [mockPlaylist] })
      }
      return Promise.reject(new Error('not found'))
    })

    // Mock do POST para adicionar música
    axios.post.mockImplementation((url) => {
      if (url === `${API_BASE_URL}/playlists/1/songs`) {
        // Adiciona a música à playlist
        mockPlaylist.playlistSongs = [{
          song: mockSong,
          order: 1
        }]
        return Promise.resolve({ data: mockPlaylist })
      }
      return Promise.reject(new Error('not found'))
    })
  })

  it('deve adicionar uma música à playlist e exibi-la no modal de detalhes', async () => {
    render(<App />)

    // Aguarda o carregamento das músicas
    await waitFor(() => {
      expect(screen.getByText('Música de Teste')).toBeInTheDocument()
    })

    // Clica no botão de adicionar à playlist
    const addButton = screen.getByTestId('add-to-playlist-button')
    fireEvent.click(addButton)

    // Aguarda o modal de adicionar à playlist abrir
    await waitFor(() => {
      expect(screen.getByTestId('add-to-playlist-modal')).toBeInTheDocument()
    })

    // Seleciona a playlist
    const playlistCheckbox = screen.getByTestId('playlist-checkbox-1')
    fireEvent.click(playlistCheckbox)

    // Clica em adicionar
    const confirmButton = screen.getByRole('button', { name: /adicionar/i })
    fireEvent.click(confirmButton)

    // Aguarda a requisição POST ser feita
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/playlists/1/songs`,
        {
          songIds: [mockSong.id]
        }
      )
    })

    // Clica na playlist para ver os detalhes
    const playlistCard = screen.getByTestId('playlist-card-1')
    fireEvent.click(playlistCard)

    // Verifica se a música aparece no modal de detalhes
    await waitFor(() => {
      expect(screen.getByText('Música de Teste')).toBeInTheDocument()
      expect(screen.getByText('Artista Teste')).toBeInTheDocument()
      expect(screen.getByText('Album Teste')).toBeInTheDocument()
    })
  })
})
