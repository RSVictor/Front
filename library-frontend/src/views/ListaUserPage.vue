<template>
  <!-- Container principal da página -->
  <div class="container">

    <!-- Seção que exibe o nome do usuário logado -->
    <div class="user">
      <p>Bem-vindo, {{ username }}! </p> <!-- Exibe o nome do usuário logado -->
    </div>

    <!-- Menu de navegação do administrador -->
    <div class="titulo-adm-button">
      <div class="button-adm">
        <!-- Link para o Dashboard -->
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </div>
      <div class="button-adm">
        <!-- Link para a lista de livros -->
        <RouterLink to="/listalivro">Livros</RouterLink>
      </div>
      <div class="button-adm">
        <!-- Link para a página de adicionar livros -->
        <RouterLink to="/adicionarLivro">Adicionar Livros</RouterLink>
      </div>

      <!-- Caixa de pesquisa para filtrar usuários -->
      <div class="input-adm">
        <input 
          type="text" 
          placeholder="Pesquisar Usuários" 
          v-model="searchQuery" 
          @input="filterUsers"
        />
        <button><i class="bi bi-search"></i></button>
      </div>
    </div>

    <!-- Cabeçalho da lista de usuários -->
    <div class="titulo-adm mt-5">
      <div class="text-emp">Id</div>
      <div class="text-emp">Nome</div>
      <div class="text-emp">Email</div>
      <div class="text-emp">Status</div>
      <div class="text-emp">Hierarquia</div>
      <div class="text-emp">Opções</div>
    </div>

    <!-- Exibe a lista de usuários com base na página atual e no filtro de pesquisa -->
    <div v-for="user in paginatedUsers" :key="user._id" class="lista-adm mt-2">
      <div class="text-lista">
        <!-- Exibe o ID curto e o ID completo no atributo title para mostrar ao passar o mouse -->
        <span class="id-compacto" :title="user._id.toString()">
          {{ user._id.toString().slice(0, 6) }}...{{ user._id.toString().slice(-6) }}
        </span>
      </div>
      <div class="text-lista">{{ user.username }}</div>
      <div class="text-lista">{{ user.email }}</div>
      <!-- Aplica a classe 'text-danger' se o status do usuário for 'inativo' -->
      <div class="text-lista" :class="{'text-danger': user.status === 'inativo'}">{{ user.status }}</div>
      <div class="text-lista">{{ user.permissions }}</div>
      <div class="text-lista">
        <div class="button-perfil">
          <div class="button-editar-adm">
            <!-- Link para a página de perfil do usuário -->
            <RouterLink :to="`/PerfilVistaADM/${user._id}`" class="button-link">
              <i class="bi bi-person-fill-add"></i>
            </RouterLink>
          </div>
          <!-- Botão para bloquear o usuário -->
          <div class="button-editar-adm">
            <button class="button-editar-adm" style="border: none;" @click="blockUser(user)">
              <i class="bi bi-person-fill-slash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles de navegação para paginação -->
    <div class="pagination">
      <!-- Botão para ir para a página anterior -->
      <button @click="goToPreviousPage" :disabled="currentPage === 1">Anterior</button>
      <!-- Exibe a página atual e o número total de páginas -->
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <!-- Botão para ir para a próxima página -->
      <button @click="goToNextPage" :disabled="currentPage === totalPages">Próximo</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios'; // Importa axios para requisições HTTP
import { useAuthStore } from '../stores/authStore'; // Importa a store de autenticação

export default {
  data() {
    return {
      username: '',        // Armazena o nome do usuário logado
      users: [],           // Lista de usuários obtida da API
      searchQuery: '',     // Termo de pesquisa de usuários
      filteredUsers: [],   // Lista de usuários filtrados
      currentPage: 1,      // Página atual da lista de usuários
      usersPerPage: 10     // Número de usuários exibidos por página
    };
  },
  mounted() {
    // Obtém o nome do usuário da store de autenticação
    const authStore = useAuthStore();
    this.username = authStore.username; // Armazena o nome do usuário
    this.fetchUsers();   // Carrega a lista de usuários quando o componente for montado
  },

  computed: {
    // Lista de usuários filtrados e paginados
    paginatedUsers() {
      // Filtra os usuários com base na pesquisa (nome, email ou status)
      const filteredUsers = this.users.filter(user => {
        return user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               user.status.toLowerCase().includes(this.searchQuery.toLowerCase());
      });

      // Aplica a lógica de paginação (divide os usuários por páginas)
      const start = (this.currentPage - 1) * this.usersPerPage;
      const end = start + this.usersPerPage;

      return filteredUsers.slice(start, end);  // Retorna os usuários da página atual
    },

    // Calcula o número total de páginas com base nos usuários filtrados
    totalPages() {
      // Filtra os usuários conforme o termo de pesquisa
      const filteredUsers = this.users.filter(user => {
        return user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               user.status.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
      return Math.ceil(filteredUsers.length / this.usersPerPage); // Retorna o total de páginas
    }
  },

  methods: {
    // Função para ir para a próxima página
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++; // Incrementa a página atual
      }
    },

    // Função para ir para a página anterior
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--; // Decrementa a página atual
      }
    },

    // Função para buscar usuários da API
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/admin/api/users'); // Requisição GET para buscar usuários
        this.users = response.data;  // Armazena a resposta na variável 'users'
      } catch (error) {
        console.error('Erro ao buscar usuários:', error); // Exibe erro no console se houver falha na requisição
      }
    },
    
    // Método de filtragem de usuários (já está sendo feito no computed)
    filterUsers() {
      // A filtragem já ocorre automaticamente com a propriedade computed 'paginatedUsers', não há necessidade de sobrescrever.
    },

    // Função para bloquear o usuário
    async blockUser(user) {
      try {
        const response = await axios.patch(`http://localhost:3000/admin/api/users/${user._id}`, {
          status: 'inativo'  // Altera o status do usuário para 'inativo'
        });

        if (response.status === 200) {
          user.status = 'inativo';  // Atualiza o status localmente
          alert('Usuário bloqueado com sucesso!');  // Exibe mensagem de sucesso
        }
      } catch (error) {
        console.error('Erro ao bloquear o usuário:', error); // Em caso de erro
        alert('Erro ao bloquear o usuário.');
      }
    },

    // Função para ver o perfil de um usuário
    verPerfil(id) {
      this.$router.push(`/PerfilVistaADM/${id}`);  // Redireciona para a página de perfil do usuário
    }
  }   
};
</script>

<style scoped>
.text-danger {
  color: red;
  font-size: 0.9em;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.pagination button {
  margin: 0 10px;
}

/* Estilo para o ID compactado */
.id-compacto {
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px; /* Ajuste conforme necessário */
  padding: 2px 5px; 
  border-radius: 4px;
}

/* Tooltip estilo padrão (aparece no hover) */
.id-compacto:hover {
  background-color: #d0d0d0;
}

</style>

