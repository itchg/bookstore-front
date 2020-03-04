import SysIndex from './components/SysIndex'
import Sysinfo from './components/SysInfo'
import SysSetting from './components/SysSetting'
import BookList from './components/BookList'
import BorrowBook from './components/BorrowBook'
import ReturnBook from './components/ReturnBook'
import UserList from './components/UserList'
import GroupList from './components/GroupList'
import RoleList from './components/RoleList'
import BookView from './components/BookView'
import BookEdit from './components/BookEdit'

const routes = [
    { path: '/', component: SysIndex },
    { path: '/system/sysinfo', component: Sysinfo },
    { path: '/system/setting', component: SysSetting },
    { path: '/book/store', component: BookList },
    { path: '/book/borrow', component: BorrowBook },
    { path: '/book/return', component: ReturnBook },
    // 注意后面'/book/:id'用的是模糊匹配，所以要往后面放，否则像'/book/add'的请求会匹配到'/book/:id'
    { path: '/book/add', component: BookEdit },
    { path: '/book/edit/:id', component: BookEdit },
    { path: '/book/:id', component: BookView },
    { path: '/user/user', component: UserList },
    { path: '/user/group', component: GroupList },
    { path: '/user/role', component: RoleList },
  ]

export {routes}