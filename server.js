var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var app = express();

var db = require("./models");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
    axios.get("https://vox.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        var results = [];

        $("h2").children().attr("data-analytics-link", "article").each(function (i, element) {

            // var everything = $(element).children().text();

            var result = {};

            result.title = $(element).text();

            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                    results.push(result);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });

        });
        res.json(results);
    });
})

app.listen(process.env.PORT || 3000, function () {
    console.log("App running on port 3000!");
});