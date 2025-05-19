import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlaylistDetailsModal from '../../src/components/PlaylistDetailsModal'

describe('Modal Detalhes da Playlist', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })
  const mockPlaylist = {
    id: 1,
    name: 'Minha Playlist',
    description: 'Descrição da playlist',
    playlistSongs: [
      {
        order: 2,
        song: {
          id: 1,
          title: 'Música 1',
          artist: 'Artista 1',
          album: 'Album 1',
          duration: 180,
          cover: 'http://example.com/cover1.jpg'
        }
      },
      {
        order: 1,
        song: {
          id: 2,
          title: 'Música 2',
          artist: 'Artista 2',
          album: 'Album 2',
          duration: 240,
          cover: 'http://example.com/cover2.jpg'
        }
      }
    ]
  }

  const defaultProps = {
    show: true,
    onHide: vi.fn(),
    playlist: mockPlaylist,
    onRemoveSong: vi.fn()
  }

  it('deve renderizar o modal com as informações da playlist', () => {
    render(<PlaylistDetailsModal {...defaultProps} />)

    // Verifica título e descrição
    expect(screen.getByText('Minha Playlist')).toBeInTheDocument()
    expect(screen.getByText('Descrição da playlist')).toBeInTheDocument()
    expect(screen.getByText('2 músicas')).toBeInTheDocument()

    // Verifica se as músicas estão listadas na ordem correta
    const musicItems = screen.getAllByText(/Música \d/)
    expect(musicItems).toHaveLength(2)
    expect(musicItems[0]).toHaveTextContent('Música 2') // Ordem 1
    expect(musicItems[1]).toHaveTextContent('Música 1') // Ordem 2
  })

  describe('Remoção de músicas', () => {
    it('deve permitir selecionar e remover todas as músicas', () => {
      render(<PlaylistDetailsModal {...defaultProps} />)
  
      // Seleciona todas as músicas
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0]) // Música 2
      fireEvent.click(checkboxes[1]) // Música 1
  
      // Verifica se o botão de remover está habilitado e mostra o número correto
      const removeButton = screen.getByRole('button', { name: /remover 2 músicas/i })
      expect(removeButton).toBeEnabled()
  
      // Clica para remover
      fireEvent.click(removeButton)
  
      // Verifica se chamou onRemoveSong com os IDs corretos
      expect(defaultProps.onRemoveSong).toHaveBeenCalledWith([2, 1])
    })

    it('deve permitir selecionar e remover apenas uma música', () => {
      render(<PlaylistDetailsModal {...defaultProps} />)
  
      // Seleciona apenas uma música
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0]) // Música 2
  
      // Verifica se o botão mostra o texto no singular
      const removeButton = screen.getByRole('button', { name: /remover 1 música/i })
      expect(removeButton).toBeEnabled()
  
      // Clica para remover
      fireEvent.click(removeButton)
  
      // Verifica se chamou onRemoveSong com o ID correto
      expect(defaultProps.onRemoveSong).toHaveBeenCalledWith([2])
    })

    it('deve permitir desmarcar músicas selecionadas', () => {
      render(<PlaylistDetailsModal {...defaultProps} />)
  
      // Seleciona duas músicas
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0]) // Música 2
      fireEvent.click(checkboxes[1]) // Música 1
  
      // Desmarca uma música
      fireEvent.click(checkboxes[0]) // Desmarca Música 2
  
      // Verifica se o botão mostra o texto no singular
      const removeButton = screen.getByRole('button', { name: /remover 1 música/i })
      expect(removeButton).toBeEnabled()
  
      // Clica para remover
      fireEvent.click(removeButton)
  
      // Verifica se chamou onRemoveSong apenas com o ID da música que permaneceu selecionada
      expect(defaultProps.onRemoveSong).toHaveBeenCalledWith([1])
    })

    it('deve limpar seleções após remover músicas', () => {
      render(<PlaylistDetailsModal {...defaultProps} />)
  
      // Seleciona músicas
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0])
      fireEvent.click(checkboxes[1])
  
      // Remove as músicas
      const removeButton = screen.getByRole('button', { name: /remover 2 músicas/i })
      fireEvent.click(removeButton)
  
      // Limpa a renderização anterior
      cleanup()
      
      // Re-renderiza o modal (simulando atualização da playlist)
      render(<PlaylistDetailsModal {...defaultProps} />)
  
      // Verifica se nenhuma música está selecionada
      const checkboxesAfterRemoval = screen.getAllByRole('checkbox')
      checkboxesAfterRemoval.forEach(checkbox => {
        expect(checkbox).not.toBeChecked()
      })
  
      // Verifica se o botão de remover está desabilitado
      const removeButtonAfterRemoval = screen.getByRole('button', { name: /remover 0 músicas/i })
      expect(removeButtonAfterRemoval).toBeDisabled()
    })
  })

  it('deve desabilitar o botão de remover quando nenhuma música está selecionada', () => {
    render(<PlaylistDetailsModal {...defaultProps} />)

    const removeButton = screen.getByRole('button', { name: /remover/i })
    expect(removeButton).toBeDisabled()
  })

  it('deve mostrar mensagem quando não há músicas', () => {
    const playlistSemMusicas = {
      ...mockPlaylist,
      playlistSongs: []
    }

    render(<PlaylistDetailsModal {...defaultProps} playlist={playlistSemMusicas} />)

    expect(screen.getByText('Nenhuma música adicionada')).toBeInTheDocument()
    expect(screen.getByText('0 músicas')).toBeInTheDocument()
  })

  it('deve formatar a duração das músicas corretamente', () => {
    render(<PlaylistDetailsModal {...defaultProps} />)

    // Música 1: 180 segundos = 3:00
    expect(screen.getByText(/3:00/)).toBeInTheDocument()
    
    // Música 2: 240 segundos = 4:00
    expect(screen.getByText(/4:00/)).toBeInTheDocument()
  })

  it('deve fechar o modal ao clicar em Fechar', () => {
    render(<PlaylistDetailsModal {...defaultProps} />)

    const closeButton = screen.getByRole('button', { name: /fechar/i })
    fireEvent.click(closeButton)

    expect(defaultProps.onHide).toHaveBeenCalled()
  })
})
