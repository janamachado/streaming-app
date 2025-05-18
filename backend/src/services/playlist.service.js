const { PrismaClient } = require('@prisma/client');
const { createPlaylistSchema, updatePlaylistSchema } = require('../schemas/playlist.schema');
const { playlistSongsSchema } = require('../schemas/playlist-songs.schema');
const prisma = new PrismaClient();

class PlaylistService {
  async create(data) {
    try {
      // Valida e sanitiza os dados usando Zod
      const validatedData = createPlaylistSchema.parse(data);

      // Verifica se já existe playlist com o mesmo nome
      const existingPlaylist = await prisma.playlist.findFirst({
        where: {
          name: {
            equals: validatedData.name,
            mode: 'insensitive' // case-insensitive
          }
        }
      });

      if (existingPlaylist) {
        throw { type: 'ValidationError', message: 'Já existe uma playlist com este nome' };
      }

      const newPlaylist = await prisma.playlist.create({
        data: validatedData,
        include: {
          playlistSongs: {
            include: {
              song: true
            }
          }
        }
      });
      return newPlaylist;
    } catch (error) {
      if (error.errors) {
        // Erro de validação do Zod
        throw { type: 'ValidationError', message: error.errors[0].message };
      }
      throw error;
    }
  }

  async findAll(filters = {}) {
    const where = {};
    
    // Filtro por nome
    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive'
      };
    }

    // Filtro por música
    if (filters.songId) {
      where.playlistSongs = {
        some: {
          songId: parseInt(filters.songId)
        }
      };
    }

    return await prisma.playlist.findMany({
      where,
      include: {
        playlistSongs: {
          include: {
            song: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }

  async search(query) {
    return await prisma.playlist.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        playlistSongs: {
          include: {
            song: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }

  async findPlaylistsBySong(songQuery) {
    let songCondition;

    // Se for um número, busca por ID
    if (!isNaN(songQuery)) {
      songCondition = {
        songId: parseInt(songQuery)
      };
    } else {
      // Se for texto, busca por título da música
      songCondition = {
        song: {
          title: {
            contains: songQuery,
            mode: 'insensitive'
          }
        }
      };
    }

    return await prisma.playlist.findMany({
      where: {
        playlistSongs: {
          some: songCondition
        }
      },
      include: {
        playlistSongs: {
          include: {
            song: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }

  async findOne(id) {
    const playlist = await prisma.playlist.findUnique({ 
      where: { id },
      include: {
        playlistSongs: {
          include: {
            song: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }
    return playlist;
  }

  async update(id, data) {
    try {
      // Valida e sanitiza os dados usando Zod
      const validatedData = updatePlaylistSchema.parse(data);

      const playlist = await prisma.playlist.findUnique({ where: { id } });
      if (!playlist) {
        throw { type: 'NotFoundError', message: 'Playlist não encontrada' };
      }

      // Se o nome está sendo alterado, verifica duplicidade
      if (validatedData.name && validatedData.name !== playlist.name) {
        const existingPlaylist = await prisma.playlist.findFirst({
          where: {
            name: {
              equals: validatedData.name,
              mode: 'insensitive'
            },
            id: {
              not: id
            }
          }
        });

        if (existingPlaylist) {
          throw { type: 'ValidationError', message: 'Já existe uma playlist com este nome' };
        }
      }

      const updatedPlaylist = await prisma.playlist.update({
        where: { id },
        data: {
          ...validatedData,
          updatedAt: new Date()
        },
        include: {
          playlistSongs: {
            include: {
              song: true
            }
          }
        }
      });
      return updatedPlaylist;
    } catch (error) {
      if (error.errors) {
        // Erro de validação do Zod
        throw { type: 'ValidationError', message: error.errors[0].message };
      }
      throw error;
    }
  }

  async delete(id) {
    const playlist = await prisma.playlist.findUnique({ 
      where: { id },
      include: {
        playlistSongs: true
      }
    });

    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }

    // Primeiro remove todas as músicas da playlist
    await prisma.playlistSong.deleteMany({
      where: { playlistId: id }
    });

    // Depois remove a playlist
    await prisma.playlist.delete({ where: { id } });
  }

  async addSongs(playlistId, data) {
    try {
      const { songIds } = playlistSongsSchema.parse(data);

      const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } });
      if (!playlist) {
        throw { type: 'NotFoundError', message: 'Playlist não encontrada' };
      }

      // Verifica se todas as músicas existem
      const songs = await prisma.song.findMany({
        where: {
          id: {
            in: songIds
          }
        }
      });

      if (songs.length !== songIds.length) {
        throw { type: 'ValidationError', message: 'Uma ou mais músicas não foram encontradas' };
      }

      // Adiciona as músicas à playlist
      await prisma.playlistSong.createMany({
        data: songIds.map(songId => ({
          playlistId,
          songId
        })),
        skipDuplicates: true
      });

      // Retorna a playlist atualizada
      return await prisma.playlist.findUnique({
        where: { id: playlistId },
        include: {
          playlistSongs: {
            include: {
              song: true
            }
          }
        }
      });
    } catch (error) {
      if (error.errors) {
        throw { type: 'ValidationError', message: error.errors[0].message };
      }
      throw error;
    }
  }

  async removeSongs(playlistId, data) {
    try {
      const { songIds } = playlistSongsSchema.parse(data);

      const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
        include: {
          playlistSongs: true
        }
      });

      if (!playlist) {
        throw { type: 'NotFoundError', message: 'Playlist não encontrada' };
      }

      // Remove as músicas da playlist
      await prisma.playlistSong.deleteMany({
        where: {
          playlistId,
          songId: {
            in: songIds
          }
        }
      });

      // Retorna a playlist atualizada
      return await prisma.playlist.findUnique({
        where: { id: playlistId },
        include: {
          playlistSongs: {
            include: {
              song: true
            }
          }
        }
      });
    } catch (error) {
      if (error.errors) {
        throw { type: 'ValidationError', message: error.errors[0].message };
      }
      throw error;
    }
  }
}

module.exports = new PlaylistService();
