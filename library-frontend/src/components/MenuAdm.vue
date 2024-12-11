<template>
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
   
  </head>
  <header class="p-3 mb-4 border-bottom w-100" style="background-color: #93BFA7;">
    <div class="container-fluid">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <RouterLink to="#" class="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
          <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
        </RouterLink>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <RouterLink to="dashboard" class="nav-link px-2 link-body-emphasis">
              <h3><strong>BookMange</strong></h3>
            </RouterLink>
          </li>
        </ul>
    
        
        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input v-model="searchQuery"
          @input="applyFilter"
           type="search" class="form-control" placeholder="Procurar..." aria-label="Search">
        </form>
       

        <div class="dropdown text-end">
          <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>
          </a>
          <ul class="dropdown-menu text-small">
            <li><router-link to="/dashboard" class="dropdown-item">Dashboard</router-link></li>     
            <li><router-link to="/homeADM" class="dropdown-item">Acervo</router-link></li>
            <li><router-link to="/listalivro" class="dropdown-item">Lista livros</router-link></li>
            <li><router-link to="/adicionarLivro" class="dropdown-item">Adicionar livro</router-link></li>
            <li><router-link to="/listaUser" class="dropdown-item">Lista usuários</router-link></li>                
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" @click="logout">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '../stores/authStore'; // ajuste o caminho se necessário
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter(); // Obtenha a instância do router

    // Método de logout
    const logout = () => {
      authStore.logout(); // Chame o método de logout da store
      router.push('/'); // Redirecione para a página de login
      alert('Logout realizado!');
    };

    return { authStore, logout };
 
  },
};


</script>
