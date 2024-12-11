<template>
  <!-- Container principal que envolve todo o conteúdo da página -->
  <div class="container">
    <!-- Exibe o nome do usuário -->
    <div class="user">
      <p>Bem-vindo, {{ username }}</p> <!-- Exibe o nome do usuário -->
    </div>

    <!-- Seção para exibir e editar os dados do usuário -->
    <div class="perfil mt-3">
      <div class="titulo-perfil">
        <span>Meus dados</span> <!-- Título da seção -->
      </div>

      <div class="dados mt-4">
        <!-- Seção de foto e botão para adicionar foto -->
        <div class="foto-botao">
          <div class="img-foto">
            <!-- Exibe a imagem do usuário se imagePreview estiver definida -->
            <img v-if="imagePreview" :src="imagePreview" alt="Foto do usuário" style="width: 250px;">
          </div>

          <div class="button-foto mt-3">
            <!-- Botão para abrir o seletor de arquivos e adicionar uma foto -->
            <label for="fileInput" class="custom-file-upload" style="cursor: pointer;">
              Adicionar foto
            </label>
            <input type="file" id="fileInput" @change="onFileChange" style="display: none;"> <!-- Input oculto para selecionar a imagem -->
          </div>
        </div>

        <!-- Formulário para editar os dados do usuário -->
        <form @submit.prevent="updateUser">
          <div class="form-perfil mt-3">
            <!-- Campos de entrada para editar o nome, email, senha e nova senha -->
            <label for="nomeInput">Nome:</label>
            <input v-model="username" type="text" class="form-control" id="nomeInput" placeholder="Digite seu nome">

            <label for="emailInput">Email:</label>
            <input v-model="email" type="email" class="form-control" id="emailInput" placeholder="Digite seu email">

            <label for="senhaInput">Senha:</label>
            <input v-model="password" type="password" class="form-control" id="senhaInput" placeholder="Digite sua senha">

            <label for="novaSenhaInput">Nova senha:</label>
            <input v-model="newPassword" type="password" class="form-control" id="novaSenhaInput" placeholder="Digite a nova senha">
          </div>

        </form>
      </div>

      <!-- Botões para excluir ou salvar as alterações no perfil -->
      <div class="button-perfil-user">
        <div>
          <!-- Botão para excluir o usuário -->
          <button class="button-excluir" type="submit" @click.prevent="deleteUser"> 
            <i class="bi bi-trash"></i>Excluir
          </button>
        </div>
        <div>
          <!-- Botão para salvar as alterações no perfil -->
          <button class="button-salvar" type="submit" @click.prevent="updateUser">
            <i class="bi bi-check2-square"></i>Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '../services/api'; // Importa o serviço para interação com a API
import { useAuthStore } from '../stores/authStore'; // Importa a store de autenticação

export default {
  data() {
    return {
      // Variáveis reativas para armazenar as informações do usuário
      username: '',   // Nome de usuário
      email: '',      // Email do usuário
      password: '',   // Senha atual
      newPassword: '', // Nova senha
      userImage: '',  // Imagem do usuário
      imagePreview: null,  // URL temporária da imagem para exibição
    };
  },
  methods: {
    // Método para atualizar a pré-visualização da imagem ao selecionar um arquivo
    onFileChange(event) {
      const file = event.target.files[0];  // Pega o arquivo selecionado
      if (file) {
        // Cria uma URL temporária para a imagem selecionada e a armazena em 'imagePreview'
        this.imagePreview = URL.createObjectURL(file);
      }
    },

    // Método para buscar os dados do usuário após o login ou montagem do componente
    // Método para buscar os dados do usuário após o login ou montagem do componente
    async fetchUserData() {
      try {
        const userId = localStorage.getItem("userId");  // Recupera o userId do localStorage        
        const response = await axios.put(`http://localhost:3000/admin/api/users/${userId}`);

        // Atualiza as variáveis com os dados recebidos
        this.username = response.username;  // Atualiza o nome de usuário
        this.email = response.email;  // Atualiza o email
        this.userImage = response.imageUrl || '';  // Se existir uma URL de imagem, armazena
        if (this.userImage) {
          // Se a imagem for encontrada, exibe na tela
          this.imagePreview = this.userImage;
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    },

    // Método para atualizar as informações do usuário
    async updateUser() {
      try {
        const updatedUser = {
          username: this.username,
          email: this.email,
          password: this.password,
          newPassword: this.newPassword,
          image: this.imagePreview,  // A imagem de pré-visualização, se fornecida
        };

        // Chama o serviço da API para atualizar os dados do usuário
        const response = await userService.updateUserData(updatedUser);
        if (response.success) {
          console.log('Usuário atualizado com sucesso');
          // Pode exibir uma mensagem ou redirecionar o usuário
        }
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
      }
    },

    // Método para excluir o usuário
    async deleteUser() {
      try {
        // Chama a API para excluir a conta do usuário
        const response = await userService.deleteUser();
        if (response.success) {
          console.log('Usuário excluído com sucesso');
          // Após excluir, redireciona para a página de login
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
      }
    },

    // Método para fazer logout do usuário
    async logout() {
      const authStore = useAuthStore();  // Acessa a store de autenticação
      authStore.logout();  // Chama o método de logout na store
      this.$router.push('/login');  // Redireciona para a página de login
    },
  },

  // Executa a função fetchUserData assim que o componente é montado
  mounted() {
    const authStore = useAuthStore(); // Acessa a store de autenticação
    this.username = authStore.username; // Obtém o nome do usuário da store
    this.fetchUserData(); // Chama a função para buscar os dados do usuário
  },
};
</script>
