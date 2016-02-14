var mongoose = require('mongoose');

var BookSchema = mongoose.Schema({
	title: { type: String, required: 'Title is required' },
	author: { type: String, required: 'Author is required' }, // TODO: make ref
	year: { type: String, required: false }
});


module.exports = mongoose.model('Book', BookSchema);