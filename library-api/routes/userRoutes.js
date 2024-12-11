const express = require('express');
const router = express.Router();
const user = require('./models/user');  // Modelo de usuário
const bcrypt = require('bcryptjs');  // Biblioteca para criptografia de senha

// Rota para obter todos os usuários
router.get('/', async (req, res) => {
    try {
        const users = await User.find();  // Busca todos os usuários
        res.json(users);  // Retorna os usuários como JSON
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
});

// Rota para obter um usuário específico pelo ID
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);  // Busca o usuário pelo ID
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);  // Retorna o usuário como JSON
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
});

// Rota para adicionar um novo usuário (POST)
router.post('/', async (req, res) => {
    const { username, email, password, status = 'Ativo', permissions = 'Usuario' } = req.body;

    try {
        // Verifica se o e-mail já está em uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já registrado!' });
        }

        // Criptografar a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria um novo usuário com os dados fornecidos
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            permissions,
            status
        });

        // Salva o novo usuário no banco de dados
        await newUser.save();

        // Retorna o usuário criado
        res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
    } catch (error) {
        console.error('Erro ao criar o usuário:', error);
        res.status(500).json({ message: 'Erro ao criar o usuário' });
    }
});

// Rota para atualizar os dados de um usuário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password, status, permissions } = req.body;

    try {
        // Encontra o usuário pelo ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Criptografa a nova senha, caso tenha sido fornecida
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;  // Atualiza a senha
        }

        // Atualiza os outros campos do usuário
        user.username = username || user.username;
        user.email = email || user.email;
        user.status = status || user.status;
        user.permissions = permissions || user.permissions;

        // Salva as alterações no banco de dados
        await user.save();

        // Retorna o usuário atualizado
        res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
    } catch (error) {
        console.error('Erro ao atualizar o usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar o usuário' });
    }
});

// Rota para bloquear (inativar) um usuário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, { status: 'Inativo' }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário bloqueado', user });
    } catch (error) {
        console.error('Erro ao bloquear usuário:', error);
        res.status(500).json({ message: 'Erro ao bloquear usuário' });
    }
});

// Rota para excluir um usuário
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir o usuário:', error);
        res.status(500).json({ message: 'Erro ao excluir o usuário' });
    }
});

module.exports = router;
