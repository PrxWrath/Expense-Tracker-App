const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    url:{
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    updatedAt: Date

})

module.exports = mongoose.model('File', fileSchema);