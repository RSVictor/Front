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
               <!-- Imagem do livro (se disponível) -->
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
import { useAuthStore } from '../stores/authStore'; 
import { booksService } from '@/services/api'; 

export default {
  data() {
    return {
      books: [],
      searchQuery: this.$route.query.search || '',
      searchApplied: '',
      currentPage: 1,
      booksPerPage: 12,
    };
  },
  computed: {
    paginatedBooks() {
      const filteredBooks = this.books.filter((book) => 
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      const start = (this.currentPage - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;
      return filteredBooks.slice(start, end);
    },
    totalPages() {
      const filteredBooks = this.books.filter((book) => 
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      return Math.ceil(filteredBooks.length / this.booksPerPage);
    },
  },
  methods: {
    formatImagePath(path) {
      return `https://front-iqbz.onrender.com/${path.replace(/\\/g, '/')}`;
    },
    fetchBooks() {
      const queryParams = this.searchQuery ? { search: this.searchQuery } : {};

      booksService.getBooks(queryParams).then(response => {
        this.books = response.data;
        console.log(this.books);
      }).catch(error => {
        console.error("Erro ao buscar livros:", error);
      });
    },
    applyFilter() {
      this.searchApplied = this.searchQuery;
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  mounted() {
    const authStore = useAuthStore();
    this.username = authStore.username; 
    this.fetchBooks(); 
    if (this.searchQuery) {
      this.applyFilter();
    }
  }
};
</script>
