const axios = require('axios');

class DeezerService {
  constructor() {
    this.baseUrl = 'https://api.deezer.com';
  }

  async searchTracks(query = '', limit = 100) {
    try {
      const response = await axios.get(`${this.baseUrl}/search/track`, {
        params: {
          q: query,
          limit: limit,
          output: 'json'
        }
      });

      // Mapeia os resultados para o formato que precisamos
      const tracks = response.data.data.map(track => ({
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: track.duration,
        url: track.preview || null,
        cover: track.album.cover_medium || track.album.cover || null,
        externalId: `deezer:${track.id}`,
        source: 'deezer'
      }));

      return tracks;
    } catch (error) {
      console.error('Erro ao buscar músicas do Deezer:', error.message);
      throw { type: 'ExternalAPIError', message: 'Erro ao buscar músicas do Deezer' };
    }
  }

  async getTopTracks(limit = 100) {
    try {
      // Vamos usar a chart de top tracks do Deezer
      const response = await axios.get(`${this.baseUrl}/chart/0/tracks`, {
        params: {
          limit: limit,
          output: 'json'
        }
      });

      // Mapeia os resultados para o formato que precisamos
      const tracks = response.data.data.map(track => ({
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: track.duration,
        url: track.preview || null,
        cover: track.album.cover_medium || track.album.cover || null,
        externalId: `deezer:${track.id}`,
        source: 'deezer'
      }));

      return tracks;
    } catch (error) {
      console.error('Erro ao buscar top músicas do Deezer:', error.message);
      throw { type: 'ExternalAPIError', message: 'Erro ao buscar top músicas do Deezer' };
    }
  }

  async getTracksByIds(ids) {
    try {
      // Busca cada música individualmente
      const promises = ids.map(id =>
        axios.get(`${this.baseUrl}/track/${id}`)
          .then(response => ({
            title: response.data.title,
            artist: response.data.artist.name,
            album: response.data.album.title,
            duration: response.data.duration,
            url: response.data.preview || null,
            cover: response.data.album.cover_medium || response.data.album.cover || null,
            externalId: `deezer:${response.data.id}`,
            source: 'deezer'
          }))
          .catch(error => {
            console.error(`Erro ao buscar música ${id} do Deezer:`, error.message);
            return null;
          })
      );

      const tracks = await Promise.all(promises);
      return tracks.filter(track => track !== null); // Remove músicas que não foram encontradas
    } catch (error) {
      console.error('Erro ao buscar músicas do Deezer:', error.message);
      throw { type: 'ExternalAPIError', message: 'Erro ao buscar músicas do Deezer' };
    }
  }
}

module.exports = new DeezerService();
