<template>
  <!-- Container principal do formulário de login -->
  <main class="form-container m-auto">
    <!-- Formulário de login, que chama a função 'loginUser' ao submeter -->
    <form @submit.prevent="loginUser">
      <!-- Título do formulário -->
      <h1 class="h3 mb-3 fw-normal">Entrar</h1>
      
      <!-- Campo de entrada para o email -->
      <div class="form-floating">
        <input 
          type="email" 
          v-model="email"  
          class="form-control" 
          id="floatingInput" 
          placeholder="name@example.com" 
        />
        <label for="floatingInput">Email</label> <!-- Rótulo para o campo de email -->
      </div>

      <!-- Campo de entrada para a senha -->
      <div class="form-floating mt-2">
        <input 
          type="password" 
          v-model="password"
          class="form-control" 
          id="floatingPassword" 
          placeholder="Password" 
        />
        <label for="floatingPassword">Senha</label> <!-- Rótulo para o campo de senha -->
      </div>

      <!-- Mensagem de erro, exibida se a variável 'message' tiver algum valor -->
      <p v-if="message" class="text-danger">{{ message }}</p>

      <!-- Botão para submeter o formulário de login -->
      <button class="btn text-bg-success w-100 mt-2 py-2" type="submit">Entrar</button>

      <!-- Link para a página de cadastro, caso o usuário não tenha uma conta -->
      <p class="mt-1 mb-3 text-body-secondary">
        Não tem conta?
        <router-link class="mt-1 text-success" style="text-decoration: none;" to="/cadastro"> Cadastre-se</router-link>
      </p>
    </form>
  </main>
</template>


<script>
import { userService } from '../services/api'; // Importa a função de login do serviço de API
import { useAuthStore } from '../stores/authStore'; // Importa a store de autenticação
import { RouterLink, RouterView } from 'vue-router' // Importa o RouterLink para navegação

export default {
  data() {
    return {
      email: '',         // Variável que armazena o email do usuário
      password: '',      // Variável que armazena a senha do usuário
      message: ''        // Variável que armazena mensagens de erro ou sucesso
    };
  },
  methods: {
    // Método que lida com o envio do formulário de login
    async loginUser() {
      try {
        // Envia os dados de login para a API
        const response = await userService.login({
          email: this.email,
          password: this.password,
        });

        // Acessa a store de autenticação
        const authStore = useAuthStore();
        const { token, permissions, username, userId } = response.data;
        // Chama o método 'login' da store para armazenar o token, permissões e nome de usuário
        authStore.login(token, permissions, username, userId);
        // Redireciona com base nas permissões do usuário
        if (response.data.permissions === 'Usuario') {
          // Redireciona para a página do usuário
          this.$router.push('/');
        } else if (response.data.permissions === 'ADM') {
          // Redireciona para o dashboard do administrador
          this.$router.push('/dashboard');
        } else {
          // Caso a permissão seja desconhecida, exibe uma mensagem de erro
          this.message = 'Permissão desconhecida!';
        }
      } catch (error) {
        // Se ocorrer um erro, exibe a mensagem de erro recebida da API
        this.message =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'Erro ao fazer login.'; // Mensagem de erro genérica, caso não haja uma mensagem específica
      }
    }
  }
};
</script>

<style scoped>
/* Estilo para o container do formulário */
.form-container {
  width: 100%;
}

/* Estilos globais para centralizar o formulário na página */
html,
body,
main {
  width: 100%;
  height: 610px;
  display: flex;         /* Usando flexbox para centralizar */
  align-items: center;   /* Centraliza verticalmente */
  justify-content: center; /* Centraliza horizontalmente */
  margin: 0;             /* Remove as margens padrão */
}
</style>
