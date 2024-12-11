import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/homeADM',
    name: 'homeADM',
    component: () => import('../views/HomePageADM.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/favoritos',
    name: 'favoritos',
    component: () => import('../views/FavoritosPage.vue'),
    meta: { requiresAuth: true }
    
  },
  {
    path: '/descricao/:id',
    name: 'descricao',
    component: () => import('../views/DescricaoPage.vue'),
    props: true,  // Isso permite que o parâmetro `id` seja passado como prop para o componente
  },
  {
    path: '/descricaoADM/:id',
    name: 'descricaoADM',
    component: () => import('../views/DescriçãoADM.vue'),
    props: true,  // Isso permite que o parâmetro `id` seja passado como prop para o componente
  },
  {
    path: '/emprestimo',
    name: 'emprestimo',
    component: () => import('../views/EmprestimoPage.vue'),
    meta: { requiresAuth: true }
    
  },
  {
    path: '/historico',
    name: 'historico',
    component: () => import('../views/HistoricoPage.vue'),
    meta: { requiresAuth: true,  }
   
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: () => import('../views/CadastroPage.vue')

  },
  {
    path: '/adicionarLivro',
    name: 'adicionarLivro',
    component: () => import('../views/AdicionarLivrosPage.vue'),    
    meta: { requiresAuth: true }
  },
  {
    path: '/editarlivro/:id',
    name: 'editarlivro',
    component: () => import('../views/EditarLivro.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/listalivro',
    name: 'listalivro',
    component: () => import('../views/ListaLivrosPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/listaUser',
    name: 'listaUser',
    component: () => import('../views/ListaUserPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historicoADM',
    name: 'historicoADM',
    component: () => import('../views/HistoricoVistaAdm.vue'), // Ajuste para o componente correto
    meta: { requiresAuth: true }
  },
  {
    path: '/PerfilVistaADM/:id',
    name: 'PerfilVistaADM',
    component: () => import('../views/PerfilVistaAdmPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/PerfilUser',
    name: 'PerfilUser',
    component: () => import('../views/PerfilUser.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/maisBuscados',
    name: 'maisBuscados',
    component: () => import('../views/MaisBuscadosPage.vue')
  },
];

// Criação do roteador
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Proteção das rotas
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
