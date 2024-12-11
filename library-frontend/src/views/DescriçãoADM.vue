<template>
  <div class="container">
    <div class="row mt-3">     
      
      <!-- Seção de descrição do livro com imagem e descrição -->
      <div class="container desc p-4 mt-3">
        <div class="card" style="width: 15rem; min-height: 300px;">
          <!-- Exibe a imagem do livro, se disponível -->
          <img v-if="book && book.image" :src="formatImagePath(book.image)" class="card-img-top" alt="Imagem do Livro" style="width: 100%; height: 100%;">
          <!-- Caso a imagem não exista, exibe uma mensagem informando -->
          <p v-else>Imagem não disponível</p>          
        </div>

        <!-- Seção com a descrição do livro -->
        <div class="descricao p-8">
          <div>
            <h3 class="fw-bold mb-0 fs-4 text-body-emphasis">Descrição</h3>
            <div >
               <!-- Exibe a descrição do livro ou uma mensagem de carregamento -->
               <p v-if="book">{{ book.description }}</p>
               <p v-else>Carregando descrição...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção de detalhes do livro -->
      <div class="titulo">Descrição do livro</div>
      <div class="detalhes">
        <ul class="list-group mt-3">
          <li class="list-group-item">Título:</li>
          <li class="list-group-item">Autor:</li>
          <li class="list-group-item">Ano de publicação:</li>
          <li class="list-group-item">Código ISBN:</li>
          <li class="list-group-item">Gênero:</li>          
        </ul>
        <ul class="list-group mt-3 mb-5">
          <!-- Exibe as informações do livro, ou uma mensagem de "Carregando informações" -->
          <li v-if="book" class="list-group-item lista">{{ book.title }}</li>
          <li v-else class="list-group-item lista">Carregando informações</li>

          <li v-if="book" class="list-group-item lista">{{ book.author }}</li>
          <li v-else class="list-group-item lista">Carregando informações</li>

          <li v-if="book" class="list-group-item lista">{{ book.year }}</li>
          <li v-else class="list-group-item lista">Carregando informações</li>

          <li v-if="book" class="list-group-item lista">{{ book.code }}</li>
          <li v-else class="list-group-item lista">Carregando informações</li>

          <li v-if="book" class="list-group-item lista">{{ book.gender }}</li>  
          <li v-else class="list-group-item lista">Carregando informações</li> 
        </ul>
      </div>

      <!-- Exibe a seção de avaliações somente se o usuário for administrador -->
      <div v-if="isAdmin" class="titulo">Avaliações</div>
      <div v-if="isAdmin" v-for="(review, index) in reviews" :key="index" class="avaliacoes mt-3">
        <div class="pessoa">
          <p>{{ review.user }}</p> <!-- Nome do usuário que avaliou -->
        </div>
        <div class="comentario">
          <p>{{ review.text }}</p> <!-- Texto da avaliação -->
        </div>
        <div>
          <p>
            <!-- Exibe estrelas para a avaliação, dependendo da nota -->
            <i v-for="n in 5" :key="n" :class="n <= parseInt(review.rating) ? 'bi bi-star like' : 'bi bi-star'"></i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

  
<script>
import { booksService } from '@/services/api'; // Importa o serviço de livros
import { useAuthStore } from '../stores/authStore'; // Importa a store de autenticação
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore(); // Acessa a store de autenticação
    const router = useRouter(); // Acessa o roteador do Vue
    
    // Verifica se o usuário é um administrador
    const isAdmin = authStore.isLoggedIn && authStore.username === 'ADM'; // Lógica para verificar se o usuário é admin
    
    return { isAdmin }; // Retorna a variável 'isAdmin' para ser usada no template
  },
  
  props: {
    id: {
      type: String,
      required: true // A prop 'id' é obrigatória
    }
  },
  
  data() {
    return {
      book: null, // Armazena os dados do livro
      reviews: [], // Armazena as avaliações do livro
    };
  },
  
  watch: {
    // Quando a prop 'id' mudar, chama a função fetchBook para buscar os dados do livro
    id: 'fetchBook'
  },
  
  mounted() {
    this.fetchBook();  // Chama a função fetchBook quando o componente for montado
  },
  
  methods: {
    // Função para buscar os dados do livro pelo ID
    fetchBook() {
      booksService.fetchBookById(this.id)
        .then(data => {
          this.book = data; // Armazena os dados do livro
          // Se o usuário for administrador, carrega as avaliações
          if (this.$props.isAdmin) {
            this.reviews = data.reviews || []; // Carrega as avaliações, se houver
          }
        })
        .catch(error => console.error("Erro ao buscar dados do livro:", error));
    },
    
    // Função para formatar o caminho da imagem do livro
    formatImagePath(path) {
      return `http://localhost:3000/${path.replace(/\\/g, '/')}`; // Corrige o caminho para uma URL válida
    }
  }
};
</script>

