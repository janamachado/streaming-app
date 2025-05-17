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
              description: 'The playlist name'
            },
            description: {
              type: 'string',
              description: 'The playlist description'
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
              description: 'The order of the song in the playlist'
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
            title: {
              type: 'string',
              description: 'The song title'
            },
            artist: {
              type: 'string',
              description: 'The song artist'
            },
            duration: {
              type: 'integer',
              description: 'The song duration in seconds'
            }
          }
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
