const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs')

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
    let query = Book.find()
    if (req.query.title != null && req.query.title != "") {
		query = query.regex("title", new RegExp(req.query.title, "i"));
	}
	if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
		query = query.lte('publishDate', req.query.publishedBefore)
	}
	if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
		query = query.gte("publishDate", req.query.publishedAfter);
	}
try {
    const books = await query.exec()
    res.render('books/index', {
        books : books,
        searchOptions :req.query
    })
} catch (error) {
    
}
    
});

// New books route

router.get("/new", async (req, res) => {
	renderNewPage(res, new Book());
});

// Create New book

router.post("/", upload.single("cover"), async (req, res) => {
	const { title, author, publishDate, pageCount, description } = req.body;
	const fileName = req.file != null ? req.file.filename : null;
	const book = new Book({
		title,
		author,
		publishDate: new Date(publishDate),
		pageCount,
		coverImageName: fileName,
		description,
	});
	try {
		const newBook = await book.save();
		res.redirect("books");
	} catch (error) {
        if (book.coverImageName != null) {
			removeBookCover(book.coverImageName);
		}
		renderNewPage(res, book, true);
	}
});

//Remove book cover image

const removeBookCover = (fileName)=>{
    fs.unlink(path.join(uploadPath,fileName), err =>{
        console.error(err);
    })
}

// Render new page function
const renderNewPage = async (res, book, hasError = false) => {
	try {
		const authors = await Author.find();
		const params = {
			authors: authors,
			book: book,
		};

		if (hasError) params.errorMessage = "Error Creating Book";

		res.render("books/new", params);
	} catch (error) {
		res.redirect("/books");
	}
};

module.exports = router;
