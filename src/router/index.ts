import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import AccountDetailView from '../views/AccountDetailView.vue';
import UsersView from '../views/UsersView.vue';

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
        // const idNunm = Number(routes.params.id);
        // return {
        //   id: idNunm
        // };
        return {
          id: routes.params.id
        };
      }
    },
    {
      path: '/Users',
      name: 'UsersView',
      component: UsersView
    }
  ]
});

export default router;
