require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Importando Multer
const path = require('path');

// Inicializa o app Express
const app = express();

// Configuração do Multer para salvar imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Gera um nome único para o arquivo
    },
});
const upload = multer({ storage: storage }); // Configurando Multer


// Servir o diretório de uploads como estático
app.use('/uploads', express.static('uploads'));

// Configuração do CORS
app.use(cors({
    origin: ['https://front-xi-sand.vercel.app', 'http://localhost:3000'], // Permite múltiplas origens
    credentials: true, // Permite enviar cookies com as requisições
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing de JSON
app.use(express.json());

app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err.stack);
    res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

// Conexão ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Importação das rotas
const booksRoutes = require('./routes/books')(upload); // Passando Multer para as rotas
app.use('/api/books', booksRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/admin/api/users', userRoutes); // Rotas CRUD de usuários

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
