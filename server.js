'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

const PORT = process.env.PORT || 3000;
const server = express();

server.set('view engine','ejs');
server.use(express.urlencoded({extended:true}));
server.use(express.static(__dirname + '/public'));

server.get('/', (req, res) => {
  res.render('pages/index');
});

server.get('/hello',(req,res)=>{
  res.render('pages/index');
});

server.get('/searches/new', (req,res)=>{
  res.render('pages/searches/new');
});
server.post('/searches', searchHandler);

function searchHandler(req,res){
  let searchValue = req.body.search;
  let term = req.body.searchBy;
  let googleBookURL = `https://www.googleapis.com/books/v1/volumes?q=search+${term}:${searchValue}`;
  superagent.get(googleBookURL)
    .then((booksData)=>{
      let bookslist = booksData.body.items.map((Element)=> new BooksData(Element));
      res.render('pages/searches/show', {bookslistArr: bookslist });
    }).catch (error=>{
      console.log(error);
      res.send(error);
    });

}

function BooksData(data){
  this.title = data.volumeInfo.title;
  this.authors = data.volumeInfo.authors;
  if(data.volumeInfo.description ) {
    this.description = data.volumeInfo.description;}else{
    this.description = 'The description is not available';}
  if (data.volumeInfo.imageLinks.thumbnail){
    this.image = data.volumeInfo.imageLinks.thumbnail;}else{
    this.image = `https://i.imgur.com/J5LVHEL.jpg`;}

}

server.listen(PORT,()=>{
  console.log(`Listening on PORT ${PORT}`);
});
