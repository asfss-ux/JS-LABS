const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
    title: String,

});


const userSCHEMA = new mongoose.Schema({
    name: String,
    lastname: String,
    title: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Title'
    }]
});


const Author = mongoose.model('Author', userSCHEMA);
const Title = mongoose.model('Title', titleSchema);

module.exports = {Author, Title};