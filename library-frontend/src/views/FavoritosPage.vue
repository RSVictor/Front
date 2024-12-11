<template>
  <div class="container">
    <div class="user">
      <p>Bem-vindo, {{ username }}</p>
    </div>

    <div class="titulo-fav">
      <span>Sua lista de favoritos</span>
    </div>

    <!-- Exibe a lista de favoritos somente se o usuário estiver logado -->
    <div v-if="isLoggedIn && favorites.length" class="fav-item mt-3">
      <span>Você tem {{ favorites.length }} item(s) na sua lista de favoritos.</span>
    </div>

    <!-- Exibe mensagem quando o usuário não tem favoritos ou não está logado -->
    <div v-else>
      <span v-if="isLoggedIn">Você não tem favoritos ainda.</span>
      <span v-else>Você precisa estar logado para ver seus favoritos.</span>
    </div>

    <div class="row flex-wrap" style="gap: 10px;">
      <div class="card-wrapper col-12 col-sm-6 col-md-4 col-lg-3 card-fav mt-3"  v-for="book in favorites" :key="book._id">
        <router-link :to="{ name: 'descricao', params: { id: book._id } }">
          <img :src="formatImagePath(book.image)" class="card-img-top mt-2" alt="Imagem do Livro">
        </router-link>
        
        <div class="card-body mt-4">
          <h5 class="card-title">{{ book.title }}</h5>
          
          <!-- Botão para remover o livro -->
          <button 
            class="btn btn-primary mt-3" 
            style="width: 80px; background-color: red; border: none;" 
            @click="removeFromFavorites(book)">
            <i class="bi bi-trash"></i> 
          </button>
        </div>
      </div>
    </div>

    <div class="button-favorito mt-5">
      <div class="button-salvar">
        <router-link to="/" class="button-link">
          <i class="bi bi-plus-lg"></i>
          <span class="button-text">Adicionar</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'; // Ajuste o caminho se necessário
import { useFavoriteStore } from '../stores/favoriteStore'; // Importe a store de favoritos
import { computed, onMounted, watch } from 'vue';  // Importe ref, computed, onMounted, e watch

export default {
  setup() {
    const authStore = useAuthStore();  // Store de autenticação
    const favoriteStore = useFavoriteStore();  // Store de favoritos

    // Verifica se o usuário está logado
    const isLoggedIn = computed(() => authStore.isLoggedIn); 

    // Recupera os favoritos da store, mas só se o usuário estiver logado
    const favorites = computed(() => isLoggedIn.value ? favoriteStore.favorites : []);

    // Recupera o nome do usuário logado
    const username = computed(() => authStore.user?.username || 'Visitante');

    // Função para remover o livro dos favoritos
    const removeFromFavorites = (book) => {
      favoriteStore.removeFromFavorites(book);
    };

    // Função para formatar o caminho da imagem
    const formatImagePath = (path) => {
      return `http://localhost:3000/${path.replace(/\\/g, '/')}`;
    };

    // Ao deslogar, limpar favoritos
    const logout = () => {
      authStore.logout(); // Chame a função de logout da store de autenticação
      favoriteStore.clearFavorites();  // Limpa favoritos ao deslogar
    };

    // Observa mudanças no login/logout e limpa os favoritos
    watch(isLoggedIn, (newValue) => {
      if (!newValue) {
        favoriteStore.clearFavorites(); // Limpa os favoritos caso o usuário deslogue
      }
    });

    return {
      favorites,  // Lista de favoritos reativa
      username,   // Nome do usuário logado
      removeFromFavorites,  // Função para remover dos favoritos
      formatImagePath,  // Função para formatar o caminho da imagem
      isLoggedIn,  // Verificação do login
      logout,  // Função de logout
    };
  }
};
</script>


<style scoped>
/* Adicione estilos adicionais conforme necessário */
</style>
