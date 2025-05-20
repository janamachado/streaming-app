const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
class SongService {
  validateSong(data) {
    const requiredFields = ['title', 'externalId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw { 
        type: 'ValidationError', 
        message: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
      };
    }

    if (data.duration !== undefined && (typeof data.duration !== 'number' || data.duration <= 0)) {
      throw { 
        type: 'ValidationError', 
        message: 'A duração deve ser um número positivo em segundos'
      };
    }
  }

  async create(data) {
    this.validateSong(data);

    // Verificar se já existe uma música com o mesmo externalId
    const existingSong = await prisma.song.findUnique({
      where: { externalId: data.externalId }
    });

    if (existingSong) {
      throw { 
        type: 'ValidationError', 
        message: 'Música já existe no banco de dados'
      };
    }
    
    const newSong = await prisma.song.create({
      data: {
        externalId: data.externalId,
        title: data.title,
        artist: data.artist || null,
        duration: data.duration || null,
        album: data.album || null,
        url: data.url || null,
        cover: data.cover || null
      }
    });
    return newSong;
  }

  async findAll() {
    return await prisma.song.findMany();
  }

  async findOne(id) {
    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) {
      throw { type: 'NotFoundError', message: 'Música não encontrada' };
    }
    return song;
  }

  // Pela regra de negocio não faz sentido editar uma música. 
  async update(id, data) {
    this.validateSong(data);
    
    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) {
      throw { type: 'NotFoundError', message: 'Música não encontrada' };
    }

    const updatedData = {
      ...song,
      ...data
    };

    // Validar os dados atualizados
    this.validateSong(updatedData);

    const updatedSong = await prisma.song.update({
      where: { id },
      data: updatedData,
    });
    return updatedSong;
  }

// Pela regra de negocio não faz sentido deletar uma música.
  async delete(id) {
    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) {
      throw { type: 'NotFoundError', message: 'Música não encontrada' };
    }
    await prisma.song.delete({ where: { id } });
  }

}

module.exports = new SongService();
