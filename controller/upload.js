
const File = require('../models/File');
const fs = require('fs');
const AnalysisTask = require('../models/analysistask');

exports.uploads = async (req, res) => {
    try {
        if(req.file){
        const { filename } = req.file;
        const fileId = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    
        const fileRecord = new File({
            fileId,
            filename,
        });
        await fileRecord.save();  // To save file record in database
        res.json({ fileId });
        }else{
        res.send('please select a file')
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


/** fetch Uploaded File APIs */
exports.countWords = (text) => {
    const words = text.split(/\s+/);
    return { countWords : words.length };
} 

exports.countUniqueWords = (text) => {
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words);
    return {countUniqueWords : uniqueWords.size};
}

exports.findTopKWords = (text,k) => {
    const words = text.toLowerCase().match(/\b\w+\b/g);
    if (!words) {
        return []; // No words found in the text
    }

    const wordFrequency = words.reduce((freqMap, word) => {
        freqMap[word] = (freqMap[word] || 0) + 1;
        return freqMap;
    }, {});

    const wordFrequencyArray = Object.entries(wordFrequency).map(([word, count]) => ({ word, count }));
    const sortedWordFrequency = wordFrequencyArray.sort((a, b) => b.count - a.count);
    const topKWords = sortedWordFrequency.slice(0, k);
    return {topKWords : topKWords};
}

exports.performAnalysisTask = (operation,fileData,options) => {
    switch (operation) {
        case 'countWords':
        return this.countWords(fileData);
        case 'countUniqueWords':
        return this.countUniqueWords(fileData);
        case 'findTopKWords':
        return this.findTopKWords(fileData, options?.k || 5);
        default:
        return false;
    }
}

exports.generateTaskId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

exports.fetchUploadedFileByFileId = async (req, res) => {
    try{
        const fileId = req?.params?.fileId;
        const operation= req?.body?.operation;
        const options = req?.body?.options;
        const file = await File.findOne({ fileId }).lean().exec();
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        const taskId = this.generateTaskId();
        const analysisTask = new AnalysisTask({
          taskId,
          fileId,
          operation,
          options,
          status: 'pending',
        });
        await analysisTask.save();
        const filePath = `./uploads/${file.filename}`;
        const fileData = fs.readFileSync(filePath, 'utf-8');  /** file reader */
        const result = await this.performAnalysisTask(operation,fileData,options);

        if(result == false){
            res.status(500).json({error : 'Invalid Analysis Operations'})
        }else{
            await AnalysisTask.findByIdAndUpdate(analysisTask._id, { result, status: 'completed' });
            res.send({taskId});
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.fetchAnalysisTaskByTaskId = async (req,res) => {
    const taskId = req?.params?.taskId;
    const task = await AnalysisTask.findOne({ taskId }).lean().exec();
    res.send({ result : task.result})
}
