<template>
  <div class="container">
    <div class="user">
      <p>Bem-vindo, {{ username }}! </p>
    </div>

    <div class="titulo-emp">
      <span>Editar livro</span>
    </div>

    <div class="teste">
      <div class="perfil-adicionar mt-3">
        <div class="dados mt-2">
          <div class="foto-botao">
            <div class="img-foto">
              <!-- Exibe a imagem de pré-visualização ou a imagem do livro existente -->
              <img v-if="imagePreview" :src="imagePreview" alt="Capa do livro" style="width: 300px;">
              <!-- Se não houver pré-visualização, exibe a imagem existente -->
              <img v-else :src="formatImagePath(book.image)" alt="Capa do livro" style="width: 300px;">
            </div>

            <form @submit.prevent="enviarFormulario">
              <div class="button-foto mt-3">
                <label for="fileInput" class="custom-file-upload" style="cursor: pointer;">
                  Alterar Capa
                </label>
                <input type="file" id="fileInput" style="display: none;" @change="handleFileUpload">
              </div>
            </form>
          </div>

          <form @submit.prevent="enviarFormulario">
            <div class="form-adicionar mt-3">
              <label for="floatingInput">Código ISBN:</label>
              <input type="text" class="form-control" v-model="book.code" />
              <p v-if="errors.code" class="text-danger">{{ errors.code }}</p>

              <label for="floatingInput">Título:</label>
              <input type="text" class="form-control" v-model="book.title" />
              <p v-if="errors.title" class="text-danger">{{ errors.title }}</p>

              <label for="floatingInput">Autor:</label>
              <input type="text" class="form-control" v-model="book.author" />
              <p v-if="errors.author" class="text-danger">{{ errors.author }}</p>

              <label for="floatingInput">Ano de publicação:</label>
              <input type="text" class="form-control" v-model="book.year" />
              <p v-if="errors.year" class="text-danger">{{ errors.year }}</p>

              <label for="floatingInput">Gênero:</label>
              <input type="text" class="form-control" v-model="book.gender" />
              <p v-if="errors.gender" class="text-danger">{{ errors.gender }}</p>

              <label for="floatingInput">Quantidade:</label>
              <input type="number" class="form-control" v-model="book.amount" />
              <p v-if="errors.amount" class="text-danger">{{ errors.amount }}</p>
            </div>
          </form>
        </div>
      </div>
    </div>

    <form @submit.prevent="enviarFormulario">
      <div class="caixa mt-5">
        <div class="form-descricao">
          <label for="floatingInput">Descrição:</label>
          <input type="text" class="form-control" id="floatingInput" style="height: 150px;" v-model="book.description" />
          <p v-if="errors.description" class="text-danger">{{ errors.description }}</p>

          <div class="button-perfil-user mt-5">
            <div class="button-excluir">
              <router-link to="/listalivro" class="button-link">
                <i class="bi bi-x-lg"></i>
                <span class="button-text">Cancelar</span>
              </router-link>
            </div>
            <div class="button-salvar">
              <!-- Alterei para um botão de submit para garantir que a ação do formulário seja executada -->
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
// Importa o módulo 'axios' para fazer requisições HTTP.
import axios from 'axios';
// Importa a store de autenticação para acessar o nome do usuário autenticado.
import { useAuthStore } from '../stores/authStore'; // Certifique-se de que o caminho da store está correto

