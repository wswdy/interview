Vue-Router

vue-router中hash模式和history模式有什么区别？  

- hash模式最显著的特征就是会地址中会有#号，#后面的值就是hash值，hash虽然出现在url中，
但实际上只是用hash模拟了完整的url，只有hash前面的基地址会包含在请求中，因此hash改变不影响http请求，不会重新加载页面。
- history则是利用了H5的History Interface新增方法pushState和replaceState。
  
    history.pushState(data, title [, url])：往历史记录堆栈顶部添加一条记录； data会在onpopstate事件触发时作为
参数传递过去；title为页面标题，当前所有浏览器都会 忽略此参数；url为页面地址，可选，缺省为当前页地址；

    history.replaceState(data, title [, url]) ：更改当前的历史记录，参数同上；
     
    history.state：用于存储以上方法的data数据，不同浏览器的读写权限不一样；
    
    window.onpopstate：响应pushState或replaceState的调用
    
    因此，history模式的实现原理就是通过pushState把页面的状态保存在state对象中，当页面的url再变回这个url时，history.state取到这个state对象，从而可以对页面状态进行还原
    并且滚动条的位置，阅读进度，组件的开关的这些页面状态都可以存储到state的里面。但是它也有缺点，就是它虽然不怕前进后退，但是在浏览器刷新的时候，容易发生页面404，要解决这个问题
    就要后端做相关的配置，比如当刷新页面的url匹配不到相应的资源时，给一个默认重定向的404页面。

***************
vue-router的基本原理？如何手动实现Vue-Router？ 

- 基于hash模式和history模式的两种路由，实现了更新视图但不重新请求页面，是前端路由原理的核心
- 手动实现Vue-Router：

    首先，我们知道vue-router是通过Vue.use()方法把router挂载到Vue实例上的，这里我们也用同样的方法把自定义的路由与Vue实例联系起来
    ```
    import Vue from 'vue'
    import Home from './views/Home.vue'
    import MRouter from './my-router'
    
    // Vue.use实际执行的是插件模块的install方法，会把Vue实例传入模块，因此my-router内部一定有一个install方法
    // 在插件的install方法中，可以通过Vue.minxin对Vue类进行方法的拓展
    Vue.use(MRouter)
    
    // 路由基本的配置 
    export default new MRouter({
      routes:[
        {
          path:'/',
          component:Home,
          // 这是进入路由之前的生命周期
          beforeEnter(from,to, next){
            // next执行才跳转
            console.log(`beforeEnter from ${from} to ${to}`)
            // 模拟异步
            setTimeout(()=>{
              // 1秒之后再跳转
              // 这段时间可以做任何权限认证等事情
              next()
            },1000)
          }
        },
        {
          path:"/about",
          component:() => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
      ]
    })
    ```
   上面我们在new MRouter的时候，传入了我们页面的路由。既然传入了路由，那么my-router是怎么处理的呢？
   
   ```
    let Vue
    
    class Router {
        static install(_Vue) {
            // _Vue就是从Vue.use传入的Vue实例，在这里单独保存一份。
            // 这里保存一份是为了别的地方还可以使用，而不是每个插件都去import Vue，避免项目打包后体积太大
            Vue = _Vue
            Vue.mixin({
                beforeCreate() {
                    // new MRouter的时候传递的
                    if(this.$options.router){
                        // 通过绑定到Vue.prototype上，可以在页面上直接使用，如{{ $sayHello }}
                        Vue.prototype.$sayHello = '来了老弟'
                        // 因此通过这句代码，可以在页面上使用this.$myRouter,同this.$router
                        // 因此可以使用this.myRouter.push()等方法
                        Vue.prototype.$myrouter = this.$options.router
                        this.$options.router.init()
                    }
                    // console.log(options)
                }
            })
        }
        constructor(options) {
            this.$options = options
            // 把router数组变成map方便查找
            this.routeMap = {}
            // 使用Vue的响应式机制，路由切换的时候，做一些响应
            this.app = new Vue({
                data: {
                    // 默认的根目录
                    current: '/'
                }
            })
    
        }
    
        // 启动整个路由
        // 由插件use负责启动就可以了，在mixin里调用
        init() {
            // 1. 监听hashchange事件
            this.bindEvents()
            // 2. 处理路由表
            this.createRouteMap(this.$options)
            // 3. 初始化组件 router-view 和router-link
            this.initComponent(Vue)
            // 还可以在这里 实现 生命周期，路由守卫
        }
        // 绑定事件
        bindEvents(){
            window.addEventListener('load', this.onHashChange.bind(this), false)
            window.addEventListener('hashchange', this.onHashChange.bind(this), false)
        }
        // 路由的map映射表
        createRouteMap(options) {
            options.routes.forEach(item => {
                this.routeMap[item.path] = item
            })
        }
        // 注册router-link和router-view组件
        initComponent(Vue) {
            Vue.component('router-link', {
                // props:['to']这种写法也可以，但是不严谨
                props: {
                    to: String
                },
                // 使用h新建一个虚拟dom
                // h == createElement
                // h三个参数，
                // 组件名
                // 参数
                // 子元素
                render(h){
                    return h('a',{
                        attrs:{
                            href:'#' + this.to
                        }
                    },[
                        // 默认插槽，不是具名插槽
                        this.$slots.default
                    ])
                }
            })
    
            const _this = this
            Vue.component('router-view', {
                render(h) {
                    var component = _this.routeMap[_this.app.current].component
                    return h(component)
                }
            })
        }
    
        // 获取当前路由的 hash 值
        getHash() {
            return window.location.hash.slice(1) || '/'
        }
        // 简单的push方法，要传query参数之类的也做相应处理就行
        push(url){
            // hash模式直接复制
            window.location.hash  = url
            // 如果是history使用pushState
            // window.history.pushState(null,null,'#/'+url)
        }
        getFrom(e){
            let from, to
            // 这是一个hashchange
            if (e.newURL){
                from = e.oldURL.split('#')[1]
                to = e.newURL.split('#')[1]
            } else {
                // 这是一个第一次加载触发的
                from = ''
                to = location.hash
            }
            return {from,to}
        }
        // 设置当前路径
        onHashChange(e) {
            // 路由跳转马上开始
            // 获取当前的哈希值
            let {from, to} = this.getFrom(e)
            let hash = this.getHash()
            let router = this.routeMap[hash]
            // 修改this.app.current 借用了vue的响应式机制
            // console.log('hash变了')
            if (router.beforeEnter {
                // beforeEnter是new MRouter的时候相应配置的
                // 有beforeEnter 则生命周期
                router.beforeEnter(from, to, () => {
                    // 这就是next() 可以在这里做一下next()相关的拓展处理
                    this.app.current = this.getHash()
                })
            } else {
                this.app.current = this.getHash()
            }
        }
    }
    
    export default Router
   ```    
   自定义router的入口就是install方法，实现router在Vue上的挂载和初始化，初始化init中层层往下调用相关的方法，来实现监听hash变化，
   实现自定义组件的注册等事件。
   至此，一个简单版本hash模式的路由就实现了。
***************
vue-router有几种钩子函数？具体参数和含义？
