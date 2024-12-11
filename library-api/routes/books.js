const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');
const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Importa o modelo de Avaliações

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Garante um nome único para o arquivo
    }
});

// Instância do Multer configurado
const upload = multer({ storage: storage });

// Função exportada que configura as rotas
module.exports = (upload) => {
    // Rota para criar um novo livro (POST)
    router.post('/', upload.single('image'), async (req, res) => {
        try {
            console.log('Dados recebidos:', req.body);  // Log dos dados
            console.log('Arquivo da imagem:', req.file); // Log do arquivo

            const { code, title, author, year, gender, amount, description } = req.body;

            // Caminho da imagem (caso tenha sido enviada)
            const image = req.file ? req.file.path : '';

            const newBook = new Book({
                code, title, author, year, gender, amount, description, image
            });

            await newBook.save();
            res.status(201).json(newBook);
        } catch (error) {
            console.error('Erro ao criar livro:', error);  // Log do erro
            res.status(500).json({ message: 'Erro ao criar livro', error });
        }
    });

    // Outras rotas para buscar livros, atualizar, deletar etc.
    router.get('/', async (req, res) => {
        try {
            const books = await Book.find();
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar os livros', error });
        }
    });

    // Rota para buscar livro com avaliações
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id); // Buscar o livro
        const reviews = await Review.find({ bookId: req.params.id }); // Buscar as avaliações do livro

        if (!book) {
            return res.status(404).send('Livro não encontrado');
        }

        // Retornar o livro com as avaliações
        res.json({ ...book.toObject(), reviews });
    } catch (err) {
        res.status(500).send('Erro ao buscar o livro');
    }
});
    router.put('/:id', upload.single('image'), async (req, res) => {
        try {
            const { code, title, author, year, gender, amount, description } = req.body;
            let image = req.file ? req.file.path : undefined; // Se houver uma imagem, pega o caminho

            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({ message: 'Livro não encontrado' });
            }

            // Se o livro já tem uma imagem e uma nova foi enviada, deletamos a antiga
            if (book.image && image) {
                const oldImagePath = path.join(__dirname, '..', book.image); // Corrige o caminho da imagem
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Erro ao deletar a imagem antiga:', err);
                    }
                });
            }

            // Atualizar os dados do livro
            const updatedBook = await Book.findByIdAndUpdate(
                req.params.id,
                { code, title, author, year, gender, amount, description, image: image || book.image }, // Se não houver nova imagem, mantém a antiga
                { new: true }
            );

            res.status(200).json(updatedBook);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar livro', error });
        }
    });

    // Rota para deletar um livro pelo ID (DELETE)
    router.delete('/:id', async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({ message: 'Livro não encontrado' });
            }

            // Deletar a imagem associada ao livro, se existir
            if (book.image) {
                const filePath = path.join(__dirname, '..', book.image);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Erro ao deletar a imagem:', err);
                        return res.status(500).json({ message: 'Erro ao deletar a imagem do livro', error: err });
                    }
                });
            }

            // Deletar o livro do banco de dados
            await Book.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Livro deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar livro', error });
        }
    });

    // Endpoint para registrar a visualização de um livro
    router.post('/viewed/:id', async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({ message: "Livro não encontrado" });
            }
            // Incrementa a contagem de buscas
            book.searchCount += 1;
            await book.save();
        
            res.json(book); // Retorna o livro atualizado
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
  
    // Endpoint para retornar os livros mais buscados
    router.get('/most-searched', async (req, res) => {
        try {
            console.log('Buscando livros mais buscados...');
    
            const books = await Book.find().sort({ searchCount: -1 }).limit(10);
            console.log('Livros mais buscados:', books);
    
            res.json(books);
        } catch (err) {
            console.error('Erro ao buscar livros mais buscados:', err);
            res.status(500).json({ message: err.message });
        }
    });
    
  


// Rota para adicionar avaliações
router.post('/:id/reviews', async (req, res) => {
    try {
        const review = new Review({
            bookId: req.params.id,
            user: req.body.user,
            text: req.body.text,
            rating: req.body.rating
        });

        // Salvar a avaliação no banco
        await review.save();

        // Buscar as avaliações mais recentes
        const reviews = await Review.find({ bookId: req.params.id });

        // Retornar as avaliações mais recentes
        res.status(201).json(reviews);  // Retorne todas as avaliações, incluindo a recém-adicionada
    } catch (err) {
        res.status(500).send('Erro ao salvar avaliação.');
    }
});

    // Retorne o router configurado
    return router;
};
