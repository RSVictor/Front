<template>
  <div class="container">
    <div class="user">
      <p>Bem-vindo, Usuário!</p>
    </div>

    <div class="titulo-emp">
      <span>Finalizar Empréstimo</span>
    </div>

    <div class="titulo-emprestimo mt-5">
      <div class="text-emp">Descrição</div>
      <div class="text-emp">Data do empréstimo</div>
      <div class="text-emp">Data de devolução</div>
      <div class="text-emp">Opção</div>
    </div>

    <div class="descricao-emprestimo mt-3">
      <div class="card-emp">
        <img src="#" class="card-img-top mt-2" style="height: 170px;" alt="Java Guia do Programador">
        <div>
          <h5 class="card-title mt-3">Java Guia do Programador</h5>
        </div>
      </div>

      <div class="emp-data-emp">
        <div class="data">25/08/2008</div>
      </div>

      <div class="emp-data-dev">
        <div class="data">25/08/2008</div>
      </div>

      <div class="emp-data">
        <div class="icon-emp">
          <a href="#" class="btn btn-primary" style="background-color: red; width: 100px; border: none;">
            <i class="bi bi-trash"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="button-favorito mt-5">
      <div class="button-salvar">
        <router-link to="/" class="button-link">
          <i class="bi bi-plus-lg"></i>
          <span class="button-text">Adicionar</span>
        </router-link>
      </div>
      <div class="button-excluir">
        <router-link to="#" class="button-link">
          <i class="bi bi-x-lg"></i>
          <span class="button-text">Cancelar</span>
        </router-link>
      </div>
      <div class="button-salvar">
        <router-link to="/emprestimo" class="button-link" @click="handleEmprestar">
          <i class="bi bi-check-lg"></i>
          <span class="button-text">Confirmar</span>
        </router-link>
      </div>
    </div>
  </div>

</template>

<script>
import { useAuthStore } from '../stores/authStore'; // ajuste o caminho se necessário
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    // Função que será chamada quando o usuário tentar realizar o empréstimo
    const handleEmprestar = () => {
      if (!authStore.isLoggedIn) {
        alert('Você precisa fazer login para emprestar um livro.');
        router.push('/login'); // Redireciona para a página de login caso não esteja autenticado
      } else {
        // Exemplo de como seria a lógica para realizar o empréstimo
        // Aqui você pode adicionar a lógica para confirmar o empréstimo do livro
        alert('Empréstimo realizado!');
        router.push('/historico'); // Redireciona para a página de histórico de empréstimos
      }
    };

    return { handleEmprestar };
  }
};
</script>
