const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Author = require("../models/author");
const Book = require("../models/book");
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
	dest: uploadPath,
	fileFilter: (req, file, callback) => {
		callback(null, imageMimeTypes.includes(file.mimetype));
	},
});

//All books route

router.get("/", async (req, res) => {
	res.send("new book");
});

// New books route

router.get("/new", async (req, res) => {
	try {
		const authors = await Author.find();
		const book = new Book();

		res.render("books/new", { authors: authors, book: book });
	} catch (error) {
		res.redirect("/books");
	}
});

// Create New book

router.post("/",upload.single('cover'), async (req, res) => {
    const { title, author, publishDate, pageCount, description } = req.body;
    const fileName = req.file != null ? req.file.filename : null 
	const book = new Book({
		title,
		author,
		publishDate: new Date(publishDate),
        pageCount,
        imageName : fileName,
		description,
    });
    try {
        const newBook = await book.save()
        res.redirect('books')
    } catch (error) {
        console.log(error)
        res.redirect('books/new')
    }
});

module.exports = router;
