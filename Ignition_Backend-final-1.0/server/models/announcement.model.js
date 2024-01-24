const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    courseID: {
        type: String,
        ref: 'Course',
        required: true
    },
    courseName:{
        type:String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message:{
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},{
    versionKey:false
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
