const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
class SongService {
  validateSong(data) {
    const requiredFields = ['title', 'artist', 'duration', 'album'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw { 
        type: 'ValidationError', 
        message: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
      };
    }

    if (typeof data.duration !== 'number' || data.duration <= 0) {
      throw { 
        type: 'ValidationError', 
        message: 'A duração deve ser um número positivo em segundos'
      };
    }
  }

  async create(data) {
    this.validateSong(data);
    
    const newSong = await prisma.song.create({
      data: {
        title: data.title,
        artist: data.artist,
        duration: data.duration,
        album: data.album
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
      throw { type: 'NotFoundError', message: 'Song not found' };
    }
    return song;
  }

  // Pela regra de negocio não faz sentido editar uma música. 
  async update(id, data) {
    this.validateSong(data);
    
    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) {
      throw { type: 'NotFoundError', message: 'Song not found' };
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
      throw { type: 'NotFoundError', message: 'Song not found' };
    }
    await prisma.song.delete({ where: { id } });
  }

}

module.exports = new SongService();
