const request = require('supertest');
const app = require('../../src/app');
const SongService = require('../../src/services/song.service');

// Mock do serviço de Song
jest.mock('../../src/services/song.service');

describe('Song Routes', () => {
  const mockSong = {
    id: 1,
    externalId: 1,
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    cover: 'http://test.com/cover.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/song', () => {
    it('deve criar uma música quando os dados são válidos', async () => {
      const songData = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180
      };
      SongService.create.mockResolvedValue(mockSong);

      const response = await request(app)
        .post('/api/song')
        .send(songData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockSong);
    });

    it('deve retornar 400 quando os dados são inválidos', async () => {
      const invalidData = {
        title: 'Test Song',
        artist: 'Test Artist'
      };

      SongService.create.mockRejectedValue({
        type: 'ValidationError',
        message: 'Campos obrigatórios faltando: duration, album'
      });

      const response = await request(app)
        .post('/api/song')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Campos obrigatórios faltando: duration, album' });
    });
  });

  describe('GET /api/song', () => {
    it('deve retornar todas as músicas', async () => {
      SongService.findAll.mockResolvedValue([mockSong]);

      const response = await request(app)
        .get('/api/song');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockSong]);
      expect(SongService.findAll).toHaveBeenCalled();
    });

    it('deve retornar uma lista vazia quando não há músicas', async () => {
      SongService.findAll.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/song');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(SongService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /api/song/:id', () => {
    it('deve retornar uma música específica', async () => {
      SongService.findOne.mockResolvedValue(mockSong);

      const response = await request(app)
        .get('/api/song/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSong);
      expect(SongService.findOne).toHaveBeenCalledWith(1);
    });

    it('deve retornar 404 quando a música não existe', async () => {
      SongService.findOne.mockRejectedValue({ 
        type: 'NotFoundError',
        message: 'Song not found'
      });

      const response = await request(app)
        .get('/api/song/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Song not found' });
    });
  });

  describe('PUT /api/song/:id', () => {
    it('deve atualizar uma música quando os dados são válidos', async () => {
      const updatedSong = { ...mockSong, title: 'Updated Song' };
      const updateData = {
        title: 'Updated Song',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180
      };
      SongService.update.mockResolvedValue(updatedSong);

      const response = await request(app)
        .put('/api/song/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedSong);
      expect(SongService.update).toHaveBeenCalledWith(1, updateData);
    });

    it('deve retornar 404 quando a música não existe', async () => {
      SongService.update.mockRejectedValue({ 
        type: 'NotFoundError',
        message: 'Song not found'
      });

      const response = await request(app)
        .put('/api/song/999')
        .send({
          title: 'Updated Song'
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Song not found' });
    });

    it('deve retornar 400 quando os dados são inválidos', async () => {
      SongService.update.mockRejectedValue({
        type: 'ValidationError',
        message: 'A duração deve ser um número positivo em segundos'
      });

      const response = await request(app)
        .put('/api/song/1')
        .send({
          duration: 'invalid' // Duração deve ser um número
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'A duração deve ser um número positivo em segundos' });
      expect(SongService.update).toHaveBeenCalledWith(1, { duration: 'invalid' });
    });
  });

  describe('DELETE /api/song/:id', () => {
    it('deve deletar uma música existente', async () => {
      SongService.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/song/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(SongService.delete).toHaveBeenCalledWith(1);
    });

    it('deve retornar 404 quando a música não existe', async () => {
      SongService.delete.mockRejectedValue({ 
        type: 'NotFoundError',
        message: 'Song not found'
      });

      const response = await request(app)
        .delete('/api/song/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Song not found' });
    });
  });
});
