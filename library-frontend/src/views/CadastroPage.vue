<template>
  <main class="form-container w-100 m-auto">
    <!-- Formulário de cadastro -->
    <form @submit.prevent="registerUser">
      <h1 class="h3 mb-3 fw-normal">Cadastrar</h1>

      <!-- Campo de nome -->
      <div class="form-floating">
        <input type="text" v-model="username" class="form-control" :id="'floatingInput_' + uniqueId"
          placeholder="Nome" />
        <label :for="'floatingInput_' + uniqueId">Nome</label>
      </div>

      <!-- Campo de email -->
      <div class="form-floating mt-2">
        <input type="email" v-model="email" class="form-control" :id="'floatingEmail_' + uniqueId"
          placeholder="name@example.com" />
        <label :for="'floatingEmail_' + uniqueId">Email</label>
      </div>

      <!-- Campo de senha -->
      <div class="form-floating mt-2">
        <input type="password" v-model="password" class="form-control" :id="'floatingPassword_' + uniqueId"
          placeholder="Senha" />
        <label :for="'floatingPassword_' + uniqueId">Senha</label>
      </div>

      <!-- Mensagem de erro -->
      <p v-if="message" class="text-danger">{{ message }}</p>

      <!-- Botão de enviar -->
      <button class="btn text-bg-success w-100 mt-2 py-2" type="submit">Cadastrar</button>

      <!-- Link para a página de login -->
      <p class="mt-1 mb-3 text-body-secondary">Já é cadastrado?<router-link class="mt-1 text-success" style="text-decoration: none;" to="/login"> Logar</router-link></p>
    </form>
  </main>
</template>


<script>
import { userService } from '../services/api'; // Importa o serviço de usuários

export default {
  data() {
    return {
      username: '',  // Nome do usuário
      email: '',     // Email do usuário
      password: '',  // Senha do usuário
      message: '',   // Mensagem de erro
      uniqueId: Math.random(), // Gera um ID único para os inputs (para evitar conflitos de ID)
    };
  },

  methods: {
    // Método para registrar o usuário
    async registerUser() {
      // Verifica se todos os campos foram preenchidos
      if (!this.username || !this.email || !this.password) {
        this.message = 'Por favor, preencha todos os campos.'; // Exibe mensagem de erro se algum campo estiver vazio
        return;
      }

      try {
        // Monta os dados do usuário para envio ao backend
        const userData = {
          username: this.username,
          email: this.email,
          password: this.password,
        };

        // Chama o serviço para registrar o usuário
        const response = await userService.register(userData);

        // Exibe sucesso no console e alerta para o usuário
        console.log('Usuário registrado com sucesso:', response.data);
        alert('Usuário cadastrado com sucesso!');
        
        // Redireciona para a página de login após o cadastro
        this.$router.push('/login');
      } catch (error) {
        // Caso ocorra erro, exibe a mensagem de erro
        console.error('Erro ao registrar usuário:', error.response?.data || error.message);
        this.message = error.response?.data?.message || 'Erro ao registrar usuário.'; // Exibe erro específico, se disponível
      }
    },
  },
};
</script>


<style scoped>
.form-container {
  width: 100%;
}

html,
body,
main {
  width: 100%;
  height: 610px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}
</style>
