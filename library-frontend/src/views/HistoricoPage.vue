<template>
  <!-- Container principal da página -->
  <div class="container">

    <!-- Seção de boas-vindas ao usuário -->
    <div class="user">
      <!-- Exibe uma saudação com o nome do usuário logado -->
      <p>Bem-vindo, {{  }}</p>
    </div>

    <!-- Seção de editoras -->
    <div class="row mt-3">
      <!-- Título da seção -->
      <span>Editoras</span>

      <!-- Exibe uma linha de círculos representando editoras -->
      <div class="mt-3 mb-5 row circulos">
        <!-- Cada div com a classe 'circle' representa uma editora, com cor de fundo diferente -->
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

      <!-- Título da seção de empréstimos -->
      <div class="titulo-emprestimo mt-5">
        <!-- Cabeçalho da tabela de empréstimos -->
        <div class="text-emp">Item</div>
        <div class="text-emp">Autor</div>
        <div class="text-emp">Data de Empréstimo</div>
        <div class="text-emp">Data de Devolução</div>
      </div>

      <!-- Exibição das informações de empréstimos -->
      <!-- Cada div 'descricao-emprestimo' representa um livro emprestado -->
      <div class="descricao-emprestimo mt-3">
        <!-- Cartão do livro com a imagem e o título -->
        <div class="card-emp">
          <img src="#" class="card-img-top mt-2" style="height: 170px;" alt="Use a Cabeça Python">
          <div>
            <h5 class="card-title mt-3">Use a Cabeça Python</h5>
          </div>
        </div>

        <!-- Informações sobre o autor -->
        <div class="hist-autor">
          <div class="hist-autor-nome">Autor: Maria Oliveira</div>
        </div>

        <!-- Informações sobre as datas de empréstimo e devolução -->
        <div class="emp-data-emp">
          <div class="data">Data de Empréstimo: 01/09/2008</div>
        </div>

        <div class="emp-data-dev">
          <div class="data">Data de Devolução: 01/10/2008</div>
        </div>
      </div>

      <!-- Outro livro com as mesmas informações -->
      <div class="descricao-emprestimo mt-3">
        <div class="card-emp">
          <img src="#" class="card-img-top mt-2" style="height: 170px;" alt="Programador Autodidata">
          <div>
            <h5 class="card-title mt-3">Programador Autodidata</h5>
          </div>
        </div>

        <div class="hist-autor">
          <div class="hist-autor-nome">Autor: João Sousa</div>
        </div>

        <div class="emp-data-emp">
          <div class="data">Data de Empréstimo: 15/09/2008</div>
        </div>

        <div class="emp-data-dev">
          <div class="data">Data de Devolução: 15/10/2008</div>
        </div>
      </div>

    </div>
  </div>

</template>

