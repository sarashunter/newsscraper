var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Serve public folder staticly
app.use(express.static("public"));

//Import models
var db = require("./models");

//Use Morgan for logging
var logger = require("morgan");
app.use(logger("dev"));

//Connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Use Handlebars for rendering
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Routes

//Route to scrape vox.com for Articles
app.get("/scrape", function (req, res) {
    axios.get("https://vox.com/").then(function (response) {

        //Use cheerio to parse vox.com results
        var $ = cheerio.load(response.data);
        var results = [];

        $("h2").children().attr("data-analytics-link", "article").each(function (i, element) {

            var result = {};

            result.title = $(element).text();
            result.url = $(element).attr("href");
            result.author = $(element).parent().parent().children(".c-byline").children().first().text().trim();

            //Add article to db.
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
        res.json("Scrape Successful!");
    });
})

//API Route to see the articles in the mongoDB
app.get("/scraped", function (req, res) {

    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err)
    })
})

//HTML Route that renders all articles
app.get("/", function (req, res) {

    db.Article.find(function (err, articles) {
        res.render("index", { articles: articles })
    })
})

//API Route to get information for one article based on id
app.get("/scraped/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id }).populate("comments").then(function (article) {
        res.render("articleView", { article: article });
    }).catch(function (err) {
        res.json(err);
    });

})

//API Route to submit comment
app.post("/submit", function (req, res) {

    const articleID = req.body.id;

    db.Comment.create({ body: req.body.commentText, exists: true }).then(function (dbComment) {
        return db.Article.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(articleID)
        }, {
                $push: {
                    comments: dbComment._id, exists: true
                }
            }, {
                new: true
            });
    }).then(function (dbArticle) {
        // If comment is saved, send it back
        res.json(dbArticle);
    })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//API route to delete a comment by marking it as "deleted" so it doesn't render.
app.post("/delete", function (req, res) {
    console.log(req.body.id + " " + req.body.commentId);
    db.Comment.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.body.commentId)
    }, {
            exists: false
        }, function (error) {

            if (error) {
                console.log(error);
            }
        });

})

app.listen(process.env.PORT || 3000, function () {
    console.log("App running on port 3000!");
});