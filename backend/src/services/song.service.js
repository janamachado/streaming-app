// Mock data store
let songs = [
  {
    id: 1,
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    duration: 482, // 8:02
    createdAt: new Date(),
    updatedAt: new Date(),
    playlistId: 1
  },
  {
    id: 2,
    title: 'Take Five',
    artist: 'Dave Brubeck',
    duration: 324, // 5:24
    createdAt: new Date(),
    updatedAt: new Date(),
    playlistId: 2
  }
];

class SongService {
  validateSong(data) {
    const requiredFields = ['title', 'artist', 'duration', 'playlistId'];
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
    
    const newSong = {
      id: songs.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    songs.push(newSong);
    return newSong;
  }

  async findAll() {
    return songs;
  }

  async findOne(id) {
    const song = songs.find(i => i.id === id);
    if (!song) {
      throw { type: 'NotFoundError', message: 'Song not found' };
    }
    return song;
  }

  async update(id, data) {
    const index = songs.findIndex(i => i.id === id);
    if (index === -1) {
      throw { type: 'NotFoundError', message: 'Song not found' };
    }

    const updatedData = {
      ...songs[index],
      ...data
    };

    // Validar os dados atualizados
    this.validateSong(updatedData);

    songs[index] = {
      ...updatedData,
      updatedAt: new Date()
    };

    return songs[index];
  }

  async delete(id) {
    const index = songs.findIndex(i => i.id === id);
    if (index === -1) {
      throw { type: 'NotFoundError', message: 'Song not found' };
    }
    songs.splice(index, 1);
  }
}

module.exports = new SongService();
