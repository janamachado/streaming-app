const request = require('supertest');
const app = require('../../src/app');
const { prisma, cleanDatabase } = require('../helpers/database');

describe('Testes de Integração - Músicas', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/song', () => {
    it('deve criar uma nova música', async () => {
      const songData = {
        externalId: 'deezer:123',
        title: 'Test Song'
      };

      const response = await request(app)
        .post('/api/song')
        .send(songData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', songData.title);
      expect(response.body.artist).toBeNull();
      expect(response.body.album).toBeNull();
      expect(response.body.duration).toBeNull();
      expect(response.body.url).toBeNull();
      expect(response.body.cover).toBeNull();
    });

    it('deve impedir músicas duplicadas com o mesmo externalId', async () => {
      const songData = {
        externalId: 'deezer:123',
        title: 'Test Song'
      };

      // Criar a primeira música
      await request(app)
        .post('/api/song')
        .send(songData);

      // Tentar criar uma segunda música com o mesmo externalId
      const response = await request(app)
        .post('/api/song')
        .send(songData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Música já existe no banco de dados');
    });

    it('deve validar os dados da música', async () => {
      const testCases = [
        {
          data: { externalId: 'deezer:123' },
          expectedError: 'Campos obrigatórios faltando: title'
        },
        {
          data: { title: 'Test Song' },
          expectedError: 'Campos obrigatórios faltando: externalId'
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/song')
          .send(testCase.data)
          .expect(400);

        expect(response.body.message).toContain(testCase.expectedError);
      }
    });
  });

  describe('GET /api/song', () => {
    it('deve retornar um array vazio quando não existem músicas', async () => {
      const response = await request(app)
        .get('/api/song')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar todas as músicas', async () => {
      const songs = [
        {
          externalId: 'deezer:123',
          title: 'Song 1'
        },
        {
          externalId: 'deezer:456',
          title: 'Song 2'
        }
      ];

      for (const song of songs) {
        await request(app)
          .post('/api/song')
          .send(song);
      }

      const response = await request(app)
        .get('/api/song')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title', 'Song 1');
      expect(response.body[1]).toHaveProperty('title', 'Song 2');
    });
  });

  describe('GET /api/song/:id', () => {
    it('deve retornar 404 para música inexistente', async () => {
      const response = await request(app)
        .get('/api/song/999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Música não encontrada');
    });

    it('deve retornar uma música específica', async () => {
      const songData = {
        externalId: 'deezer:123',
        title: 'Test Song'
      };

      const createResponse = await request(app)
        .post('/api/song')
        .send(songData);

      const songId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/song/${songId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', songId);
      expect(response.body).toHaveProperty('title', songData.title);
      expect(response.body.artist).toBeNull();
      expect(response.body.album).toBeNull();
    });
  });
});
