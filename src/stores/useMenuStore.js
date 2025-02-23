import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        activeMenu: ''
    }),
    actions: {
        setActiveMenu(menu) {
            this.activeMenu = menu;
        }
    }
});