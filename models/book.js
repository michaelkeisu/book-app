var mongoose = require('mongoose');

var BookSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true }, // TODO: make ref
	year: { type: Number, required: false }
});


module.exports = mongoose.model('Book', BookSchema);