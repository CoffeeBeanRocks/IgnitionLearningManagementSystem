const Submission = require('../models/submission.model');

async function getSubmissionById(id){
    let submissions=await Submission.findById(id);
    return submissions;
}

async function getCourseSubmissions(assignmentID){
    let submissions=await Submission.find({assignmentID:assignmentID});
    var Ids=[];
    var SubmissionIDs=[];
    var i=0;
    for (const submission of submissions)
    {
        Ids[i]=submission._id;
        SubmissionIDs[i]=Ids[i].toString();
        i=i+1;
    }
    return SubmissionIDs;
}

module.exports={getSubmissionById,getCourseSubmissions}