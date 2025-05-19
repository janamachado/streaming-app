const { PrismaClient } = require('@prisma/client');
const { createPlaylistSchema, updatePlaylistSchema } = require('../schemas/playlist.schema');
const { playlistSongsSchema } = require('../schemas/playlist-songs.schema');
const deezerService = require('./deezer.service');
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

      // Verifica se as músicas já existem no banco
      const existingSongs = await prisma.song.findMany({
        where: {
          externalId: {
            in: songIds.map(id => `deezer:${id}`)
          }
        }
      });

      // Mapeia os IDs externos para os IDs internos das músicas existentes
      const existingSongMap = new Map(
        existingSongs.map(song => [song.externalId, song.id])
      );

      // Filtra os IDs que não existem no banco
      const newSongIds = songIds.filter(
        id => !existingSongMap.has(`deezer:${id}`)
      );

      // Se houver novas músicas, busca os dados no Deezer e cria no banco
      if (newSongIds.length > 0) {
        // Busca os dados das músicas na API do Deezer
        const deezerTracks = await deezerService.getTracksByIds(newSongIds);

        // Cria as músicas no banco com os dados do Deezer
        if (deezerTracks.length > 0) {
          await prisma.song.createMany({
            data: deezerTracks.map(track => ({
              externalId: track.externalId,
              title: track.title,
              artist: track.artist,
              album: track.album,
              duration: track.duration,
              url: track.url,
              cover: track.cover
            })),
            skipDuplicates: true
          });

          // Busca os IDs internos das músicas recém criadas
          const createdSongs = await prisma.song.findMany({
            where: {
              externalId: {
                in: deezerTracks.map(track => track.externalId)
              }
            }
          });

          // Adiciona as novas músicas ao mapa
          createdSongs.forEach(song => {
            existingSongMap.set(song.externalId, song.id);
          });
        }
      }

      // Cria as relações entre playlist e músicas
      await prisma.playlistSong.createMany({
        data: songIds.map(id => ({
          playlistId,
          songId: existingSongMap.get(`deezer:${id}`)
        })),
        skipDuplicates: true
      });

      // Atualiza o updatedAt da playlist e retorna ela atualizada
      return await prisma.playlist.update({
        where: { id: playlistId },
        data: {
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

      // Atualiza o updatedAt da playlist e retorna ela atualizada
      return await prisma.playlist.update({
        where: { id: playlistId },
        data: {
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
    } catch (error) {
      if (error.errors) {
        throw { type: 'ValidationError', message: error.errors[0].message };
      }
      throw error;
    }
  }
}

module.exports = new PlaylistService();
