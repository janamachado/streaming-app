const request = require('supertest');
const app = require('../../src/app');
const PlaylistService = require('../../src/services/playlist.service');

// Mock do serviço de Playlist
jest.mock('../../src/services/playlist.service');

describe('Playlist Routes', () => {
  const mockSong = {
    id: 1,
    externalId: 'deezer:123',
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    url: 'http://test.com/song.mp3',
    cover: 'http://test.com/cover.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockPlaylist = {
    id: 1,
    name: 'Test Playlist',
    description: 'Test Description',
    playlistSongs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/playlists', () => {
    it('deve criar uma playlist quando os dados são válidos', async () => {
      PlaylistService.create.mockResolvedValue(mockPlaylist);

      const response = await request(app)
        .post('/api/playlists')
        .send({
          name: 'Test Playlist',
          description: 'Test Description'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockPlaylist);
    });

    it('deve retornar 400 quando o nome não é fornecido', async () => {
      PlaylistService.create.mockRejectedValue({ 
        type: 'ValidationError',
        message: 'O nome da playlist é obrigatório'
      });

      const response = await request(app)
        .post('/api/playlists')
        .send({
          description: 'Test Description'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'O nome da playlist é obrigatório');
    });

    it('deve retornar 400 quando o nome é muito longo', async () => {
      PlaylistService.create.mockRejectedValue({ 
        type: 'ValidationError',
        message: 'O nome da playlist não pode ter mais que 25 caracteres'
      });

      const response = await request(app)
        .post('/api/playlists')
        .send({
          name: 'A'.repeat(26),
          description: 'Test Description'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'O nome da playlist não pode ter mais que 25 caracteres');
    });
  });

  describe('GET /api/playlists/:id', () => {
    it('deve retornar uma playlist específica', async () => {
      PlaylistService.findOne.mockResolvedValue(mockPlaylist);

      const response = await request(app)
        .get('/api/playlists/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPlaylist);
    });

    it('deve retornar 404 quando a playlist não existe', async () => {
      PlaylistService.findOne.mockRejectedValue({ 
        type: 'NotFoundError',
        message: 'Playlist não encontrada'
      });

      const response = await request(app)
        .get('/api/playlists/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/playlists/:id', () => {
    it('deve atualizar uma playlist quando os dados são válidos', async () => {
      const updatedPlaylist = { ...mockPlaylist, name: 'Updated Playlist' };
      PlaylistService.update.mockResolvedValue(updatedPlaylist);

      const response = await request(app)
        .put('/api/playlists/1')
        .send({
          name: 'Updated Playlist'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPlaylist);
    });

    it('deve retornar 404 quando a playlist não existe', async () => {
      PlaylistService.update.mockRejectedValue({ 
        type: 'NotFoundError',
        message: 'Playlist não encontrada'
      });

      const response = await request(app)
        .put('/api/playlists/999')
        .send({
          name: 'Updated Playlist'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/playlists/:id', () => {
    it('deve deletar uma playlist existente', async () => {
      PlaylistService.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/playlists/1');

      expect(response.status).toBe(204);
    });

    it('deve retornar 404 quando a playlist não existe', async () => {
      PlaylistService.delete.mockRejectedValue({ 
        type: 'NotFoundError',
        message: 'Playlist não encontrada'
      });

      const response = await request(app)
        .delete('/api/playlists/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/playlists/:id/songs', () => {
    it('deve adicionar músicas a uma playlist', async () => {
      const playlistWithSongs = {
        ...mockPlaylist,
        playlistSongs: [{
          id: 1,
          playlistId: 1,
          songId: 1,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          song: mockSong
        }]
      };
      PlaylistService.addSongs.mockResolvedValue(playlistWithSongs);

      const response = await request(app)
        .post('/api/playlists/1/songs')
        .send({
          songIds: [1]
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(playlistWithSongs);
    });

    it('deve retornar 400 quando nenhuma música é fornecida', async () => {
      PlaylistService.addSongs.mockRejectedValue({ 
        type: 'ValidationError',
        message: 'É necessário fornecer pelo menos uma música'
      });

      const response = await request(app)
        .post('/api/playlists/1/songs')
        .send({
          songIds: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'É necessário fornecer pelo menos uma música');
    });
  });

  describe('DELETE /api/playlists/:id/songs', () => {
    it('deve remover músicas de uma playlist', async () => {
      const playlistWithoutSongs = { ...mockPlaylist, playlistSongs: [] };
      PlaylistService.removeSongs.mockResolvedValue(playlistWithoutSongs);

      const response = await request(app)
        .delete('/api/playlists/1/songs')
        .send({
          songIds: [1]
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(playlistWithoutSongs);
    });

    it('deve retornar 400 quando nenhuma música é fornecida', async () => {
      PlaylistService.removeSongs.mockRejectedValue({ 
        type: 'ValidationError',
        message: 'É necessário fornecer pelo menos uma música'
      });

      const response = await request(app)
        .delete('/api/playlists/1/songs')
        .send({
          songIds: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'É necessário fornecer pelo menos uma música');
    });
  });
});
