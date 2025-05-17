const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PlaylistService {
  async create(data) {
    // Verifica se já existe playlist com o mesmo nome
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive' // case-insensitive
        }
      }
    });

    if (existingPlaylist) {
      throw { type: 'ValidationError', message: 'A playlist with this name already exists' };
    }

    const newPlaylist = await prisma.playlist.create({
      data: {
        name: data.name,
        description: data.description
      },
      include: {
        playlistSongs: {
          include: {
            song: true
          }
        }
      }
    });
    return newPlaylist;
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
    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }

    // Se o nome está sendo alterado, verifica duplicidade
    if (data.name && data.name !== playlist.name) {
      const existingPlaylist = await prisma.playlist.findFirst({
        where: {
          name: {
            equals: data.name,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        }
      });

      if (existingPlaylist) {
        throw { type: 'ValidationError', message: 'A playlist with this name already exists' };
      }
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
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
  }

  async delete(id) {
    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }
    await prisma.playlist.delete({ where: { id } });
  }

  async addSongs(playlistId, songIds) {
    // Verifica se a playlist existe
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        playlistSongs: true
      }
    });

    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
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
      throw { type: 'ValidationError', message: 'One or more songs not found' };
    }

    // Verifica quais músicas já estão na playlist
    const existingSongs = playlist.playlistSongs.map(ps => ps.songId);
    const newSongIds = songIds.filter(id => !existingSongs.includes(id));

    if (newSongIds.length === 0) {
      throw { type: 'ValidationError', message: 'All songs are already in the playlist' };
    }

    // Encontra a última ordem na playlist
    const lastOrder = playlist.playlistSongs.reduce((max, ps) => 
      ps.order > max ? ps.order : max, 0);

    // Cria as novas relações playlist-música apenas para músicas que ainda não existem
    const createSongs = newSongIds.map((songId, index) => {
      return prisma.playlistSong.create({
        data: {
          playlistId,
          songId,
          order: lastOrder + index + 1
        }
      });
    });

    // Executa todas as operações em uma transação
    await prisma.$transaction(createSongs);

    // Retorna a playlist atualizada com as novas músicas
    return this.findOne(playlistId);
  }

  async removeSongs(playlistId, songIds) {
    // Verifica se a playlist existe
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        playlistSongs: true
      }
    });

    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }

    // Verifica se as músicas estão na playlist
    const playlistSongIds = playlist.playlistSongs
      .filter(ps => songIds.includes(ps.songId))
      .map(ps => ps.id);

    if (playlistSongIds.length !== songIds.length) {
      throw { type: 'ValidationError', message: 'One or more songs are not in the playlist' };
    }

    // Remove as músicas da playlist
    await prisma.playlistSong.deleteMany({
      where: {
        id: {
          in: playlistSongIds
        }
      }
    });

    // Reordena as músicas restantes
    const remainingPlaylistSongs = await prisma.playlistSong.findMany({
      where: {
        playlistId
      },
      orderBy: {
        order: 'asc'
      }
    });

    // Atualiza a ordem das músicas restantes
    const updateOrders = remainingPlaylistSongs.map((ps, index) => {
      return prisma.playlistSong.update({
        where: { id: ps.id },
        data: { order: index + 1 }
      });
    });

    await prisma.$transaction(updateOrders);

    // Retorna a playlist atualizada
    return this.findOne(playlistId);
  }
}

module.exports = new PlaylistService();
