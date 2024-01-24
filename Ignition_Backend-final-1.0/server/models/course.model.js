const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode:{
        type:String,
        required:true
    },
    courseId:{
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    instructorEmail: {
        type: String,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Unapproved', 'Approved', 'Rejected'],
        default: 'Unapproved'
    }
},{
    versionKey:false
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

