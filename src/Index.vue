<template>
  <div id="app">
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
        <a-layout-sider collapsible v-model="collapsed">
            <div class="logo" />
            <!-- 静态写死的菜单
            <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
                <a-menu-item key="1">
                    <a-icon type="pie-chart" />
                    <span>Option 1</span>
                </a-menu-item>
                <a-menu-item key="2">
                    <a-icon type="desktop" />
                    <span>Option 2</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <span slot="title"><a-icon type="user" /><span>User</span></span>
                    <a-menu-item key="3">Tom</a-menu-item>
                    <a-menu-item key="4">Bill</a-menu-item>
                    <a-menu-item key="5">Alex</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub2">
                    <span slot="title"><a-icon type="team" /><span>Team</span></span>
                    <a-menu-item key="6">Team 1</a-menu-item>
                    <a-menu-item key="8">Team 2</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="9">
                    <a-icon type="file" />
                    <span>File</span>
                </a-menu-item>
            </a-menu>
            -->
            <!-- 动态加载的菜单，结合vue-router组件的router-link 
                antd与vue-router的结合参照react的相关问题https://github.com/ant-design/ant-design/issues/1575
            -->
            <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
                <template v-for="m in menus">
                    <a-menu-item v-if="m.menuType === 'item'" :key="m.menuId">
                        <router-link :to="m.url">
                            <a-icon :type="m.menuIcon" />
                            <span>{{m.menuName}}</span>
                        </router-link>
                    </a-menu-item>
                    <a-sub-menu v-else-if="m.menuType === 'sub'" :key="m.menuId">
                        <span slot="title">
                            <a-icon :type="m.menuIcon" />
                            <span>{{m.menuName}}</span>
                        </span>
                        <a-menu-item v-for="i in m.items" :key="i.menuId">
                            <router-link :to="i.url">{{i.menuName}}</router-link>
                        </a-menu-item>
                    </a-sub-menu>
                </template>
            </a-menu>
            
            
        </a-layout-sider>
        <a-layout>
            <!-- <a-layout-header style="background: #ddd; padding: 0" /> -->
            <a-layout-content style="margin: 0 16px">
                <div style="margin: 16px 0; height:25px">
                    <!-- 面包屑
                    <a-breadcrumb style="width:50%; float:left;">
                        <a-breadcrumb-item>User</a-breadcrumb-item>
                        <a-breadcrumb-item>Bill</a-breadcrumb-item>
                    </a-breadcrumb> -->
                    <a-breadcrumb :routes="routes" style="width:50%; float:left;">
                        <template  slot="itemRender" slot-scope="{route}">
                            <span v-if="routes.length > 1 && routes.indexOf(route) === routes.length - 1" :key="route.path">
                                {{route.breadcrumbName}}
                            </span>
                            <router-link v-else :to="route.path" :key="route.path">
                                {{route.breadcrumbName}}
                            </router-link>
                        </template>
                    </a-breadcrumb>
                    <!-- 操作按钮 -->
                    <div style="width:50%; height:25px; float:right; text-align:right;">
                        <template v-if="showGoBack">
                            <a-button type="primary" size="small" @click="goback()"><a-icon type="left" />返回</a-button>
                        </template>
                    </div>
                </div>
                <div :style="{padding: '24px', background: '#fff', minHeight: '360px' }">
                    <!-- route outlet -->
                    <!-- component matched by the route will render here -->
                    <router-view></router-view>
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                BookStore Management System ©2020 Created by xc
            </a-layout-footer>
        </a-layout>
    </a-layout>
  </div>
</template>

<script>

  const menus = [
            {
                menuId: 1,
                menuName: '统计信息',
                menuIcon: 'pie-chart',
                menuType: 'item',
                url: '/system/sysinfo'
            },
            {
                menuId: 2,
                menuName: '系统设置',
                menuIcon: 'desktop',
                menuType: 'item',
                url: '/system/setting'
            },
            {
                menuId: 4,
                menuName: '图书管理',
                menuIcon: 'file',
                menuType: 'sub',
                url: '',
                items: [
                    {
                        menuId: 41,
                        menuName: '书库',
                        menuIcon: '',
                        menuType: 'item',
                        url: '/book/store'
                    },
                    {
                        menuId: 42,
                        menuName: '借书',
                        menuIcon: '',
                        menuType: 'item',
                        url: '/book/borrow'
                    },
                    {
                        menuId: 43,
                        menuName: '还书',
                        menuIcon: '',
                        menuType: 'item',
                        url: '/book/return'
                    }
                ]
            },
            {
                menuId: 3,
                menuName: '用户管理',
                menuIcon: 'user',
                menuType: 'sub',
                url: '',
                items: [
                    {
                        menuId: 31,
                        menuName: '用户维护',
                        menuIcon: '',
                        menuType: 'item',
                        url: '/user/user'
                    },
                    {
                        menuId: 32,
                        menuName: '分组维护',
                        menuIcon: '',
                        menuType: 'item',
                        url: '/user/group'
                    },
                    {
                        menuId: 33,
                        menuName: '角色维护',
                        menuIcon: '',
                        menuType: 'item',
                        url: '/user/role'
                    }
                ]
            }
        ];

    let showGoBack;
    export default {
        data() {
            return {
                collapsed: false,
                menus: menus,
                routes: this.$store.state.breadcrumbs,
                showGoBack: this.$route.path !== '/',
            };
        },
        methods: {
            /* 菜单的点击直接使用vue-router，不需要antd menu的click事件
            menuClick(e) {
                let url = menus
                    .filter(m => (m.menuId === e.key) || (m.items && m.items.length > 0 && m.items.filter(i => i.menuId === e.key).length > 0))
                    .map(m => {
                        if (m.menuId === e.key) {
                            return m.url;
                        } else {
                            return m.items.filter(i => i.menuId === e.key)[0].url;
                        }
                    });
                window.console.log('click ', e, url);
            },
            */
            goback() {
                this.$router.back();
            }
        }
    };
</script>

<style>
  #components-layout-demo-side .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
  @import './css/common.css'; /*引入公共样式*/
</style>
