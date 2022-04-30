const { Schema } = require('mongoose');


const gameSchema = new Schema({
  creator: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },

  gameId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = gameSchema;
