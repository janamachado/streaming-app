const request = require('supertest');
const app = require('../../src/app');
const { prisma, cleanDatabase } = require('../helpers/database');

describe('Playlist Integration Tests', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/playlists', () => {
    it('should create a new playlist', async () => {
      const playlistData = {
        name: 'Test Playlist',
        description: 'A test playlist'
      };

      const response = await request(app)
        .post('/api/playlists')
        .send(playlistData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(playlistData.name);
      expect(response.body.description).toBe(playlistData.description);

      // Verifica se foi realmente salvo no banco
      const savedPlaylist = await prisma.playlist.findUnique({
        where: { id: response.body.id }
      });
      expect(savedPlaylist).not.toBeNull();
      expect(savedPlaylist.name).toBe(playlistData.name);
    });

    it('should not allow duplicate playlist names', async () => {
      const playlistData = {
        name: 'Duplicate Test',
        description: 'First playlist'
      };

      // Cria a primeira playlist
      await request(app)
        .post('/api/playlists')
        .send(playlistData)
        .expect(201);

      // Tenta criar uma segunda playlist com o mesmo nome
      const response = await request(app)
        .post('/api/playlists')
        .send({
          name: 'Duplicate Test',
          description: 'Second playlist'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Já existe uma playlist com este nome');
    });

    it('should validate playlist data', async () => {
      const testCases = [
        {
          data: { description: 'Missing name' },
          expectedError: 'O nome da playlist é obrigatório'
        },
        {
          data: { name: '' },
          expectedError: 'O nome da playlist não pode estar vazio'
        },
        {
          data: { name: 'x'.repeat(26) },
          expectedError: 'O nome da playlist não pode ter mais que 25 caracteres'
        },
        {
          data: { name: 'Valid Name', description: 'x'.repeat(201) },
          expectedError: 'A descrição da playlist não pode ter mais que 200 caracteres'
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/playlists')
          .send(testCase.data)
          .expect(400);

        expect(response.body.message).toContain(testCase.expectedError);
      }
    });
  });

  describe('GET /api/playlists', () => {
    it('should return an empty array when no playlists exist', async () => {
      const response = await request(app)
        .get('/api/playlists')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return all playlists', async () => {
      // Criar algumas playlists primeiro
      const playlists = [
        { name: 'Playlist 1', description: 'First playlist' },
        { name: 'Playlist 2', description: 'Second playlist' }
      ];

      for (const playlist of playlists) {
        await request(app)
          .post('/api/playlists')
          .send(playlist);
      }

      const response = await request(app)
        .get('/api/playlists')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name', 'Playlist 1');
      expect(response.body[1]).toHaveProperty('name', 'Playlist 2');
    });
  });

  describe('GET /api/playlists/:id', () => {
    it('should return 404 for non-existent playlist', async () => {
      const response = await request(app)
        .get('/api/playlists/999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Playlist not found');
    });

    it('should return a specific playlist', async () => {
      // Criar uma playlist primeiro
      const createResponse = await request(app)
        .post('/api/playlists')
        .send({
          name: 'Test Playlist',
          description: 'Test Description'
        });

      const playlistId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/playlists/${playlistId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', playlistId);
      expect(response.body).toHaveProperty('name', 'Test Playlist');
      expect(response.body).toHaveProperty('description', 'Test Description');
    });
  });
});
