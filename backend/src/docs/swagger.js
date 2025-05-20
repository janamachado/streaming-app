const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Streaming App API',
      version: '1.0.0',
      description: 'API documentation for the Streaming App',
      contact: {
        name: 'API Support',
        email: 'support@streamingapp.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Playlist: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The playlist ID'
            },
            name: {
              type: 'string',
              description: 'The playlist name (max 25 characters)',
              maxLength: 25
            },
            description: {
              type: 'string',
              description: 'The playlist description (max 200 characters)',
              maxLength: 200,
              nullable: true
            },
            playlistSongs: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PlaylistSong'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['name']
        },
        PlaylistSong: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The playlist song ID'
            },
            playlistId: {
              type: 'integer',
              description: 'The playlist ID'
            },
            songId: {
              type: 'integer',
              description: 'The song ID'
            },
            order: {
              type: 'integer',
              description: 'Position of the song in the playlist (for ordering)',
              nullable: true
            },
            song: {
              $ref: '#/components/schemas/Song'
            }
          }
        },
        Song: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The song ID'
            },
            externalId: {
              type: 'string',
              description: 'The Deezer song ID'
            },
            title: {
              type: 'string',
              description: 'The song title'
            },
            artist: {
              type: 'string',
              description: 'The song artist',
              nullable: true
            },
            album: {
              type: 'string',
              description: 'The album name',
              nullable: true
            },
            duration: {
              type: 'integer',
              description: 'The song duration in seconds',
              nullable: true
            },
            url: {
              type: 'string',
              description: 'The song URL',
              nullable: true
            },
            cover: {
              type: 'string',
              description: 'The album cover URL',
              nullable: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['externalId', 'title']
        },
        Error: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'The error type'
            },
            message: {
              type: 'string',
              description: 'The error message'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/docs/*.swagger.js'
  ]
};

module.exports = swaggerJsdoc(options);
