const request = require('supertest');
const app = require('../../src/app');
const DeezerService = require('../../src/services/deezer.service');

// Mock do serviço Deezer
jest.mock('../../src/services/deezer.service');

describe('Deezer Routes', () => {
  const mockTrack = {
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    url: 'http://test.com/preview.mp3',
    cover: 'http://test.com/cover.jpg',
    externalId: 'deezer:1',
    source: 'deezer'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/deezer/search', () => {
    it('deve retornar músicas quando a busca é bem sucedida', async () => {
      DeezerService.searchTracks.mockResolvedValue([mockTrack]);

      const response = await request(app)
        .get('/api/deezer/search')
        .query({ query: 'test' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockTrack]);
      expect(DeezerService.searchTracks).toHaveBeenCalledWith('test', 50);
    });

    it('deve retornar 500 quando há erro na API do Deezer', async () => {
      DeezerService.searchTracks.mockRejectedValue({
        type: 'ExternalAPIError',
        message: 'Erro ao buscar músicas do Deezer'
      });

      const response = await request(app)
        .get('/api/deezer/search')
        .query({ query: 'test' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ 
        message: 'Internal server error' 
      });
    });
  });

  describe('GET /api/deezer/top', () => {
    it('deve retornar as top músicas quando a requisição é bem sucedida', async () => {
      DeezerService.getTopTracks.mockResolvedValue([mockTrack]);

      const response = await request(app)
        .get('/api/deezer/top');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockTrack]);
      expect(DeezerService.getTopTracks).toHaveBeenCalledWith(50);
    });

    it('deve retornar 500 quando há erro na API do Deezer', async () => {
      DeezerService.getTopTracks.mockRejectedValue({
        type: 'ExternalAPIError',
        message: 'Internal server error'
      });

      const response = await request(app)
        .get('/api/deezer/top');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ 
        message: 'Internal server error' 
      });
    });
  });
});
