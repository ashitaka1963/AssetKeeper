import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import AccountDetailView from '../views/AccountDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DashboardView',
      component: DashboardView
    },
    {
      path: '/AccountDetailView/:id',
      name: 'AccountDetailView',
      component: AccountDetailView,
      props: (routes) => {
        const idNunm = Number(routes.params.id);
        return {
          id: idNunm
        };
      }
    }
  ]
});

export default router;
