import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    favorites: [] // Lista de favoritos do usuário
  }),
  actions: {
    // Carregar favoritos para o usuário baseado no userId
    loadFavorites(userId) {
      const storedFavorites = localStorage.getItem(`favorites_${userId}`);
      if (storedFavorites) {
        this.favorites = JSON.parse(storedFavorites); // Carrega os favoritos do localStorage
      }
    },
    
    // Adicionar livro aos favoritos
    addToFavorites(book) {
      this.favorites.push(book);
      this.saveFavorites(); // Atualiza os favoritos no localStorage
    },
    
    // Remover livro dos favoritos
    removeFromFavorites(book) {
      this.favorites = this.favorites.filter(fav => fav._id !== book._id);
      this.saveFavorites(); // Atualiza os favoritos no localStorage
    },
    
    // Verificar se o livro está nos favoritos
    isFavorite(book) {
      return this.favorites.some(fav => fav._id === book._id);
    },
    
    // Limpar favoritos para o usuário atual
    clearFavorites() {
      this.favorites = [];
      this.saveFavorites(); // Limpa os favoritos no localStorage
    },
    
    // Salvar favoritos no localStorage
    saveFavorites() {
      const userId = localStorage.getItem('userId');
      if (userId) {
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(this.favorites)); // Armazenamento por userId
      }
    }
  }
});
