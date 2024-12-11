const mongoose = require('mongoose') // Variavel mongoose que irá armazenar
// a conexão futura com o mongo

// Define a estrutura para salvar as avaliações no banco de dados
const ReviewSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Relaciona com o ID do livro
    user: { type: String, required: true }, // Nome do usuário que fez a avaliação
    text: { type: String, required: true }, // Texto da avaliação
    rating: { type: Number, required: true, min: 1, max: 5 }, // Nota de 1 a 5
    createdAt: { type: Date, default: Date.now } // Data da avaliação
});

// Exporta o modelo para salvar as avaliações
module.exports = mongoose.model('Review', ReviewSchema);