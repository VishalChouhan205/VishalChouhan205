const mongoose = require('mongoose');

const analysisTaskSchema = new mongoose.Schema({
    taskId: { type: String, required: true },
    fileId: { type: String, required: true },
    operation: { type: String, required: true },
    options: { type: Object, default: {} },
    status: { type: String, default: 'pending' },
    result: { type: Object, default: null },
    createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model('AnalysisTask', analysisTaskSchema);
module.exports = File;
