const { z } = require('zod');

const playlistSongsSchema = z.object({
  songIds: z
    .array(
      z.number({
        required_error: 'ID da música é obrigatório',
        invalid_type_error: 'ID da música deve ser um número'
      }).int('ID da música deve ser um número inteiro')
    )
    .min(1, 'É necessário fornecer pelo menos uma música')
    .transform(ids => [...new Set(ids)]) // Remove duplicatas
});

module.exports = {
  playlistSongsSchema
};
