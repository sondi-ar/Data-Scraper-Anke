//storing dependencies into a variable
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

//storing port number and our full app
var port = 3000;
var app = express();

//Step1: setting up the bopilerplate and routing
app.get('/Wikipedia', function(req, res){

//storing URL
  var url = 'https://en.wikipedia.org/wiki/Rhizome_(philosophy)';

//making HTTP request
  request(url, function(error, response, html) {
    if(!error) {
      //res.send(html);
      var $ = cheerio.load(html);
      var data = {
        articleTitle: '',
        articleImg: '',
        articleParagraph:''
      };

      $('#content').filter(function(){
        data.articleTitle = $(this).find('#firstHeading').text();
        data.articleImg = $(this).find('img').first().attr('src');
        data.articleParagraph = $(this).find('p').first().text();
        //data.articleParagraph = $(this).find('p:nth-of-type(2)').text();

      })

      res.send(data);

      fs.writeFile('wiki-output.js',JSON.stringify(data, null, 4),function(){
        console.log('File written on hard drive!');
      })

    }
});
  //All the web scraping magic will happen here
  //res.send('Hello World');

});

app.get('/imdb', function(req, res){

//storing URL
  var url = 'https://www.imdb.com/chart/top';

//making HTTP request
  request(url, function(error, response, html) {
    if(!error) {
      //res.send(html);
      var $ = cheerio.load(html);
      var data = [];

      $('.lister-list').filter(function(){
      $(this).find('tr').each(function(i, elem){
      data[i] ="'" + $(this).find('.posterColumn').find('img').attr('src') + "'";
    });

  });

      res.send(data);

      fs.writeFile('imdb-output.js','var imdb_list =['+ data +']', function(){
        console.log('File written on hard drive!');
      });

    }
});
  //All the web scraping magic will happen here
  //res.send('Hello World');

});

app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app;
