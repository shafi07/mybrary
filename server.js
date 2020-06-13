const express = require("express");
const expressLayouts = require ("express-ejs-layouts")
const app = express();

const indexRouter = require('./routes/index')
const authorRouter = require("./routes/authors");
const bookRouter = require('./routes/books')
const bodyParser = require('body-parser');


const connectDB = require("./config/db");

app.set('view engine', 'ejs');
app.set('views',`${__dirname}/views`);
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit:'10MB',extended: false}))

//Mongodb Connection

// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/mybrary", { useNewUrlParser: true });
// const db = mongoose.connection
// db.on('error',error => console.log(error));
// db.once('success', ()=> coinsole.log(`mongodb connected successfully`))

connectDB()

app.use('/',indexRouter);
app.use('/authors',authorRouter);
app.use('/books',bookRouter);

app.listen(process.env.PORT || 3000)

