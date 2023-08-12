import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import AccountView from '../views/AccountView.vue';
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
      path: '/AccountView/:id',
      name: 'AccountView',
      component: AccountView,
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
