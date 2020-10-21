const { Schema, model } = require('mongoose');

const movieSchema = new Schema({
	name: String,
	genre: String,
	directorId: {
		type: Schema.Types.ObjectId,
		ref: 'Director'
	},
});

module.exports = model('Movie', movieSchema);