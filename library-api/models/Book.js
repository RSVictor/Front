const mongoose = require('mongoose') // Variavel mongoose que irá armazenar
// a conexão futura com o mongo

// Define a estrutura para salvar o livro no banco de dados
const BookSchema = new mongoose.Schema({
    code: { type: Number },
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: String },
    gender: { type: String, required: true },
    amount: { type: Number },
    description: { type: String, required: true },
    image: { type: String },
    searchCount: { type: Number, default: 0 } // Contagem de visualizações
});
BookSchema.index({ code: 1 }, { unique: true });


module.exports = mongoose.model('Book', BookSchema);