const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PlaylistService {
  async create(data) {
    const newPlaylist = await prisma.playlist.create({
      data: {
        name: data.name,
        description: data.description,
        playlistSongs: data.playlistSongs
      }
    });
    return newPlaylist;
  }

  async findAll() {
    return await prisma.playlist.findMany();
  }

  async findOne(id) {
    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }
    return playlist;
  }

  async update(id, data) {
    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }
    const updatedPlaylist = await prisma.playlist.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        updatedAt: new Date(),
        playlistSongs: data.playlistSongs
      }
    });
    return updatedPlaylist;
  }

  async delete(id) {
    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }
    await prisma.playlist.delete({ where: { id } });
  }
}

module.exports = new PlaylistService();
