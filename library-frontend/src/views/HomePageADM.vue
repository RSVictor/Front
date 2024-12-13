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
import { useFavoriteStore } from '../stores/favoriteStore';
import { useRouter } from 'vue-router';
import { booksService } from '@/services/api';
import { computed, ref, onMounted } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const favoriteStore = useFavoriteStore();
    const router = useRouter();

    const books = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const booksPerPage = 12;

    const userId = localStorage.getItem("userId");
    
    // Ao logar, carregar favoritos do usuário
    if (authStore.isLoggedIn && authStore.user) {
      favoriteStore.loadFavorites(authStore.user.id);
    }


    const handleEmprestar = () => {
      if (!authStore.isLoggedIn) {
        alert('Você precisa fazer login para emprestar um livro.');
        router.push('/login');
      } else {
        router.push('/emprestimo');
      }
    };
    
 // Função para alternar o favorito (adicionar ou remover)
 const toggleFavorite = (book) => {
      if (!authStore.isLoggedIn) {
        alert("Você precisa estar logado para favoritar.");
        router.push('/login');
        return;  // Impede qualquer outra ação se não estiver logado
      }
      if (favoriteStore.isFavorite(book)) {
        favoriteStore.removeFromFavorites(book);
      } else {
        favoriteStore.addToFavorites(book);
      }
    };

    // Verifica se o livro está nos favoritos
    const isFavorite = (book) => {
      return favoriteStore.isFavorite(book);
    };

    // Função para formatar o caminho da imagem
    const formatImagePath = (path) => {
      return `https://front-iqbz.onrender.com/${path.replace(/\\/g, '/')}`; // Formatação da URL da imagem
    };

    // Computed properties para paginacao
    const paginatedBooks = computed(() => {
      const filteredBooks = books.value.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
      const start = (currentPage.value - 1) * booksPerPage;
      const end = start + booksPerPage;
      return filteredBooks.slice(start, end);
    });

    const totalPages = computed(() => {
      const filteredBooks = books.value.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
      return Math.ceil(filteredBooks.length / booksPerPage);
    });

    const fetchBooks = () => {
      const queryParams = searchQuery.value ? { search: searchQuery.value } : {};
      booksService.getBooks(queryParams).then(response => {
        books.value = response.data;
      }).catch(error => {
        console.error("Erro ao buscar livros:", error);
      });
    };

    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    onMounted(() => {
      fetchBooks();
    });

    return {
      authStore,
      handleEmprestar,
      toggleFavorite,
      isFavorite,
      formatImagePath,
      paginatedBooks,
      totalPages,
      currentPage,
      goToNextPage,
      goToPreviousPage
    };
  },
};
</script>