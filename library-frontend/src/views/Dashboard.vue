<template>
  <div class="container">
    <!-- Saudação ao usuário, mostrando seu nome -->
    <div class="user">
      <p>Bem-vindo, {{ username }}! </p>
    </div>

    <!-- Botões para navegar pelas seções de livros, usuários e adicionar livros -->
    <div class="titulo-adm-button mt-2" style="display: flex; justify-content: center;">
      <div class="button-adm">
        <router-link to="/listalivro">Livros</router-link>
      </div>
      <div class="button-adm">
        <router-link to="/listaUser">Usuários</router-link>
      </div>
      <div class="button-adm">
        <router-link to="/adicionarLivro">Adicionar Livros</router-link>
      </div>

      <!-- Botão para enviar notificação -->
      <div>
        <button class="button-adm" style="color: white; border: none; margin-left: auto; display: block;" @click="showNotificationInput = !showNotificationInput">
          Enviar Notificação
        </button>
      </div>
    </div>

    <!-- Exibe o input para enviar notificação se showNotificationInput for verdadeiro -->
    <div v-if="showNotificationInput" class="row">
      <span>Enviar Notificação</span>
      <div class="col-12">
        <input 
          type="text" 
          v-model="newNotification"  
          placeholder="Digite a mensagem da notificação..." 
          class="form-control"
        />
        <!-- Botão para enviar a notificação -->
        <button @click="sendNotification" class="btn btn-custom-green mt-2">Enviar</button>
      </div>
    </div>

    <!-- Painel de informações -->
    <div class="painel mt-3 mb-5">
      <!-- Card para exibir a quantidade de livros -->
      <div class="dashboard">
        <span  class="titulo-card">Livros</span>
        <div class="icon-container">
          <i class="fas fa-book"></i>
        </div>        
        <p>{{ totalLivros }}</p> <!-- Exibe a quantidade de livros cadastrados -->
      </div>

      <!-- Card para exibir a quantidade de usuários -->
      <div class="dashboard">
        <span  class="titulo-card">Usuários </span>
        <div class="icon-container">
          <i class="fas fa-users"></i>
        </div>        
        <p>{{ totalUsuarios }}</p> <!-- Exibe a quantidade de usuários cadastrados -->
      </div>

      <!-- Card para exibir a quantidade de livros emprestados -->
      <div class="dashboard">
        <span class="titulo-card">Livros emprestados</span>
        <div class="icon-container">
          <i class="fas fa-hand-holding-usd"></i>
        </div>       
        <p>{{ totalLivrosEmprestados }}</p> <!-- Exibe a quantidade de livros emprestados -->
      </div>
    
    </div>
  </div>
</template>




<script>
import { ref, onMounted } from 'vue';  // Importa funções do Vue 3 para reatividade e ciclo de vida
import { useAuthStore } from '../stores/authStore'; // Importa a store de autenticação
import axios from 'axios';  // Biblioteca para realizar requisições HTTP
import { useNotificationStore } from '../stores/notificationStore'; // Importa a store de notificações

