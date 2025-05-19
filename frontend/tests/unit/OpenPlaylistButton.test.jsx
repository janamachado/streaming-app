import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from 'react-bootstrap'

describe('Botão Abrir Modal Nova Playlist', () => {
  it('deve chamar setIsModalOpen ao clicar', () => {
    const setIsModalOpen = vi.fn()
    
    render(
      <Button
        variant="primary"
        onClick={() => setIsModalOpen(true)}
        className="rounded-pill px-3"
      >
        Nova Playlist
      </Button>
    )

    const button = screen.getByText('Nova Playlist')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('rounded-pill', 'px-3', 'btn', 'btn-primary')

    fireEvent.click(button)
    expect(setIsModalOpen).toHaveBeenCalledWith(true)
  })
})
