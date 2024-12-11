// Importa o arquivo CSS para aplicar estilos globais à aplicação
import './assets/style.css'

// Importa o Bootstrap, que é uma biblioteca CSS e JS popular para design responsivo e componentes prontos
import 'bootstrap';

// Importa a função 'createApp' do Vue, que cria uma instância da aplicação Vue
import { createApp } from 'vue';

// Importa 'createPinia' do Pinia, que é uma biblioteca de gerenciamento de estado para Vue 3
import { createPinia } from 'pinia';

// Importa o componente raiz da aplicação Vue (App.vue)
import App from './App.vue';

// Importa o roteador configurado da aplicação (responsável pela navegação entre as páginas)
import router from './router';

// Cria a instância da aplicação Vue com o componente raiz 'App'
const app = createApp(App);

// Cria uma instância do Pinia, que gerenciará o estado da aplicação
const pinia = createPinia();

// Adiciona o Pinia como o sistema de gerenciamento de estado da aplicação
app.use(pinia);

// Adiciona o roteador (router) para permitir navegação entre as páginas da aplicação
app.use(router);

// Monta a aplicação Vue na div com id 'app' no HTML (tornando o Vue ativo na página)
app.mount('#app');
