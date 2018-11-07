var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    url:{
        type: String,
        required: true
    },

    author:{
        type: String,
        required: true
    },
    
    comments:{
        type: Array
    }
})

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;