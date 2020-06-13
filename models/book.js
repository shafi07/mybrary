const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coverImageBasePath = 'uploads/booksCovers';

const bookSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	publishDate: {
		type: Date,
		required: true,
	},
	pageCount: {
		type: Number,
		required: true,
	},
	createdDate: {
		type: Date,
		required: true,
		default: Date.now,
	},
	imageName: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'Author'
	},
});

module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
