const { z } = require('zod');

const createPlaylistSchema = z.object({
  name: z
    .string({
      required_error: 'O nome da playlist é obrigatório',
      invalid_type_error: 'O nome da playlist deve ser uma string'
    })
    .min(1, 'O nome da playlist não pode estar vazio')
    .max(25, 'O nome da playlist não pode ter mais que 25 caracteres')
    .trim(),
  description: z
    .string({
      invalid_type_error: 'A descrição da playlist deve ser uma string'
    })
    .max(200, 'A descrição da playlist não pode ter mais que 200 caracteres')
    .trim()
    .nullable()
    .optional()
    .transform(val => (!val ? null : val))
});

const updatePlaylistSchema = createPlaylistSchema.partial();

module.exports = {
  createPlaylistSchema,
  updatePlaylistSchema
};
