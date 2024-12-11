// arquivo principal da api
// inicia o servidor
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');
// inicialização do app

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./Routes/authRoutes')

app.use(cors ({
    origin: 'http://localhost:8080', //Permite requisições apenas do seu froontend
    methods: ['GET', 'POST'], //Adicione outros métodos se necessario
}));

// Conexão com o mongo db

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,useUnifiedTopology:true
}
   
    
    
).then(()=>console.log('Mongodb conectado')).catch(err=>console.error('Erro ao conectar no mongo',err));

const PORT = process.env.PORT || 5000; //Define a parte do servidor, usando variavel de ambiente ou padrão 5000

// Importação das rotas
const bookRoutes = require('./Routes/books');
app.use('/api/books',bookRoutes); // irá retornar a rota dos livros
app.use('/api/auth',authRoutes);
// Define a porta do servidor
app.listen(PORT,()=>{
    console.log(`Servidor rodando na porta ${PORT}`); //Inicia o servidor e exibe a mensagem no console
}); 