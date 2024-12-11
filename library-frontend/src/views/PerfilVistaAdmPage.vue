<template>
  <!-- Container principal que envolve todo o conteúdo -->
  <div class="container">
    <!-- Exibe uma mensagem de boas-vindas ao usuário -->
    <div class="user">
      <p>Bem-vindo, Usuário!</p>
    </div>

    <!-- Seção com botões para navegação do administrador -->
    <div class="titulo-adm-button ">
      <div class="button-adm">
        <!-- Link para visualizar a lista de livros -->
        <RouterLink to="/listalivro">Livros</RouterLink>
      </div>
      <div class="button-adm">
        <!-- Link para visualizar a lista de usuários -->
        <RouterLink to="/listaUser">Usuários</RouterLink>
      </div>
      <div class="button-adm">
        <!-- Link para adicionar novos livros -->
        <RouterLink to="/adicionarLivro">Adicionar Livros</RouterLink>
      </div>
    </div>

    <!-- Seção para exibir o perfil do usuário -->
    <div class="perfil mt-3">
      <div class="titulo-perfil">
        <span>Perfil do Usuário(a)</span> <!-- Título da seção -->
      </div>

      <div class="dados mt-4">
        <!-- Seção para exibir a foto do usuário (ainda sem imagem) -->
        <div class="foto-botao">
          <div class="img-foto">
            <img src="" alt="Foto do usuário"> <!-- A imagem não está sendo exibida ainda -->
          </div>
        </div>

        <!-- Formulário para exibir os dados do usuário -->
        <form>
          <div class="form-perfil mt-5">
            <!-- Exibe os dados do usuário: nome, email, ID e status, todos desabilitados para edição -->
            <label for="nomeInput">Nome:</label>
            <input class="form-control" id="nomeInput" v-model="user.username" disabled>

            <label for="emailInput" class="mt-3">Email:</label>
            <input class="form-control" id="emailInput" v-model="user.email" disabled>

            <label for="idInput" class="mt-3">ID:</label>
            <input class="form-control" id="idInput" v-model="user.customId" disabled>

            <label for="statusInput" class="mt-3">Status:</label>
            <input class="form-control" id="statusInput" v-model="user.status" disabled>
          </div>
        </form>
      </div>

      <!-- Seção com o botão para visualizar o histórico do administrador -->
      <div class="button-perfil-user mt-4">
        <div class="button-ver-historico">
          <div class="button-perfil">
            <div class="button-link">
              <!-- Link para visualizar o histórico de ações do administrador -->
              <RouterLink to="/historicoADM" class="button-link">
                <i class="bi bi-file-earmark-text"></i>
                <span class="button-text">Ver Histórico</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';  // Importa a biblioteca axios para fazer requisições HTTP

export default {
  data() {
    return {
      // Objeto 'user' para armazenar os dados do usuário
      user: {
        customId: '', // ID único do usuário
        username: '', // Nome do usuário
        email: '',    // Email do usuário
        status: '',   // Status do usuário (ex: ativo, inativo)
      }
    };
  },

  // O método 'mounted' é chamado quando o componente é montado
  mounted() {
    this.fetchUserData();  // Chama o método para buscar os dados do usuário
  },

  methods: {
    // Método para buscar os dados do usuário
    async fetchUserData() {
      try {
        const userId = this.$route.params.id;  // Obtém o ID do usuário a partir da URL
        const response = await axios.get(`http://localhost:3000/admin/api/users/${userId}`);  // Faz uma requisição para buscar os dados do usuário

        // Preenche o objeto 'user' com os dados recebidos da API
        this.user = response.data;
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);  // Exibe o erro no console
        alert('Erro ao carregar os dados do usuário');  // Exibe um alerta caso ocorra um erro
      }
    },
  },
};
</script>
