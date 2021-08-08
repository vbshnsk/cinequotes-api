export const getById = {
  params: {
    type: 'object',
    required: ['filmId', 'quoteId'],
    properties: {
      filmId: {type: 'string'},
      quoteId: {type: 'string'}
    }
  }
};

export const getAll = {
  params: {
    type: 'object',
    required: ['filmId'],
    properties: {
      filmId: {type: 'string'},
    }
  }
};