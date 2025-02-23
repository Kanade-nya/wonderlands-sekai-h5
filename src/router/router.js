import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import About from "@/pages/About.vue";
import Home from "@/pages/Home.vue";
import Pages from "@/pages/Pages.vue";
import Comments from "@/pages/Comments.vue";

const routes = [
    {
        path: '/pages/:page_id',
        name: 'pages',
        component: () => import('@/pages/Pages.vue'),
        beforeEnter: (to, from, next) => {
            document.title = 'Wonderlands×Sekai⭐Gallery Wonderhoy——'
            next()
        },
    },
    {
        path: '/',
        name: 'home',
        component: () => import('@/pages/Home.vue'),
        beforeEnter: (to, from, next) => {
            document.title = 'Wonderlands×Sekai⭐Gallery Wonderhoy——'
            next()
        },
    },

    {
        path: '/about',
        name: 'about',
        component: () => import('@/pages/About.vue'),
        beforeEnter: (to, from, next) => {
            document.title = 'Wonderlands×Sekai⭐About~?'
            next()
        },
    },
    {
        path: '/comments',
        name: 'comments',
        component: () => import('@/pages/Comments.vue'),
        beforeEnter: (to, from, next) => {
            document.title = 'Wonderlands×Sekai⭐Comments!'
            next()
        },
    },
    {
        path: '/details/:id',
        name: 'details',
        props: true,
        component: () => import('@/pages/Details.vue'),
        // beforeEnter: (to, from, next) => {
        //     console.log(from.params)
        //     next()
        // },
    },
    {
        path: '/token',
        name: 'token',
        component: () => import('@/pages/Token.vue')
    },
    {
        path: '/uploader',
        name: 'uploader',
        component: () => import('@/pages/Uploader.vue'),
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('token') === '9.09') {
                next()
            } else {
                next('/token')
            }
        }
    },

    // {
    //     path: '/Post/information',
    //     name: 'postInformation',
    //     component: () => import('@/pages/Post/PostInformation.vue'),
    //     beforeEnter: (to, from, next) => {
    //         if (localStorage.getItem('token') === '9.09') {
    //             next()
    //         } else {
    //             next('/token')
    //         }
    //     }
    // },
    // {
    //     path: '/Post/editor',
    //     name: 'postEditor',
    //     component: () => import('@/pages/Post/PostEditorMain.vue'),
    //     beforeEnter: (to, from, next) => {
    //         if (localStorage.getItem('token') === '9.09') {
    //             next()
    //         } else {
    //             next('/token')
    //         }
    //     }
    // },
    {
        path: '/Post',
        name: 'post',
        // component: () => import('@/pages/Post/PostLayout.vue'),
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('token') === '9.09') {
                next()
            } else {
                next('/token')
            }
        },
        children: [
            {
                path: 'information',
                name: 'postInformation',
                component: () => import('@/pages/Post/PostInformation.vue')
            },
            {
                path: 'editor',
                name: 'postEditor',
                component: () => import('@/pages/Post/PostEditor.vue')
            }
        ]
    },
    {
        path: '/type/add',
        name: 'typeAdd',
        component: () => import('@/pages/TypeAdd.vue'),
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('token') === '9.09') {
                next()
            } else {
                next('/token')
            }
        }
    },
    {
        path: '/filter/:type/pages/:page_id',
        name: 'filter',
        props: true,
        component: () => import('@/pages/Filter.vue')
    },
    {
        path: '/search/:content/pages/:page_id',
        name: 'search',
        props: true,
        component: () => import('@/pages/Search.vue')
    },
    {
        path: '/u',
        name: 'u',
        children: [
            {
                path: 'register',
                name: 'register',
                component: () => import('@/pages/User/UserRegister.vue'),
            },
            {
                path: 'login',
                name: 'login',
                component: () => import('@/pages/User/UserLogin.vue'),
            },
            {
                path: 'comments',
                name: 'userComments',
                component: () => import('@/pages/User/UserComments.vue')
            }
        ]


    },
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})
router.afterEach((to, from, next) => {
    document.querySelector("body").setAttribute("style", "overflow: auto !important;")
});

export default router;

