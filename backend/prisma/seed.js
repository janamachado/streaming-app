const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Verifica se já existem músicas no banco
  const existingSongs = await prisma.song.count();
  
  if (existingSongs > 0) {
    console.log('ℹ️ O banco já contém dados. Pulando o seed...');
    return;
  }

  console.log('🎵 Iniciando seed de músicas...');
  const songs = [
    {
      id: 1,
      externalId: 'deezer:1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: 354,
      cover: 'https://cdn-images.dzcdn.net/images/cover/6706f1154083f461a348508c28030a30/250x250-000000-80-0-0.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      externalId: 'deezer:2',
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      duration: 183,
      cover: 'https://cdn-images.dzcdn.net/images/cover/2675a9277dfabb74c32b7a3b2c9b0170/250x250-000000-80-0-0.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      externalId: 'deezer:3',
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      album: 'Thriller',
      duration: 294,
      cover: 'https://cdn-images.dzcdn.net/images/cover/a0ad67d1beb761f2cb9f8b60e5bcf07a/250x250-000000-80-0-0.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      externalId: 'deezer:4',
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      album: 'Nevermind',
      duration: 301,
      cover: 'https://i.scdn.co/image/ab67616d0000b273e175a19e530c898d167d39bf',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      externalId: 'deezer:5',
      title: 'Hey Jude',
      artist: 'The Beatles',
      album: 'Single',
      duration: 431,
      cover: 'https://i.scdn.co/image/ab67616d0000b2736e3d3c964df32136fb1cd594',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      externalId: 'deezer:6',
      title: 'Like a Rolling Stone',
      artist: 'Bob Dylan',
      album: 'Highway 61 Revisited',
      duration: 373,
      cover: 'https://i.scdn.co/image/ab67616d0000b273c51563a479fa5a4917311197',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 7,
      externalId: 'deezer:7',
      title: 'No Woman, No Cry',
      artist: 'Bob Marley',
      album: 'Natty Dread',
      duration: 427,
      cover: 'https://cdn-images.dzcdn.net/images/cover/c43e3b1d83e0107dfff7e4238096fe5b/250x250-000000-80-0-0.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 8,
      externalId: 'deezer:8',
      title: 'Purple Rain',
      artist: 'Prince',
      album: 'Purple Rain',
      duration: 520,
      cover: 'https://i.scdn.co/image/ab67616d0000b273d52bfb90ee8dfeda8378b99b',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 9,
      externalId: 'deezer:9',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: 391,
      cover: 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 10,
      externalId: 'deezer:10',
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: 'Appetite for Destruction',
      duration: 356,
      cover: 'https://upload.wikimedia.org/wikipedia/en/6/60/GunsnRosesAppetiteforDestructionalbumcover.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  

  await Promise.all(
    songs.map((song) => prisma.song.create({ data: song }))
  );

  console.log('✅ Músicas inseridas com sucesso no banco de dados!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });