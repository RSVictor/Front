<template>
  <!-- Container principal da página -->
  <div class="container">
    <!-- Exibe o nome do usuário na página -->
    <div class="user">
      <p>Bem-vindo, {{ username }}</p>
    </div>

    <!-- Título "Mais Buscados" -->
    <div class="titulo-fav">
      <span>Mais Buscados</span>
    </div>

    <!-- Lista de livros mais buscados -->
    <div class="mais-Buscados mb-5">
      <!-- Cada livro da lista será exibido em um cartão -->
      <div class="card-fav mt-5" v-for="book in mostSearchedBooks" :key="book._id">
        <!-- Exibe a imagem do livro, com caminho de imagem formatado -->
        <img :src="formatImagePath(book.image)" class="card-img-top mt-2" alt="Imagem do Livro">
        
        <!-- Corpo do cartão com o título do livro e o botão para emprestar -->
        <div class="card-body mt-4">
          <h5 class="card-title">{{ book.title }}</h5>
          
          <!-- Botão para emprestar o livro, chama a função 'handleEmprestar' ao ser clicado -->
          <button
            class="btn btn-primary mt-3"
            style="background-color: #335844;" 
            @click="handleEmprestar(book)"
          >
            Emprestar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore'; // Importa a store de autenticação
import { useRouter } from 'vue-router'; // Importa a função para navegação de rotas
import { ref, onMounted } from 'vue'; // Importa funções Vue (ref e onMounted)
import axios from 'axios'; // Importa axios para realizar chamadas HTTP

export default {
  setup() {
    // Inicializa a store de autenticação para acessar dados do usuário
    const authStore = useAuthStore();

    // Cria uma referência reativa para o nome do usuário
    const username = ref(authStore.username); // Obtém o nome do usuário da store de autenticação

    // Inicializa o roteador para navegação de rotas
    const router = useRouter();

    // Cria uma referência reativa para armazenar os livros mais buscados
    const mostSearchedBooks = ref([]); // Lista dos livros mais buscados

    // Função assíncrona para buscar os livros mais buscados da API
    const fetchMostSearchedBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/books/most-searched');
        mostSearchedBooks.value = response.data; // Atualiza a lista de livros mais buscados
      } catch (error) {
        console.error('Erro ao buscar os livros mais buscados', error); // Exibe erro no console se falhar
      }
    };

    // Função para registrar a visualização de um livro
    const incrementSearchCount = async (bookId) => {
      try {
        await axios.post(`http://localhost:3000/api/books/viewed/${bookId}`);
      } catch (error) {
        console.error('Erro ao registrar busca', error); // Exibe erro no console se falhar
      }
    };

    // Quando o componente for montado, faz a chamada para buscar os livros mais buscados e registrar visualizações
    onMounted(() => {
      fetchMostSearchedBooks(); // Busca os livros
      // Registra a visualização de cada livro
      mostSearchedBooks.value.forEach(book => {
        incrementSearchCount(book._id); // Envia uma requisição para registrar a visualização do livro
      });
    });

    // Função chamada ao clicar em "Emprestar" no botão
    const handleEmprestar = (book) => {
      // Verifica se o usuário está logado
      if (!authStore.isLoggedIn) {
        alert('Você precisa fazer login para emprestar um livro.'); // Se não estiver logado, exibe alerta
        router.push('/login'); // Redireciona para a página de login
      } else {
        // Se o usuário estiver logado, redireciona para a página de empréstimo do livro
        router.push({ name: 'emprestimo', params: { bookId: book._id } });
      }
    };

    // Função para formatar o caminho da imagem, se necessário
    const formatImagePath = (path) => {
      // Se o caminho da imagem for relativo, adiciona o prefixo da URL base
      return `http://localhost:3000/${path}`; // Ajuste o caminho conforme a estrutura da sua API
    };

    // Retorna as variáveis e funções para que possam ser usadas no template
    return { mostSearchedBooks, handleEmprestar, formatImagePath, username };
  },
};
</script>

<style scoped>
/* Adicione os estilos conforme necessário */
</style>
