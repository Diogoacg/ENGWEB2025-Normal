const mongoose = require('mongoose');
const edicaoSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model('Edicao', edicaoSchema, 'edicoes');