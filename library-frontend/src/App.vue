<script setup>
import { onMounted, computed } from 'vue';  // Importa funções do Vue: onMounted (para ciclo de vida) e computed (para propriedades reativas)
import { useAuthStore } from './stores/authStore'; // Importa a store de autenticação (provavelmente para verificar o estado de login)
import { RouterView } from 'vue-router';  // Importa o componente RouterView, que renderiza a rota atual
import MenuUser from './components/MenuUser.vue';  // Importa o componente do menu do usuário
import Rodape from './components/RodapeHome.vue';  // Importa o componente de rodapé da página
import MenuDeslogado from './components/MenuDeslogado.vue';  // Importa o menu que será exibido quando o usuário não estiver logado
import MenuADM from './components/MenuAdm.vue';  // Importa o menu do administrador

// Obtém o store de autenticação
const authStore = useAuthStore();

// Verifica o estado de autenticação ao montar o componente
onMounted(() => {
  authStore.checkAuthStatus();  // Chama o método checkAuthStatus() da store para verificar o estado de autenticação assim que o componente for montado
});

// Computed para determinar qual menu deve ser exibido
const currentMenu = computed(() => {
  // Verifica se o usuário está logado e qual seu nível de permissão
  if (authStore.isLoggedIn) {
    // Se o usuário está logado e sua permissão é "ADM", renderiza o Menu de Admin
    return authStore.userPermission === 'ADM' ? MenuADM : MenuUser;
  } else {
    // Caso contrário, renderiza o Menu para usuários deslogados
    return MenuDeslogado;
  }
});
</script>


<template>
  <header>
    <!-- Renderiza o componente de acordo com o estado de autenticação -->
    <component :is="currentMenu" />
  </header>

  <RouterView />
  <Rodape />
</template>
