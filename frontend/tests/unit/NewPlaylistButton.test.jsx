import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CreatePlaylistModal from '../../src/components/CreatePlaylistModal'

describe('Modal Nova Playlist', () => {
  const defaultProps = {
    show: true,
    onHide: vi.fn(),
    onCreatePlaylist: vi.fn()
  }

  it('deve renderizar o modal corretamente', () => {
    render(<CreatePlaylistModal {...defaultProps} />)

    // Verifica se o título está presente
    expect(screen.getByText('Nova Playlist')).toBeInTheDocument()

    // Verifica se os campos do formulário estão presentes
    expect(screen.getByLabelText(/nome da playlist/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /criar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('deve chamar onHide ao clicar em Cancelar', () => {
    render(<CreatePlaylistModal {...defaultProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    
    expect(defaultProps.onHide).toHaveBeenCalled()
  })

  it('deve validar campos obrigatórios', async () => {
    render(<CreatePlaylistModal {...defaultProps} />)
    
    // Tenta submeter o formulário vazio
    fireEvent.click(screen.getByRole('button', { name: /criar/i }))
    
    // Verifica se o campo nome é obrigatório
    const nameInput = screen.getByLabelText(/nome da playlist/i)
    expect(nameInput).toBeRequired()
  })

  it('deve chamar onCreatePlaylist com os dados corretos', () => {
    render(<CreatePlaylistModal {...defaultProps} />)
    
    // Preenche o formulário
    fireEvent.change(screen.getByLabelText(/nome da playlist/i), {
      target: { value: 'Minha Playlist' }
    })
    
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Descrição da playlist' }
    })
    
    // Submete o formulário clicando no botão criar
    fireEvent.click(screen.getByRole('button', { name: /criar/i }))
    
    // Verifica se onCreatePlaylist foi chamado com os dados corretos
    expect(defaultProps.onCreatePlaylist).toHaveBeenCalledWith({
      name: 'Minha Playlist',
      description: 'Descrição da playlist'
    })
  })
})
