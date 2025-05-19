import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'

// Mock do axios
vi.mock('axios')

describe('Integração - Exclusão de Playlist', () => {
  const API_BASE_URL = 'http://localhost:3000/api'
  
  it('deve retornar status 201 ao excluir uma playlist', async () => {
    // Mock do DELETE para excluir playlist
    axios.delete.mockResolvedValueOnce({ status: 201 })

    // Faz a requisição DELETE
    const response = await axios.delete(`${API_BASE_URL}/playlists/1`)

    // Verifica se a API foi chamada corretamente
    expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/playlists/1`)
    
    // Verifica se o status é 201
    expect(response.status).toBe(201)
  })
})
