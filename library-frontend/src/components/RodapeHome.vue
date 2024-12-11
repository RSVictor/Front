<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

// Usamos useRoute para acessar a rota atual
const route = useRoute();

</script>
<template>
    <div v-if="route.name !== 'login' && route.name !== 'cadastro'"  class="barra-verde mt-3">
      <p>Redes Sociais
        <i class="bi bi-facebook"></i>
        <i class="bi bi-linkedin"></i>
        <i class="bi bi-instagram"></i>
      </p>


      <div class="rodape">
        <p>© [2024] [BookMange]. Todos os direitos reservados.</p>
      </div>
    </div>


</template>
