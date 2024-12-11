<template>
  <div class="container">
    <!-- Exibe uma saudação com o nome do usuário -->
    <div class="user">
      <p>Bem-vindo, {{ username }}! </p>
    </div>

    <!-- Título da página -->
    <div class="titulo-emp">
      <span>Adicionar livro</span>
    </div>

    <div class="teste">
      <div class="perfil-adicionar mt-3">
        <div class="dados mt-2">
          <div class="foto-botao">
            <div class="img-foto">
              <!-- Se houver uma imagem, ela será exibida -->
              <img v-if="imagePreview" :src="imagePreview" alt="Capa do livro" style="width: 250px;">
            </div>

            <!-- Formulário para upload de imagem -->
            <form @submit.prevent="enviarFormulario">
              <div class="button-foto mt-3">
                <label for="fileInput" class="custom-file-upload" style="cursor: pointer;">
                  Adicionar Capa
                </label>
                <input type="file" id="fileInput" style="display: none;" @change="handleFileUpload">
              </div>
            </form>
          </div>

          <!-- Formulário de entrada de dados do livro -->
          <form @submit.prevent="enviarFormulario">
            <div class="form-adicionar mt-3">
              <!-- Campos de entrada do formulário -->
              <label for="floatingInput">Código ISBN:</label>
              <input type="text" class="form-control" v-model="code" placeholder="Digite o Código ISBN" required>
              <p v-if="errors.code" class="text-danger">{{ errors.code }}</p>

              <label for="floatingInput">Título:</label>
              <input type="text" class="form-control" v-model="title" placeholder="Digite o Título do Livro" required>
              <p v-if="errors.title" class="text-danger">{{ errors.title }}</p>

              <label for="floatingInput">Autor:</label>
              <input type="text" class="form-control" v-model="author" placeholder="Digite o Nome do Autor" required>
              <p v-if="errors.author" class="text-danger">{{ errors.author }}</p>

              <label for="floatingInput">Ano de publicação:</label>
              <input type="text" class="form-control" v-model="year" placeholder="Digite o Ano de Publicação" required>
              <p v-if="errors.year" class="text-danger">{{ errors.year }}</p>

              <label for="floatingInput">Gênero:</label>
              <input type="text" class="form-control" v-model="gender" placeholder="Digite o Gênero do Livro" required>
              <p v-if="errors.gender" class="text-danger">{{ errors.gender }}</p>

              <label for="floatingInput">Quantidade:</label>
              <input type="number" class="form-control" v-model="amount" placeholder="Digite a Quantidade de Exemplares" required>
              <p v-if="errors.amount" class="text-danger">{{ errors.amount }}</p>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Descrição do livro -->
    <form @submit.prevent="enviarFormulario">
      <div class="caixa mt-5">
        <div class="form-descricao">
          <span class="button-text">Descrição:</span>
          <input type="text" class="form-control" style="height: 130px;" v-model="description" placeholder="Digite a Descrição do Livro" required>
          <p v-if="errors.description" class="text-danger">{{ errors.description }}</p>

          <!-- Botões de cancelar e salvar -->
          <div class="button-perfil-user mt-5">
            <div class="button-excluir">
              <router-link to="/dashboard" class="button-link">
                <i class="bi bi-x-lg"></i>
                <span class="button-text">Cancelar</span>
              </router-link>
            </div>
            <div class="button-salvar">
              <button type="submit" class="button-salvar">
                <i class="bi bi-check2-square"></i>
                <span class="button-text">Salvar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

  
<script>
import axios from 'axios';
import { useAuthStore } from '../stores/authStore'; // Store de autenticação

export default {
  data() {
    return {
      // Dados do livro
      code: '',
      title: '',
      author: '',
      year: '',
      gender: '',
      amount: '',
      description: '',
      image: null,
      imagePreview: null,
      errors: {}, // Armazena as mensagens de erro
      username: '', // Armazena o nome de usuário
    };
  },

  mounted() {
    const authStore = useAuthStore(); // Acessa a store de autenticação
    this.username = authStore.username; // Armazena o nome do usuário

    // Opcional: você pode adicionar métodos para buscar livros, etc.
  },

  methods: {
    // Função para lidar com o upload da imagem
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.image = file;
        this.imagePreview = URL.createObjectURL(file); // Cria URL temporária para preview da imagem
      }
    },

    // Função de validação do formulário
    validateForm() {
      this.errors = {};  // Limpar erros anteriores
      let valid = true;

      // Verifica se os campos obrigatórios foram preenchidos
      if (!this.code) {
        this.errors.code = 'Código ISBN é obrigatório.';
        valid = false;
      }
      if (!this.title) {
        this.errors.title = 'Título é obrigatório.';
        valid = false;
      }
      if (!this.author) {
        this.errors.author = 'Autor é obrigatório.';
        valid = false;
      }
      if (!this.year) {
        this.errors.year = 'Ano de publicação é obrigatório.';
        valid = false;
      }
      if (!this.gender) {
        this.errors.gender = 'Gênero é obrigatório.';
        valid = false;
      }
      if (!this.amount) {
        this.errors.amount = 'Quantidade é obrigatória.';
        valid = false;
      }
      if (!this.description) {
        this.errors.description = 'Descrição é obrigatória.';
        valid = false;
      }

      return valid;
    },

    // Função para enviar o formulário
    async enviarFormulario() {
      // Se a validação falhar, não envia os dados
      if (!this.validateForm()) {
        return;
      }

      const formData = new FormData();
      formData.append('code', this.code);
      formData.append('title', this.title);
      formData.append('author', this.author);
      formData.append('year', this.year);
      formData.append('gender', this.gender);
      formData.append('amount', this.amount);
      formData.append('description', this.description);

      // Adiciona a imagem ao FormData, se houver
      if (this.image) {
        formData.append('image', this.image);
      }

      try {
        // Envia os dados do formulário para a API usando Axios
        const response = await axios.post('http://localhost:3000/api/books', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Caso o livro seja adicionado com sucesso
        console.log('Livro adicionado:', response.data);
        alert('Livro cadastrado com sucesso!');
        this.$router.push('/dashboard');
      } catch (error) {
        // Caso haja erro ao adicionar o livro
        console.error('Erro ao adicionar livro:', error.response ? error.response.data : error);
        alert('Erro ao cadastrar o livro: ' + (error.response ? error.response.data.message : 'Erro desconhecido.'));
      }
    }
  }
};
</script>

  
  <style scoped>
  .text-danger {
    color: red;
    font-size: 0.9em;
  }
  </style>