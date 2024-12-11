<template>
  <!-- Container principal da página -->
  <div class="container">
    
    <!-- Seção de boas-vindas ao usuário -->
    <div class="user">
      <!-- Exibe uma mensagem de boas-vindas -->
      <p>Bem-vindo, Usuário!</p>
    </div>

    <!-- Seção de botões para navegação do administrador -->
    <div class="titulo-adm-button">
      <!-- Botões de navegação para diferentes páginas administrativas -->
      <div class="button-adm">
        <!-- Rota para a lista de livros -->
        <RouterLink to="/listalivro">Livros</RouterLink>
      </div>
      <div class="button-adm">
        <!-- Rota para a lista de usuários -->
        <RouterLink to="/listaUser">Usuários</RouterLink>
      </div>
      <div class="button-adm">
        <!-- Rota para adicionar um novo livro -->
        <RouterLink to="/adicionarLivro">Adicionar Livros</RouterLink>
      </div>
    </div>

    <!-- Título da seção de histórico de empréstimos -->
    <div class="titulo-emp mt-4">
      <span>Histórico de Empréstimo do Usuário(a)</span>
    </div>

    <!-- Cabeçalho da tabela de histórico de empréstimos -->
    <div class="titulo-emprestimo mt-5">
      <!-- Títulos das colunas da tabela -->
      <div class="text-emp">Item</div>
      <div class="text-emp">Autor</div>
      <div class="text-emp">Data de Empréstimo</div>
      <div class="text-emp">Data Devolvida</div>
    </div>

    <!-- Exibição do histórico de empréstimos -->
    <!-- Cada div com a classe 'descricao-emprestimo' representa um empréstimo realizado -->

    <div class="descricao-emprestimo mt-3">
      <!-- Cartão do primeiro livro do histórico -->
      <div class="card-emp">
        <!-- Imagem do livro, que está com o src vazio -->
        <img src="" class="card-img-top mt-2" style="height: 170px;" alt="Java Guia do Programador">
        <div>
          <!-- Título do livro -->
          <h5 class="card-title mt-3">Java Guia do Programador</h5>
        </div>
      </div>

      <!-- Informações sobre o autor do livro -->
      <div class="hist-autor">
        <div class="hist-autor-nome">Autor: José da Silva</div>
      </div>

      <!-- Informações sobre a data de empréstimo -->
      <div class="emp-data-dev">
        <div class="data">Data de Empréstimo: 25/08/2008</div>
      </div>

      <!-- Informações sobre a data de devolução -->
      <div class="emp-data-emp">
        <div class="data">Data Devolvida: 25/09/2008</div>
      </div>
    </div>

    <!-- Segundo livro no histórico -->
    <div class="descricao-emprestimo mt-3">
      <div class="card-emp">
        <!-- Imagem do livro, com o src vazio -->
        <img src="" class="card-img-top mt-2" style="height: 170px;" alt="Use a Cabeça Python">
        <div>
          <!-- Título do livro -->
          <h5 class="card-title mt-3">Use a Cabeça Python</h5>
        </div>
      </div>

      <!-- Informações sobre o autor -->
      <div class="hist-autor">
        <div class="hist-autor-nome">Autor: Maria Oliveira</div>
      </div>

      <!-- Data de empréstimo -->
      <div class="emp-data-dev">
        <div class="data">Data de Empréstimo: 01/09/2008</div>
      </div>

      <!-- Data de devolução -->
      <div class="emp-data-emp">
        <div class="data">Data Devolvida: 01/10/2008</div>
      </div>
    </div>

    <!-- Terceiro livro no histórico -->
    <div class="descricao-emprestimo mt-3">
      <div class="card-emp">
        <!-- Imagem do livro, com o src vazio -->
        <img src="" class="card-img-top mt-2" style="height: 170px;" alt="Programador Autodidata">
        <div>
          <!-- Título do livro -->
          <h5 class="card-title mt-3">Programador Autodidata</h5>
        </div>
      </div>

      <!-- Informações sobre o autor -->
      <div class="hist-autor">
        <div class="hist-autor-nome">Autor: João Sousa</div>
      </div>

      <!-- Data de empréstimo -->
      <div class="emp-data-dev">
        <div class="data">Data de Empréstimo: 15/09/2008</div>
      </div>

      <!-- Data de devolução -->
      <div class="emp-data-emp">
        <div class="data">Data Devolvida: 15/10/2008</div>
      </div>
    </div>

  </div>
</template>
