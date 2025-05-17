// Mock data store
let playlists = [
  {
    id: 1,
    name: 'Rock Classics',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: []
  },
  {
    id: 2,
    name: 'Jazz Favorites',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: []
  }
];

class PlaylistService {
  async create(data) {
    const newPlaylist = {
      id: playlists.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: []
    };
    playlists.push(newPlaylist);
    return newPlaylist;
  }

  async findAll() {
    return playlists;
  }

  async findOne(id) {
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }
    return playlist;
  }

  async update(id, data) {
    const index = playlists.findIndex(p => p.id === id);
    if (index === -1) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }
    playlists[index] = {
      ...playlists[index],
      ...data,
      updatedAt: new Date()
    };
    return playlists[index];
  }

  async delete(id) {
    const index = playlists.findIndex(p => p.id === id);
    if (index === -1) {
      throw { type: 'NotFoundError', message: 'Playlist not found' };
    }
    playlists.splice(index, 1);
  }
}

module.exports = new PlaylistService();
