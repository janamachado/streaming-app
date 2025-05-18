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
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: 354,
    },
    {
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      duration: 183,
    },
    {
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      album: 'Thriller',
      duration: 293,
    },
    {
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      album: 'Nevermind',
      duration: 301,
    },
    {
      title: 'Hey Jude',
      artist: 'The Beatles',
      album: 'Single',
      duration: 431,
    },
    {
      title: 'Like a Rolling Stone',
      artist: 'Bob Dylan',
      album: 'Highway 61 Revisited',
      duration: 369,
    },
    {
      title: 'No Woman, No Cry',
      artist: 'Bob Marley',
      album: 'Natty Dread',
      duration: 257,
    },
    {
      title: 'Purple Rain',
      artist: 'Prince',
      album: 'Purple Rain',
      duration: 511,
    },
    {
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: 390,
    },
    {
      title: 'Sweet Child O’ Mine',
      artist: 'Guns N’ Roses',
      album: 'Appetite for Destruction',
      duration: 356,
    },
  ];

  await Promise.all(
    songs.map((song) => prisma.song.create({ data: song }))
  );

  console.log('✅ 10 músicas inseridas com sucesso no banco de dados!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });