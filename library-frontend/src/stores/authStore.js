import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFavoriteStore } from './favoriteStore'; // Importe a store de favoritos

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const userPermission = ref(null);
  const username = ref('');
  const userId = ref(null); // Armazenar o ID do usuário

  const favoriteStore = useFavoriteStore(); // Referência à store de favoritos

  // Função para verificar o status de autenticação
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const permissions = localStorage.getItem('permissions');
    const storedUserId = localStorage.getItem('userId');  // Recupere o userId do localStorage
    
    // Corrigido para verificar 'storedUserId' corretamente
    if (token && permissions && storedUserId) {
      isLoggedIn.value = true;
      userPermission.value = permissions;
      username.value = localStorage.getItem('username') || '';
      userId.value = storedUserId;  // Define o userId a partir do localStorage
    } else {
      isLoggedIn.value = false;
      userPermission.value = null;
      username.value = '';
      userId.value = null;  // Limpa o userId
    }
  };

  // Função de login
  const login = (token, permissions, name, id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('permissions', permissions);
    localStorage.setItem('username', name); // Armazena o nome do usuário
    localStorage.setItem('userId', id); // Armazena o ID do usuário
    isLoggedIn.value = true;
    userPermission.value = permissions;
    username.value = name;
    userId.value = id;  // Define o userId

    // Carrega os favoritos
    favoriteStore.loadFavorites(id);  // Carrega os favoritos para o usuário
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');  // Remove o userId
    isLoggedIn.value = false;
    userPermission.value = null;
    username.value = '';
    userId.value = null;  // Limpa o userId
    favoriteStore.clearFavorites();  // Limpa os favoritos do usuário
  };

  return { isLoggedIn, userPermission, username, userId, login, logout, checkAuthStatus };
});
