<template>
  <div class="container">
    <!-- Exibe uma mensagem de boas-vindas se o usuário estiver logado -->
    <div class="user" v-if="isLoggedIn">
      <p>Bem-vindo, {{ username }}</p>
    </div>

    <div class="row mt-3">
      <span>Editoras</span>
      <!-- Circulares para mostrar as editoras -->
      <div class="mt-3 mb-5 row circulos">
        <div class="circle" style="background-color: #93BFA7;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #335844;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #93BFA7;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #335844;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #93BFA7;">
          <span>Galáxia dos Livros</span>
        </div>
        <div class="circle" style="background-color: #335844;">
          <span>Galáxia dos Livros</span>
        </div>
      </div>

      <!-- Exibição dos detalhes do livro -->
      <div class="container desc p-4 mt-3">
        <div class="card" style="width: 15rem; min-height: 300px;">
          <!-- Imagem do livro (se disponível) -->
          <img v-if="book && book.image" :src="formatImagePath(book.image)" class="card-img-top" alt="Imagem do Livro" style="width: 100%; height: 100%;" />
          <p v-else>Imagem não disponível</p>
          
          <!-- Botão para emprestar o livro -->
          <button class="btn btn-primary mt-3" style="background-color: #335844; border: none; margin-top: 10px;" @click="handleEmprestar">Emprestar</button>
        </div>

        <!-- Descrição do livro -->
        <div class="descricao p-8">
          <div>
            <h3 class="fw-bold mb-0 fs-4 text-body-emphasis">Descrição</h3>
            <div>
              <p v-if="book">{{ book.description }}</p>
              <p v-else>Carregando descrição...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detalhes do livro -->
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

      <!-- Formulário para deixar uma avaliação -->
      <div v-if="isLoggedIn" class="avaliacao-form mt-4">
        <h4>Deixe sua Avaliação</h4>
        <textarea v-model="newReview.text" class="form-control" rows="3" placeholder="Digite sua avaliação"></textarea>
        <div class="mt-2">
          <label for="rating">Nota:</label>
          <select v-model="newReview.rating" class="form-select" id="rating">
            <option value="" disabled>Selecione</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} estrela(s)</option>
          </select>
        </div>
        <button class="btn btn-success mt-3" @click="submitReview">Enviar Avaliação</button>
      </div>

      <!-- Caso o usuário não esteja logado -->
      <div v-else class="mt-4">
        <p>Faça login para deixar sua avaliação.</p>
      </div>

      <!-- Exibição das avaliações -->
      <div  class="titulo">Avaliações</div>
      <div v-for="(review, index) in reviews" :key="index" class="avaliacoes mt-3">
        <div class="pessoa">
          <p>{{ review.user }}</p> <!-- Nome do usuário que avaliou -->
        </div>
        <div class="comentario">
          <p>{{ review.text }}</p> <!-- Texto da avaliação -->
        </div>
        <div>
          <p>
            <!-- Exibe estrelas de acordo com a nota da avaliação -->
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
import { useRouter, useRoute } from 'vue-router'; // Importa o roteador para navegação
import { ref, onMounted } from 'vue'; // Importa ref e onMounted para reatividade e ciclo de vida

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();  // Para acessar os parâmetros da URL

    // Definindo as variáveis reativas
    const username = ref(authStore.username); // Nome do usuário logado
    const isLoggedIn = ref(authStore.isLoggedIn); // Verifica se o usuário está logado
    const book = ref(null); // Dados do livro
    const reviews = ref([]); // Lista de avaliações
    const newReview = ref({ text: '', rating: '' }); // Avaliação que está sendo criada

    // Função para "emprestar" o livro
    const handleEmprestar = () => {
      if (!authStore.isLoggedIn) {
        alert('Você precisa fazer login para emprestar um livro.');
        router.push('/login');
      } else {
        router.push('/emprestimo');
      }
    };

    // Função para buscar o livro por ID
    const fetchBook = async () => {
      const id = route.params.id; // Obtendo o id da URL
      try {
        const data = await booksService.fetchBookById(id);
        book.value = data;
        reviews.value = data.reviews || []; // Atribuindo as avaliações
      } catch (error) {
        console.error('Erro ao buscar dados do livro:', error);
      }
    };

    // Função para formatar o caminho da imagem
    const formatImagePath = (path) => {
      return `http://localhost:3000/${path.replace(/\\/g, '/')}`; // Formatação da URL da imagem
    };

    // Função para enviar avaliação
    const submitReview = () => {
      if (!newReview.value.text || !newReview.value.rating) {
        alert('Por favor, preencha o comentário e a nota.');
        return;
      }

      const ratingValue = parseInt(newReview.value.rating);

      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        alert('Por favor, escolha uma nota válida (de 1 a 5 estrelas).');
        return;
      }

      const review = {
        user: username.value || 'Usuário Logado',
        text: newReview.value.text,
        rating: ratingValue,
      };

      booksService.addReview(book.value.id, review)
        .then(() => {
          fetchBook(); // Recarregar as avaliações
          newReview.value = { text: '', rating: '' }; // Limpar o formulário de avaliação
          alert('Avaliação enviada com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao enviar avaliação:', error);
          alert('Erro ao enviar avaliação. Tente novamente.');
        });
    };

    // Buscar o livro assim que o componente for montado
    onMounted(() => {
      fetchBook();
    });

    return {
      handleEmprestar,
      isLoggedIn,
      username,
      book,
      reviews,
      newReview,
      formatImagePath,
      submitReview,
    };
  },
};
</script>
