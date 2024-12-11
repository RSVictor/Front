<template>
  <div class="container">
    <!-- Exibe a saudação para o usuário logado -->
    <div class="user">
      <p>Bem-vindo, {{ username }}! </p> <!-- Exibe o nome do usuário logado -->
    </div>
    
    <!-- Seção de Editoras -->
    <div class="row mt-3">
      <span>Editoras</span>
      <!-- Listagem das editoras representadas por círculos -->
      <div class="mt-3 mb-5 row circulos">
        <!-- Cada div com a classe "circle" representa uma editora -->
        <div class="circle" style="background-color: #93BFA7;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #335844;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #93BFA7;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #335844;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #93BFA7;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #335844;">
          <span>Galáxia dos Livros</span>
        </div>
      </div>
      
      <!-- Seção de Livros -->
      <span>Livros</span>
      <div class="row flex-wrap">
        <!-- Exibe cada livro em um card com base na lista paginada -->
        <div class="card-wrapper col-12 col-sm-6 col-md-4 col-lg-3 mb-3" v-for="book in paginatedBooks" :key="book._id">
          <div class="card">
            <!-- Redireciona para a página de descrição do livro -->
            <router-link :to="{ name: 'descricaoADM', params: { id: book._id } }">
              <img :src="formatImagePath(book.image)" class="card-img-top mt-2" alt="Imagem do Livro">
            </router-link>

            <div class="card-body">
              <!-- Exibe o título do livro -->
              <h5 class="card-title">{{ book.title }}</h5>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navegação de páginas -->
      <div class="pagination">
        <!-- Botão para ir para a página anterior -->
        <button @click="goToPreviousPage" :disabled="currentPage === 1">Anterior</button>
        <!-- Exibe a página atual e total de páginas -->
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <!-- Botão para ir para a página seguinte -->
        <button @click="goToNextPage" :disabled="currentPage === totalPages">Próximo</button>
      </div>
    </div>
  </div>
</template>


<script>
import { useAuthStore } from '../stores/authStore'; // Acessa a store de autenticação
import { useFavoriteStore } from '../stores/favoriteStore'; // Acessa a store de favoritos
import { useRouter } from 'vue-router'; // Acessa o Vue Router para navegação
import { booksService } from '@/services/api'; // Acessa o serviço de livros

export default {
  data() {
    return {
      books: [], // Lista de livros que será exibida
      searchQuery: this.$route.query.search || '', // Armazena o termo de pesquisa vindo da URL
      searchApplied: '', // Armazena o filtro aplicado após a busca
      currentPage: 1, // Página atual (inicialmente 1)
      booksPerPage: 12, // Número de livros a serem exibidos por página
    };
  },
  computed: {
    // Calcula os livros que serão exibidos para a página atual
    paginatedBooks() {
      // Filtra os livros pelo título (conforme o termo de busca)
      const filteredBooks = this.books.filter((book) => 
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      // Determina o índice de início e fim dos livros a serem exibidos
      const start = (this.currentPage - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;

      // Retorna os livros filtrados e paginados
      return filteredBooks.slice(start, end);
    },
    
    // Calcula o número total de páginas com base nos livros filtrados
    totalPages() {
      const filteredBooks = this.books.filter((book) => 
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      return Math.ceil(filteredBooks.length / this.booksPerPage); // Total de páginas
    },
  },
  
  setup() {
    // Configura as stores e o router
    const authStore = useAuthStore();  // Store de autenticação
    const favoriteStore = useFavoriteStore();  // Store de favoritos
    const router = useRouter();  // Router para navegação
  },
  
  methods: {
    // Função para buscar livros da API com base no filtro de pesquisa
    fetchBooks() {
      // Parâmetros de consulta com base no termo de pesquisa
      const queryParams = this.searchQuery ? { search: this.searchQuery } : {};

      booksService.getBooks(queryParams).then(response => {
        this.books = response.data; // Armazena os livros retornados pela API
        console.log(this.books);      // Log dos dados recebidos (útil para debug)
      }).catch(error => {
        console.error("Erro ao buscar livros:", error);  // Tratamento de erro
      });
    },

    // Aplica o filtro de pesquisa
    applyFilter() {
      this.searchApplied = this.searchQuery;  // Atualiza o valor aplicado
    },

    // Função para formatar o caminho da imagem (ajusta o caminho relativo)
    formatImagePath(path) {
      return `http://localhost:3000/${path.replace(/\\/g, '/')}`; // Retorna a URL da imagem
    },

    // Função para ir para a próxima página de livros
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++; // Incrementa a página atual
      }
    },

    // Função para ir para a página anterior
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--; // Decrementa a página atual
      }
    }
  },

  // Função chamada quando o componente é montado
  mounted() {
    const authStore = useAuthStore();
    this.username = authStore.username; // Obtém o nome do usuário da store
    this.fetchBooks(); // Busca os livros na API
    if (this.searchQuery) {
      this.applyFilter(); // Aplica o filtro se houver um termo de pesquisa
    }
  }
};
</script>
