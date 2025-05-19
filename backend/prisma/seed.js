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
      url: 'https://i.scdn.co/image/ab67616d0000b273e319baafd16e84f0408af2a0'
    },
    {
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      duration: 183,
      url: 'https://i.scdn.co/image/ab67616d0000b2732d87659c5dd03a23d3d8c3c5'
    },
    {
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      album: 'Thriller',
      duration: 293,
      url: 'https://i.scdn.co/image/ab67616d0000b2734121faee8df82c526cbab2be'
    },
    {
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      album: 'Nevermind',
      duration: 301,
      url: 'https://i.scdn.co/image/ab67616d0000b273e175a19e530c898d167d39bf'
    },
    {
      title: 'Hey Jude',
      artist: 'The Beatles',
      album: 'Single',
      duration: 431,
      url: 'https://i.scdn.co/image/ab67616d0000b2736e3d3c964df32136fb1cd594'
    },
    {
      title: 'Like a Rolling Stone',
      artist: 'Bob Dylan',
      album: 'Highway 61 Revisited',
      duration: 369,
      url: 'https://i.scdn.co/image/ab67616d0000b273c51563a479fa5a4917311197'
    },
    {
      title: 'No Woman, No Cry',
      artist: 'Bob Marley',
      album: 'Natty Dread',
      duration: 257,
      url: 'https://i.scdn.co/image/ab67616d0000b273d752956b8a82ffa07baa835a'
    },
    {
      title: 'Purple Rain',
      artist: 'Prince',
      album: 'Purple Rain',
      duration: 511,
      url: 'https://i.scdn.co/image/ab67616d0000b273d52bfb90ee8dfeda8378b99b'
    },
    {
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: 390,
      url: 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg'
    },
    {
      title: 'Sweet Child O’ Mine',
      artist: 'Guns N’ Roses',
      album: 'Appetite for Destruction',
      duration: 356,
      url: 'https://upload.wikimedia.org/wikipedia/en/6/60/GunsnRosesAppetiteforDestructionalbumcover.jpg'
    },
    {
      title: 'Construção',
      artist: 'Chico Buarque',
      album: 'Construção',
      duration: 261,
      url: 'https://i.scdn.co/image/ab67616d0000b273e33f902a9c5b8ca68635c38d'
    },
    {
      title: 'Águas de Março',
      artist: 'Elis Regina & Tom Jobim',
      album: 'Elis & Tom',
      duration: 197,
      url: 'https://cdn-images.dzcdn.net/images/cover/d59a1fe333385d5df279393d3075858b/500x500-000000-80-0-0.jpg'
    },
    {
      title: 'Panis et Circenses',
      artist: 'Os Mutantes',
      album: 'Tropicália ou Panis et Circencis',
      duration: 206,
      url: 'https://i.scdn.co/image/ab67616d0000b273c7d249b2e670e0a79e2c2725'
    },
    {
      title: 'Preta Pretinha',
      artist: 'Novos Baianos',
      album: 'Acabou Chorare',
      duration: 392,
      url: 'https://i.scdn.co/image/ab67616d0000b273d9c7bc8c7c25d22c2f41e805'
    },
    {
      title: 'Sangue Latino',
      artist: 'Secos & Molhados',
      album: 'Secos & Molhados',
      duration: 207,
      url: 'https://i.scdn.co/image/ab67616d0000b273f665934f5810f4b46a93f8c0'
    },
    {
      title: 'Festa',
      artist: 'Ivete Sangalo',
      album: 'Festa',
      duration: 240,
      url: 'https://i.scdn.co/image/ab67616d0000b273c3d0f28f3b4b11b1c6f8c0c7'
    },
    {
      title: 'Frevo Mulher',
      artist: 'Amelinha',
      album: 'Frevo Mulher',
      duration: 210,
      url: 'https://i.scdn.co/image/ab67616d0000b273b3d82947c18f351b32b75b78'
    },
    {
      title: 'Maria Fumaça',
      artist: 'Banda Black Rio',
      album: 'Maria Fumaça',
      duration: 215,
      url: 'https://i.scdn.co/image/ab67616d0000b273c7f2cc6cd0ce11f2d73e52cd'
    },
    {
      title: 'Coisa nº 5',
      artist: 'Moacir Santos',
      album: 'Coisas',
      duration: 180,
      url: 'https://i.scdn.co/image/ab67616d0000b2735c2d2f43471655dafb431de5'
    },
    {
      title: 'O Leãozinho',
      artist: 'Caetano Veloso',
      album: 'Bicho',
      duration: 180,
      url: 'https://i.scdn.co/image/ab67616d0000b273c6e0948c4428f9990be8647d'
    },
    {
      title: 'Aquarela do Brasil',
      artist: 'Ary Barroso',
      album: 'Aquarela do Brasil',
      duration: 180,
      url: 'https://cdn-images.dzcdn.net/images/cover/82563f153c05010e23368e5c560c1e84/500x500-000000-80-0-0.jpg'
    },
    {
      title: 'Chega de Saudade',
      artist: 'João Gilberto',
      album: 'Chega de Saudade',
      duration: 220,
      url: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69'
    },
    {
      title: 'Asa Branca',
      artist: 'Luiz Gonzaga',
      album: 'Asa Branca',
      duration: 200,
      url: 'https://cdn-images.dzcdn.net/images/cover/c51563a479fa5a4917311197/500x500-000000-80-0-0.jpg'
    },
    {
      title: 'Detalhes',
      artist: 'Roberto Carlos',
      album: 'Roberto Carlos',
      duration: 240,
      url: 'https://i.scdn.co/image/ab67616d0000b273c7d35853b6c42019d7a0d101'
    },
    {
      title: 'O Mundo é um Moinho',
      artist: 'Cartola',
      album: 'Cartola',
      duration: 210,
      url: 'https://i.scdn.co/image/ab67616d0000b273d9a129c4a656a55dfcd774ad'
    },
    {
      title: 'Ponteio',
      artist: 'Edu Lobo',
      album: 'Edu Lobo',
      duration: 230,
      url: 'https://i.scdn.co/image/ab67616d0000b273b8d55ec0c5fcd249c2d6d705'
    },
    {
      title: 'Eu Sei que Vou te Amar',
      artist: 'Vinícius de Moraes & Tom Jobim',
      album: 'Canção do Amor Demais',
      duration: 250,
      url: 'https://i.scdn.co/image/ab67616d0000b2736e4f9b8de8d4680372742756'
    },
    {
      title: 'Tocando em Frente',
      artist: 'Almir Sater',
      album: 'Almir Sater',
      duration: 260,
      url: 'https://i.scdn.co/image/ab67616d0000b273b1c4d74bef7159c9c3f96300'
    },
    {
      title: 'Cálice',
      artist: 'Chico Buarque & Gilberto Gil',
      album: 'Chico Buarque',
      duration: 270,
      url: 'https://cdn-images.dzcdn.net/images/cover/e33f902a9c5b8ca68635c38d/500x500-000000-80-0-0.jpg'
    },
    {
      title: 'Romaria',
      artist: 'Renato Teixeira',
      album: 'Romaria',
      duration: 230,
      url: 'https://i.scdn.co/image/ab67616d0000b273a0d9e6f2c3ea5a5611ddd7c6'
    },
    {
      title: 'Dancing Queen',
      artist: 'ABBA',
      album: 'Arrival',
      duration: 230,
      url: 'https://i.scdn.co/image/ab67616d0000b273f426963752d4047786559477'
    },
    {
      title: 'Stayin’ Alive',
      artist: 'Bee Gees',
      album: 'Saturday Night Fever',
      duration: 285,
      url: 'https://i.scdn.co/image/ab67616d0000b2733427f71d49ab4c73da9d4b5f'
    },
    {
      title: 'September',
      artist: 'Earth, Wind & Fire',
      album: 'The Best of Earth, Wind & Fire, Vol. 1',
      duration: 215,
      url: 'https://i.scdn.co/image/ab67616d0000b273e13de7b8662b085b0885ffef'
    },
    {
      title: 'Superstition',
      artist: 'Stevie Wonder',
      album: 'Talking Book',
      duration: 254,
      url: 'https://i.scdn.co/image/ab67616d0000b273ac62a01f654c4dd31b25dea7'
    },
    {
      title: 'What a Wonderful World',
      artist: 'Louis Armstrong',
      album: 'What a Wonderful World',
      duration: 140,
      url: 'https://i.scdn.co/image/ab67616d0000b273c8d3d30f4e0b4306b0a0349d'
    },
    {
      title: 'I Will Always Love You',
      artist: 'Whitney Houston',
      album: 'The Bodyguard: Original Soundtrack Album',
      duration: 273,
      url: 'https://i.scdn.co/image/ab67616d0000b273e40d5ed88b8a08e9c9461caa'
    },
    {
      title: 'Every Breath You Take',
      artist: 'The Police',
      album: 'Synchronicity',
      duration: 257,
      url: 'https://i.scdn.co/image/ab67616d0000b273e40d5ed88b8a08e9c9461caa'
    },
    {
      title: 'Let It Be',
      artist: 'The Beatles',
      album: 'Let It Be',
      duration: 243,
      url: 'https://i.scdn.co/image/ab67616d0000b273c6e0948c4428f9990be8647d'
    },
    {
      title: 'Wonderwall',
      artist: 'Oasis',
      album: "(What's the Story) Morning Glory?",
      duration: 258,
      url: 'https://i.scdn.co/image/ab67616d0000b273b36949bee43217351961ffbc'
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