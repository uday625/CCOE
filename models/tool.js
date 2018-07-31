var mongoose = require("mongoose");

var toolSchema = new mongoose.Schema({
    tooName: String,
    image: String,
    frameworkORtool: String,
    account: String,
    toolInfo: String,
    module: String,
    poc: String,
    dateCreated: Date,
    lastVersionUpdated: Date,
    wnership: String
});

module.exports = mongoose.model("Tool", toolSchema);