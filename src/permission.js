import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Notification } from 'element-ui'
// import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login',
  '/',
  '/home/index', // 主页
  '/home/ques_more/',
  '/SQu/index', // 拍照搜题
  '/more/index', // 更多
  '/merchant/index', // 商家
  '/about/index', // 关于帮助
  '/home/search', // 搜索页
  '/home/question_details/', // 题目详情 有id的加上/
  '/home/mistake/', // 题目详情 有id的加上/
  '/home/other_answer/' // 题友解答
] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  // console.log(store.getters.user)
  // console.log(store.getters.addRouters[0])
  if (!store.getters.addRouters[0] && to.path !== '/login') {
    var roles = ['']
    if (store.getters.user.roles) {
      roles = store.getters.user.roles
    } else {
      roles = ['']
    }
    store.dispatch('GenerateRoutes', roles).then(() => {
      router.addRoutes(store.getters.addRouters)
      // 动态路由 刷新致命点
      router.addRoutes([{ path: '*', redirect: '/', hidden: true }])
      next({ ...to, replace: true })
      // console.log(router)
    })
  }
  if (!store.getters.user.Id) {
    if (whiteList.indexOf(to.path.replace(/\d+/g, '')) !== -1) {
      next()
    } else {
      next('/login')
      // location.reload()
      Notification.closeAll()
      Notification.info('请先登录！')
    }
  } else {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (to.path.replace(/\d+/g, '') === '/user/others/' && to.params.id === store.getters.user.Id) {
        next({ path: '/user/index' })
      }
      // console.log(to)
      next()
    }
  }

  NProgress.done()
  // next() !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // next()
})