export default {
  setup() {
    // Acessa a store de autenticação e obtém o nome do usuário
    const authStore = useAuthStore();
    const username = ref(authStore.username); // Nome do usuário

    // Variáveis reativas para armazenar os dados que serão exibidos
    const totalLivros = ref(0);  // Contador de livros
    const totalUsuarios = ref(0);  // Contador de usuários
    const totalLivrosEmprestados = ref(0);  // Contador de livros emprestados
    const newNotification = ref('');  // Notificação a ser enviada
    const showNotificationInput = ref(false);  // Controla a visibilidade do input de notificação

    const notificationStore = useNotificationStore(); // Acessa a store de notificações

    // Função para buscar os dados da API (quantidade de livros, usuários e livros emprestados)
    const getData = async () => {
      try {
        const responseLivros = await axios.get('http://localhost:3000/api/books');
        totalLivros.value = responseLivros.data.length;

        const responseUsuarios = await axios.get('http://localhost:3000/admin/api/users');
        totalUsuarios.value = responseUsuarios.data.length;

        const responseLivrosEmprestados = await axios.get('https://suaapi.com/api/livros/emprestados');
        totalLivrosEmprestados.value = responseLivrosEmprestados.data.length;
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    // Função para enviar a notificação
    const sendNotification = () => {
      if (newNotification.value.trim()) {
        notificationStore.addNotification(newNotification.value); // Chama a store para adicionar a notificação
        alert('Notificação enviada com sucesso!');  // Alerta de sucesso
        newNotification.value = '';  // Limpa o campo de notificação
        showNotificationInput.value = false;  // Fecha o campo de notificação
      } else {
        alert('A mensagem não pode estar vazia.');  // Alerta de erro caso a notificação esteja vazia
      }
    };

    // Chama a função `getData` quando o componente é montado
    onMounted(() => {
      getData();
    });

    return {
      username,  // Retorna o nome do usuário para o template
      totalLivros,  // Contagem de livros
      totalUsuarios,  // Contagem de usuários
      totalLivrosEmprestados,  // Contagem de livros emprestados
      newNotification,  // Notificação a ser enviada
      sendNotification,  // Função para enviar a notificação
      showNotificationInput  // Controle da visibilidade do input de notificação
    };
  },
};
</script>



<style scoped>

.icon-container {
  font-size: 36px; /* Tamanho do ícone */
  margin-bottom: 15px; /* Espaço entre o ícone e o título */
}

.titulo-card{  
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px; /* Espaço entre o título e o número */
 text-align: center;
 font-size: 18px;
 font-family: Arial, Helvetica, sans-serif;
 font-weight: bold;
}


.dashboard {
    width: 100%;
    max-width: 250px; /* Mantém o limite de largura */
    height: 200px; /* Permite ajuste dinâmico de altura com base no conteúdo */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Sombra mais suave */
    display: flex;
    flex-direction: column; /* Coloca itens em coluna para maior organização */
    justify-content: center; /* Centraliza verticalmente os itens */
    align-items: center; /* Centraliza horizontalmente os itens */
    border: 1px solid #ccc; /* Bordas mais suaves */
    border-radius: 12px; /* Bordas mais arredondadas */
    padding: 20px; /* Mais espaço interno para respiro */
    background: linear-gradient(135deg, #ffffff, #f0f0f0); /* Gradiente leve para um toque moderno */
    overflow: hidden; /* Remove conteúdo que excede os limites */
    transition: all 0.3s ease; /* Suaviza animações */
}

/* Efeito de hover */
.dashboard:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); /* Sombra mais pronunciada ao passar o mouse */
    transform: scale(1.02); /* Leve aumento no tamanho */
}

.painel{
    width: 100%;
    max-width: 833px; /* Mantém o limite de largura */
    height: auto; /* Permite ajuste dinâmico de altura com base no conteúdo */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Sombra mais suave */
    display: flex;    
    justify-content: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;    
    background-color: #f9f9f9;
    gap: 15px;
}

/* Cores para cada div */
.painel .dashboard:nth-child(1) {
  background: linear-gradient(to bottom,#335844, #93BFA7);/* Gradiente rosa e azul claro */
}

.painel .dashboard:nth-child(2) {
    background: linear-gradient(135deg, #335844, #93BFA7); /* Gradiente lilás e rosa */
}

.painel .dashboard:nth-child(3) {
  background: linear-gradient(to bottom, #335844, #93BFA7); /* Gradiente laranja e branco */
}


.dashboard i {
    font-size: 35px; /* Tamanho dos ícones */
    margin-right: 10px; /* Espaço entre o ícone e o texto */
    color: white; /* Cor do ícone */
}
.dashboard p, span {
    font-size: 35px; /* Tamanho do texto */
    font-weight: bold; /* Deixar o texto em negrito */
    color: white;
}
.dashboard span {
    font-size: 20px; /* Tamanho do texto */
    font-weight: bold; /* Deixar o texto em negrito */
    color: white;
}

.btn-custom-green {
  background-color: #335844; /* Cor de fundo verde */
  color: white; /* Cor do texto branca */
  border: none; /* Remove borda */
}

.btn-custom-green:hover {
  background-color: #335844; /* Mantém a cor de fundo original */
  border: none; /* Remove qualquer borda adicional no hover */
  box-shadow: none; /* Remove a sombra do hover */
  color: white;
}

</style>

