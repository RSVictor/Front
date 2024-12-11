<template>
  <!-- Container principal da página -->
  <div class="container">
    
    <!-- Exibe o nome do usuário logado -->
    <div class="user">
      <p>Bem-vindo, {{ username }}! </p> <!-- Exibe o nome do usuário -->
    </div>

    <!-- Seção com os botões de navegação para o administrador -->
    <div class="titulo-adm-button">
      <div class="button-adm">
        <!-- Link para o Dashboard -->
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </div>
      <div class="button-adm">
        <!-- Link para a lista de usuários -->
        <RouterLink to="/listaUser">Usuários</RouterLink>
      </div>
      <div class="button-adm">
        <!-- Link para adicionar novos livros -->
        <RouterLink to="/adicionarLivro">Adicionar Livros</RouterLink>
      </div>

      <!-- Caixa de pesquisa para filtrar livros -->
      <div class="input-adm">
        <input 
          type="text" 
          name="" 
          id="" 
          placeholder="Pesquisar livros" 
          v-model="searchQuery" 
        />
        <button><i class="bi bi-search"></i></button>
      </div>
    </div>

    <!-- Título das colunas da lista de livros -->
    <div class="titulo-adm mt-5">
      <div class="text-emp">Id</div>
      <div class="text-emp">Título</div>
      <div class="text-emp">Autor</div>
      <div class="text-emp">Gênero</div>
      <div class="text-emp">Quantidade</div>
      <div class="text-emp">Opções</div>
    </div>

    <!-- Exibe cada livro filtrado -->
    <div v-for="book in filteredBooks" :key="book._id" class="lista-adm mt-2">
      <div class="text-lista">
        <!-- Exibe o ID curto e o ID completo no atributo title para mostrar ao passar o mouse -->
        <span class="id-compacto" :title="book._id.toString()">
          {{ book._id.toString().slice(0, 6) }}...{{ book._id.toString().slice(-6) }}
        </span>
      </div>
      <div class="text-lista">{{ book.title }}</div>
      <div class="text-lista">{{ book.author }}</div>
      <div class="text-lista">{{ book.gender }}</div>
      <div class="text-lista">{{ book.amount }}</div>
      <div class="text-lista">
        <!-- Botões para editar e excluir livros -->
        <div class="button-perfil">
          <div class="button-editar-adm">
            <RouterLink :to="`/editarLivro/${book._id}`" class="button-link">
              <i class="bi bi-pencil-square"></i> <!-- Ícone de edição -->
            </RouterLink>
          </div>
          <div class="button-excluir-adm">
            <RouterLink to="/listalivro" class="button-link" @click="deleteBook(book._id)">
              <i class="bi bi-trash"></i> <!-- Ícone de exclusão -->
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Navegação de páginas -->
    <div class="pagination">
      <!-- Botão para ir à página anterior -->
      <button @click="goToPreviousPage" :disabled="currentPage === 1">Anterior</button>
      <!-- Exibe a página atual e o total de páginas -->
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <!-- Botão para ir à próxima página -->
      <button @click="goToNextPage" :disabled="currentPage === totalPages">Próximo</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../stores/authStore'; // Importa a store de autenticação

export default { 
  data() {
    return {
      username: '',        // Armazena o nome do usuário
      books: [],           // Armazena todos os livros
      searchQuery: '',     // Termo de pesquisa
      currentPage: 1,      // Página atual
      booksPerPage: 10,    // Número de livros exibidos por página
    };
  },
  mounted() {
    // Obtém o nome do usuário da store de autenticação
    const authStore = useAuthStore();
    this.username = authStore.username; // Armazena o nome do usuário

    this.fetchBooks();  // Chama a função para buscar livros quando o componente for montado
  },

  computed: {
    // Filtra os livros com base na pesquisa e aplica a paginação
    filteredBooks() {
      // Filtra os livros com base no título
      const filteredBooks = this.books.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      });

      // Aplica a lógica de paginação
      const start = (this.currentPage - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;

      return filteredBooks.slice(start, end);  // Retorna os livros para a página atual
    },

    // Calcula o número total de páginas
    totalPages() {
      const filteredBooks = this.books.filter(book => {
        return book.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
      return Math.ceil(filteredBooks.length / this.booksPerPage); // Retorna o total de páginas
    }
  },

  methods: {
    // Função para ir para a próxima página
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++; // Incrementa a página
      }
    },

    // Função para ir para a página anterior
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--; // Decrementa a página
      }
    },

    // Função para buscar todos os livros do servidor
    async fetchBooks() {
      try {
        const response = await axios.get('http://localhost:3000/api/books');
        this.books = response.data;  // Armazena os livros na variável 'books'
      } catch (error) {
        console.error('Erro ao buscar livros:', error);  // Em caso de erro na requisição
      }
    },
    
    // Função para excluir livro
    async deleteBook(id) {
      const confirmed = window.confirm('Você tem certeza que deseja excluir este livro?');
      if (confirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/books/${id}`);
          this.books = this.books.filter(book => book._id !== id); // Remove o livro da lista local
          alert('Livro excluído com sucesso!'); // Exibe mensagem de sucesso
        } catch (error) {
          console.error('Erro ao excluir livro:', error); // Em caso de erro
          alert('Erro ao excluir o livro.');
        }
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

/* Estilo para o ID compactado */
.id-compacto {
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px; /* Ajuste conforme necessário */
  padding: 2px 5px; 
  border-radius: 4px;
}

/* Tooltip estilo padrão (aparece no hover) */
.id-compacto:hover {
  background-color: #d0d0d0;
}

</style>
