import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
// import { validateUserToken } from '@/utils/user';
// ... 其他导入保持不变 ...
import { ElLoading } from 'element-plus';
// import MercariList from '@/pages/Test/MercariList.vue';
// import AprilFoolActivity from '@/components/aprilfool/AprilFoolActivity.vue';
// import path from 'path';

const routes = [
    {
        path: '/user/center',
        name: 'userCenter',
        children: [
            {
                path: 'main',
                name: 'userCenterMain',
                component: () =>{
                    const loading = ElLoading.service({
                        text: '加载用户中心...',
                        background: 'rgba(255, 255, 255, 0.7)'
                    });
                    return import('@/pages/UserCenter/UserCenterContainer.vue').finally(() => {
                        loading.close();
                    });
                }
            },
            {
                path: 'upload/data',
                name: 'userCenterUploadData',
                component: () => {
                    const loading = ElLoading.service({
                        text: '加载提交数据...',
                        background: 'rgba(255, 255, 255, 0.7)'
                    });
                    return import('@/pages/Common/UploadMainData.vue').finally(()=>{
                        loading.close();
                    })
                }
            },
            {
                path: 'upload/article',
                name: 'userCenterUploadArticle',
                component: () => import('@/pages/Common/UploadMainArticle.vue')
            }
        ],
        beforeEnter: (to, from, next) => {
            next()
        }
    },
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
        beforeEnter: async (to, from, next) => {
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
    {
        path: '/Post',
        name: 'post',
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
        path: '/user',
        name: 'User',
        children: [
            {
                path: 'register',
                name: 'UserRegister',
                component: () => import('@/pages/User/UserNewNewRegister.vue'),
            },
            {
                path: 'login',
                name: 'UserLogin',
                component: () => import('@/pages/User/UserNewLogin.vue'),
            },
            {
                path: 'comments',
                name: 'userComments',
                component: () => import('@/pages/User/UserComments.vue')
            },
            {
                path: 'profile',
                name: 'userProfile',
                component: () => import('@/pages/User/Profile/UserProfileContainer.vue'),
            },
            // 添加新的路由配置
            {
                path: 'profile/submit',
                name: 'UserSubmitData',
                component: () => import('@/pages/User/Profile/UserSubmitData.vue'),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'post-record',
                name: 'userPostRecord',
                component: () => {
                    const loading = ElLoading.service({
                        text: '加载中...',
                        background: 'rgba(255, 255, 255, 0.7)'
                    });
                    return import('@/pages/User/Post/UserPostRecord.vue').finally(() => {
                        loading.close();
                    });
                },
                beforeEnter: (to, from, next) => {
                    document.title = '发表记录';
                    next();
                },
            },
        ]
    },
    // 将文章相关路由合并为子路由
    {
        path: '/co',
        name: 'content',
        beforeEnter: (to, from, next) => {
            document.title = 'Wonderlands×Sekai⭐Articles!'
            next()
        },
        children: [
            {
                path: 'articles',
                name: 'articles',
                component: () => import('@/pages/Test/TestArticleList.vue'),
            },
            {
                path: 'articles/detail/:id',
                name: 'articleDetail',
                props: true,
                component: () => {
                    const loading = ElLoading.service({
                        text: '加载文章详情中...',
                        background: 'rgba(255, 255, 255, 0.7)'
                    });
                    return import('@/pages/Test/TestArticleDetail.vue').finally(() => {
                        loading.close();
                    });
                },
            }
        ]
    },
    {
        path: '/c',
        name: 'collection',
        beforeEnter: (to, from, next) => {
            document.title = 'Wonderlands×Sekai⭐Collection!'
            next()
        },
        children: [
            {
                path: 'box',
                name: 'collectionBox',
                component: () => import('@/pages/Collection/Collection.vue')
            },
            {
                path: 'detail/:id',
                name: 'collectionDetail',
                props: true,
                component: () => import('@/pages/Collection/CollectionDetailPage.vue')
            },
            {
                path: 'add',
                name: 'collectionAdd',
                component: () => import('@/pages/Collection/CollectionPost.vue')
            }
        ]
    }
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



