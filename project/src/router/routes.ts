//对外暴露配置的路由
export const allRouters = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'login',
        meta: {
            title: '登录',
            hide: true,
            icon: 'Promotion'
        }
    },
    {
        path: '/',
        component: () => import('@/components/layout/index.vue'),
        name: 'layout',
        redirect: '/home',
        meta: {
            title: '',
            hide: false,
            icon: ''
        },
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    hide: false,
                    icon: 'Histogram'
                },
            }
        ]
    },
    {
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name: 'Screen',
        meta: {
            hide: false,
            title: '数据大屏',
            icon: 'platform'
        }
    },
    {
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            title: '404',
            hide: true,
            icon: 'DocumentDelete'
        },
    }
]

export const asyncRouters=[
    {
        path: '/acl',
        component: () => import('@/components/layout/index.vue'),
        name: 'Acl',
        meta: {
            title: '权限管理',
            hide: false,
            icon: 'Lock'
        },
        children: [
            {
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    hide: false,
                    icon: 'User'
                }
            },
            {
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    hide: false,
                    icon: 'UserFilled'
                }
            },
            {
                path: '/acl/permission',
                component: () => import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    hide: false,
                    icon: 'Monitor'
                }
            }
        ]
    },
    {
        path:'/product',
        component:()=>import('@/components/layout/index.vue'),
        name:'Product',
        meta:{
            title:'商品管理',
            hide:false,
            icon:'Goods'
        },
        children:[
            {
                path:'/product/trademark',
                component:()=>import('@/views/product/trademark/index.vue'),
                name:'Trademark',
                meta:{
                    title:'品牌管理',
                    //如果不写hide，寻找找不到就是undefined也就是false，方便理解还是写上
                    hide:false,
                    icon:'ShoppingCartFull'
                },
            },
            {
                path:'/product/attr',
                component:()=>import('@/views/product/attr/index.vue'),
                name:'Attr',
                meta:{
                    title:'属性管理',
                    hide:false,
                    icon:'ChromeFilled'
                },
            },
            {
                path:'/product/spu',
                component:()=>import('@/views/product/spu/index.vue'),
                name:'Spu',
                meta:{
                    title:'SPU管理',
                    hide:false,
                    icon:'Calendar'
                },
            },
            {
                path:'/product/sku',
                component:()=>import('@/views/product/sku/index.vue'),
                name:'Sku',
                meta:{
                    title:'sku管理',
                    hide:false,
                    icon:'Orange'
                },
            }
        ]        
    }
]

export const anyRouters=[
    {
        //没有匹配的路由时
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        meta: {
            title: '任意路由',
            hide: true,
            icon: 'DataLine'
        },
    }
]