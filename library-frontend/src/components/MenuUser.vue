<template>
  <header class="p-3 mb-4 border-bottom w-100" style="background-color: #93BFA7;">
    <div class="container-fluid">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

        <!-- Logo -->
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li class="text-center">
            <router-link to="/" class="nav-link px-2 link-body-emphasis">
              <h3><strong>BookManage</strong></h3>
            </router-link>
          </li>
        </ul>

        <!-- Campo de busca -->
        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input 
            v-model="searchQuery"
            @input="applyFilter"
            type="search" 
            class="form-control" 
            placeholder="Procurar..." 
            aria-label="Search"
          />
        </form>

        <!-- Ícone de notificação -->
        <div class="dropdown text-end me-3">
          <a 
            href="#" 
            class="d-block link-body-emphasis text-decoration-none dropdown-toggle position-relative"
            data-bs-toggle="dropdown"
            aria-expanded="false">
            <i class="bi bi-bell style"></i>
            <span v-if="unreadCount > 0" class="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
              {{ unreadCount }}
            </span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end text-small">
            <li v-for="(notification, index) in notifications" :key="index">
              <a 
                href="#" 
                class="dropdown-item" 
                @click.prevent="readNotification(index)">
                {{ notification.message }}
              </a>
            </li>
            <li v-if="notifications.length === 0" class="dropdown-item text-muted">Sem notificações</li>
          </ul>
        </div>

        <!-- Menu do usuário -->
        <div class="dropdown text-end">
          <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>
          </a>
          <ul class="dropdown-menu text-small">
            <li><router-link to="/" class="dropdown-item">Home</router-link></li>
            <li><router-link to="/PerfilUser" class="dropdown-item">Minha Conta</router-link></li>
            <li><router-link to="/historico" class="dropdown-item">Histórico</router-link></li>
            <li><router-link to="/favoritos" class="dropdown-item">Favoritos</router-link></li>
            <li><router-link to="/maisBuscados" class="dropdown-item">Mais buscados</router-link></li>          
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" @click="logout">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore'; // Ajuste o caminho se necessário
import { useNotificationStore } from '../stores/notificationStore'; // Certifique-se de importar a store correta
import Notification from './notification.vue';

export default {
  components: {
    Notification,
  },
  setup() {
    // Store de autenticação
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore(); // Store de notificações

    // Contador de notificações não lidas
    const unreadCount = ref(
      notificationStore.notifications.filter((notification) => !notification.read).length
    );

    // Marca uma notificação como lida
    const readNotification = (index) => {
      const notification = notificationStore.notifications[index];
      if (!notification.read) {
        notification.read = true;
        unreadCount.value = notificationStore.notifications.filter(
          (notification) => !notification.read
        ).length;
      }
    };

    // Logout
    const logout = () => {
      authStore.logout(); // Chama o método de logout da store
      alert('Logout realizado!');
      window.location.href = '/'; // Redireciona para a página inicial
    };

    return {
      notifications: notificationStore.notifications,
      unreadCount,
      readNotification,
      logout,
    };
  },
};
</script>


<style scoped>
.badge {
  font-size: 0.8rem;
  padding: 0.3em 0.5em;
  position: absolute;
  transform: translate(-50%, -50%);
}
</style>