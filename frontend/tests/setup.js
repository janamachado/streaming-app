import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import React from 'react'

// Configura o React globalmente para os testes
global.React = React

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup()
})
