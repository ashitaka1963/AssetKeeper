import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import AccountView from '../views/AccountView.vue';
import OwnersView from '../views/OwnersView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'LoginView',
    //   component: LoginView
    // },
    {
      path: '/',
      name: 'DashboardView',
      component: DashboardView
    },
    {
      path: '/Account/:id',
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
      path: '/Owners',
      name: 'OwnersView',
      component: OwnersView
    }
  ]
});

export default router;