export default {
  // Definindo o estado do componente, com as variáveis que serão usadas para armazenar os dados do livro e possíveis erros.
  data() {
    return {
      book: {
        // Informações sobre o livro que serão preenchidas no formulário
        code: '',         // Código ISBN
        title: '',        // Título do livro
        author: '',       // Autor do livro
        year: '',         // Ano de publicação
        gender: '',       // Gênero do livro
        amount: '',       // Quantidade disponível
        description: '',  // Descrição do livro
        image: null,      // Imagem (capa) do livro
        username: '',     // Nome de usuário do usuário autenticado
      },
      imagePreview: null, // Variável que armazena a URL temporária para pré-visualizar a imagem antes de enviar
      errors: {},        // Objeto para armazenar mensagens de erro de validação
    };
  },

  // O 'mounted' é um hook que é executado assim que o componente é inserido no DOM.
  mounted() {
    // Acessa a store de autenticação para pegar o nome de usuário
    const authStore = useAuthStore(); 
    this.username = authStore.username; // Armazena o nome do usuário no estado
    this.fetchBookData(); // Chama a função para carregar os dados do livro
  },

  methods: {
    // Função assíncrona para buscar os dados do livro do servidor
    async fetchBookData() {
      const bookId = this.$route.params.id; // Recupera o ID do livro da URL
      console.log('ID do livro:', bookId); // Para depuração

      try {
        // Faz uma requisição GET para buscar os dados do livro no servidor
        const response = await axios.get(`http://localhost:3000/api/books/${bookId}`);
        console.log('Dados do livro:', response.data); // Exibe os dados do livro para depuração

        if (response.data) {
          // Se a resposta contiver dados, preenche o estado 'book' com esses dados
          this.book = response.data;

          // Se o livro tiver uma imagem, cria a URL para a pré-visualização da imagem
          if (this.book.image) {
            this.imagePreview = this.formatImagePath(this.book.image);
          }
        } else {
          // Se o livro não for encontrado, exibe um alerta
          alert('Livro não encontrado.');
        }
      } catch (error) {
        // Se ocorrer um erro durante a requisição, exibe o erro no console e um alerta
        console.error('Erro ao buscar dados do livro:', error);
        alert('Erro ao carregar os dados do livro');
      }
    },

    // Função que formata o caminho da imagem, verificando se a URL é completa ou relativa
    formatImagePath(path) {
      if (path) {
        // Se o caminho já for uma URL completa (começar com 'http')
        if (path.startsWith('http')) {
          return path; // Retorna o caminho como está
        } else {
          // Caso contrário, cria uma URL absoluta para a imagem
          return `http://localhost:3000/${path.replace(/\\/g, '/')}`;
        }
      }
      return ''; // Retorna uma string vazia caso não haja imagem
    },

    // Função chamada quando o usuário seleciona um novo arquivo de imagem
    handleFileUpload(event) {
      const file = event.target.files[0]; // Obtém o arquivo selecionado
      if (file) {
        this.book.image = file; // Atribui o arquivo à propriedade 'image' do livro
        // Cria uma URL temporária para pré-visualizar a imagem antes do envio
        this.imagePreview = URL.createObjectURL(file);
      }
    },

    // Função para validar os campos do formulário
    validateForm() {
      this.errors = {}; // Limpa qualquer erro anterior
      let valid = true; // Flag para verificar se o formulário é válido

      // Validação de cada campo do livro, se o campo estiver vazio, adiciona uma mensagem de erro
      if (!this.book.code) {
        this.errors.code = 'Código ISBN é obrigatório.';
        valid = false;
      }
      if (!this.book.title) {
        this.errors.title = 'Título é obrigatório.';
        valid = false;
      }
      if (!this.book.author) {
        this.errors.author = 'Autor é obrigatório.';
        valid = false;
      }
      if (!this.book.year) {
        this.errors.year = 'Ano de publicação é obrigatório.';
        valid = false;
      }
      if (!this.book.gender) {
        this.errors.gender = 'Gênero é obrigatório.';
        valid = false;
      }
      if (!this.book.amount) {
        this.errors.amount = 'Quantidade é obrigatória.';
        valid = false;
      }
      if (!this.book.description) {
        this.errors.description = 'Descrição é obrigatória.';
        valid = false;
      }

      return valid; // Retorna se o formulário é válido ou não
    },

    // Função chamada quando o formulário é enviado
    async enviarFormulario() {
      // Verifica se o formulário é válido antes de enviar
      if (!this.validateForm()) {
        return; // Se não for válido, não envia
      }

      // Cria um FormData para enviar os dados do livro (incluindo a imagem, se houver)
      const formData = new FormData();
      formData.append('code', this.book.code);
      formData.append('title', this.book.title);
      formData.append('author', this.book.author);
      formData.append('year', this.book.year);
      formData.append('gender', this.book.gender);
      formData.append('amount', this.book.amount);
      formData.append('description', this.book.description);

      // Se houver uma imagem, adiciona ao FormData
      if (this.book.image) {
        formData.append('image', this.book.image);
      }

      try {
        // Envia os dados para o servidor (PUT) para atualizar o livro
        const response = await axios.put(`http://localhost:3000/api/books/${this.book._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Livro atualizado:', response.data); // Exibe os dados do livro atualizado
        alert('Livro atualizado com sucesso!'); // Exibe um alerta informando que o livro foi atualizado

        // Após o sucesso, redireciona para a página de listagem de livros
        this.$router.push('/listalivro');
      } catch (error) {
        // Se ocorrer um erro durante a requisição, exibe o erro no console e um alerta
        console.error('Erro ao atualizar livro:', error);
        alert('Erro ao atualizar o livro.');
      }
    },
  },
};
</script>

<style scoped>
.text-danger {
  color: red;
  font-size: 0.9em;
}
</style>
