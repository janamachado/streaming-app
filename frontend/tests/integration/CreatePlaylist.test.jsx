import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import App from '../../src/App'

// Mock do axios
vi.mock('axios')

describe('Integração - Criação de Playlist', () => {
  const API_BASE_URL = 'http://localhost:3000/api'
  
  // Mock das músicas que serão carregadas
  const mockSongs = [
    {
      id: 1,
      title: 'Música 1',
      artist: 'Artista 1',
      album: 'Album 1',
      duration: 180,
      cover: 'http://example.com/cover1.jpg',
      externalId: 'deezer:1'
    }
  ]

  // Mock das playlists existentes
  const mockPlaylists = []

  beforeEach(() => {
    // Mock das chamadas à API
    axios.get.mockImplementation((url) => {
      if (url === `${API_BASE_URL}/deezer/top`) {
        return Promise.resolve({ data: mockSongs })
      }
      if (url === `${API_BASE_URL}/playlists`) {
        return Promise.resolve({ data: mockPlaylists })
      }
      return Promise.reject(new Error('not found'))
    })

    // Mock do POST para criar playlist
    axios.post.mockImplementation((url, data) => {
      if (url === `${API_BASE_URL}/playlists`) {
        const newPlaylist = {
          id: mockPlaylists.length + 1,
          name: data.name,
          description: data.description,
          playlistSongs: []
        }
        mockPlaylists.push(newPlaylist)
        return Promise.resolve({ data: newPlaylist })
      }
      return Promise.reject(new Error('not found'))
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    mockPlaylists.length = 0 // Limpa o array de playlists
  })

  it('deve ser possível criar uma playlist', async () => {
    render(<App />)

    // Aguarda o carregamento inicial
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/playlists`)
    })

    // Clica no botão de criar primeira playlist
    const createButton = screen.getByRole('button', { name: /criar primeira playlist/i })
    fireEvent.click(createButton)

    // Preenche o nome da playlist
    const nameInput = screen.getByLabelText(/nome da playlist/i)
    fireEvent.change(nameInput, { target: { value: 'Teste Integração' } })

    // Clica em criar
    const submitButton = screen.getByRole('button', { name: /^criar$/i })
    fireEvent.click(submitButton)

    // Aguarda a playlist aparecer na lista
    await waitFor(() => {
      expect(screen.getByText('Teste Integração')).toBeInTheDocument()
    })

    // Verifica se a playlist foi criada com o nome correto
    expect(mockPlaylists[0].name).toBe('Teste Integração')
  })
})
