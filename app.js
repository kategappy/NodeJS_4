const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const bookScheme = new Schema({name: String, author: String, year: Number}, {versionKey: false});
const Book = mongoose.model("Book", bookScheme);
 
app.use(express.static(__dirname + "/public"));
 
mongoose.connect("mongodb://localhost:27017/booksdb", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function(err){
    if(err) return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});
  
app.get("/api/books", function(req, res){
        
    Book.find({}, function(err, books){
 
        if(err) return console.log(err);
        res.send(books)
    });
});
 
app.get("/api/books/:id", function(req, res){
         
    const id = req.params.id;
    Book.findOne({_id: id}, function(err, book){
          
        if(err) return console.log(err);
        res.send(book);
    });
});
    
app.post("/api/books", jsonParser, function (req, res) {
        
    if(!req.body) return res.sendStatus(400);
        
    const bookName = req.body.name;
    const bookAuthor = req.body.author;
	const bookYear = req.body.year;
    const book = new Book({name: bookName, author: bookAuthor, year: bookYear});
        
    book.save(function(err){
        if(err) return console.log(err);
        res.send(book);
    });
});
     
app.delete("/api/books/:id", function(req, res){
         
    const id = req.params.id;
    Book.findByIdAndDelete(id, function(err, book){
                
        if(err) return console.log(err);
        res.send(book);
    });
});
    
app.put("/api/books", jsonParser, function(req, res){
         
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const bookName = req.body.name;
    const bookAuthor = req.body.author;
	const bookYear = req.body.year;
    const newBook = {name: bookName, author: bookAuthor, year: bookYear};
     
    Book.findOneAndUpdate({_id: id}, newBook, {new: true}, function(err, book){
        if(err) return console.log(err); 
        res.send(book);
    });
});
