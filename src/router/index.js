import { createWebHistory, createRouter } from 'vue-router'
/* Layout */
import Layout from '@/layout'
/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      },
      {
        path: '/purchaseManage/order/addOrder',
        component: () => import('@/views/erp/purchaseManage/order/addOrder'),
        hidden: true,
        meta: { title: '新增采购订单', icon: 'dashboard', affix: true }
      },
      {
        path: '/purchaseManage/order/purchaseOrderShow',
        component: () => import('@/views/erp/purchaseManage/order/purchaseOrderShow'),
        hidden: true,
        meta: { title: '采购订单详情', icon: 'dashboard', affix: true }
      },
      {
        path: '/purchaseManage/purchaseReturn/addAndEditReturnOrder',
        component: () => import('@/views/erp/purchaseManage/purchaseReturn/addAndEditReturnOrder'),
        hidden: true,
        meta: { title: '新增采购退货', icon: 'dashboard', affix: true }
      },
      {
        path: '/purchaseManage/purchaseReturn/purchaseReturnDetail',
        component: () => import('@/views/erp/purchaseManage/purchaseReturn/purchaseReturnDetail'),
        hidden: true,
        meta: { title: '采购退货详情', icon: 'dashboard', affix: true }
      },
      {
        path: '/bom',
        name: 'Bom',
        component: () => import('@/views/erp/bom'),
      },
      {
        path: '/bom/addBom',
        component: () => import('@/views/erp/bom/addBom'),
        hidden: true,
        meta: { title: '新增bom', icon: 'dashboard', affix: true }
      },
      {
        path: '/bom/bomDetail',
        component: () => import('@/views/erp/bom/bomDetail'),
        hidden: true
      },
      {
        path: '/produce/line',
        name: 'Line',
        component: () => import('@/views/erp/produce/line'),
      },
      {
        path: '/produce/plan',
        name: 'Plan',
        component: () => import('@/views/erp/produce/plan'),
        },
      {
        path: '/produce/plan/addPlan',
         component: () => import('@/views/erp/produce/plan/addPlan'),
        hidden: true
      },
      {
        path: '/produce/plan/MRPCompute',
        component: () => import('@/views/erp/produce/plan/MRPCompute'),
        hidden: true
      },
      {
        path: '/produce/plan/MRPCompute/lackOrPlan',
        component: () => import('@/views/erp/produce/plan/MRPCompute/lackOrPlan'),
        hidden: true
      },
      {
        path: '/produce/plan/planDetail',
        component: () => import('@/views/erp/produce/plan/planDetail'),
        hidden: true
      },
      {
        path: '/outAddManage/addStock',
        name: 'AddStock',
        component: () => import('@/views/erp/outAddManage/addStock')
      },
      {
        path: '/outAddManage/addStock/producePlanAddStock',
        component: () => import('@/views/erp/outAddManage/addStock/producePlanAddStock'),
        hidden: true,
        meta: { title: '生产计划入库', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/addStock/producePlanAddStock/producePlanAddStockDetail',
        component: () => import('@/views/erp/outAddManage/addStock/producePlanAddStock/producePlanAddStockDetail'),
        hidden: true,
        meta: { title: '生产计划入库', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/addStock/purchaseAddStock',
        component: () => import('@/views/erp/outAddManage/addStock/purchaseAddStock'),
        hidden: true,
        meta: { title: '采购入库', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/addStock/purchaseAddStock/purchaseAddStockDetail',
        component: () => import('@/views/erp/outAddManage/addStock/purchaseAddStock/purchaseAddStockDetail'),
        hidden: true,
        meta: { title: '采购入库详情', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/outStock',
        name: 'OutStock',
        component: () => import('@/views/erp/outAddManage/outStock')
      },
      {
        path: '/outAddManage/outStock/producePlanOutStock',
        component: () => import('@/views/erp/outAddManage/outStock/producePlanOutStock'),
        hidden: true,
        meta: { title: '生产计划出库', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/outStock/producePlanOutStock/producePlanOutStockDetail',
        component: () => import('@/views/erp/outAddManage/outStock/producePlanOutStock/producePlanOutStockDetail'),
        hidden: true,
        meta: { title: '生产计划出库详细', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/outStock/salesOutStock',
        component: () => import('@/views/erp/outAddManage/outStock/salesOutStock'),
        hidden: true,
        meta: { title: '销售出库', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/outStock/salesOutStock/salesOutStockDetail',
        component: () => import('@/views/erp/outAddManage/outStock/salesOutStock/salesOutStockDetail'),
        hidden: true,
        meta: { title: '销售出库详细', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/outStock/purchaseReturnOutStock',
        component: () => import('@/views/erp/outAddManage/outStock/purchaseReturnOutStock'),
        hidden: true,
        meta: { title: '采购退货出库', icon: 'dashboard', affix: true }
      },
      {
        path: '/outAddManage/outStock/purchaseReturnOutStock/purchaseReturnOutStockDetail',
        component: () => import('@/views/erp/outAddManage/outStock/purchaseReturnOutStock/purchaseReturnOutStockDetail'),
        hidden: true,
        meta: { title: '采购退货出库详细', icon: 'dashboard', affix: true }
      },
      {
        path: '/salesManage/sales/addSales',
        component: () => import('@/views/erp/salesManage/sales/addSales'),
        hidden: true,
        meta: { title: '新增销售订单', icon: 'dashboard', affix: true }
      },
      {
        path: '/salesManage/sales/salesDetail',
        component: () => import('@/views/erp/salesManage/sales/salesDetail'),
        hidden: true,
        meta: { title: '销售订单详情', icon: 'dashboard', affix: true }
      },
    ]
  },

  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },

  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router;
