export const updateFilm = {
  body: {
    type: 'object',
    required: ['title', 'quoteText', 'actor'],
    properties: {
      title: {
        type: 'string',
        description: 'film title'
      },
      quoteText: {
        type: 'string',
        description: 'quote text in English'
      },
      actor: {
        type: 'string',
        description: 'actor name'
      }
    }
  }
};