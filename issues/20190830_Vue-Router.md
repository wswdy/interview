Vue-Router

vue-router中hash模式和history模式有什么区别？  
- hash模式最显著的特征就是会地址中会有#号，#后面的值就是hash值，hash虽然出现在url中，
但是不影响http请求，只有hash前面的基地址会包含在请求中，因此hash改变不会重新加载页面。
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
***************
vue-router有几种钩子函数？具体参数和含义？
