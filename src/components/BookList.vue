<template>
<div>
  <!-- 查询条件 -->
  <div class="query-conditions">
    <a-form :form="bookQueryFrom" :layout="formLayout" @submit="queryBooks">
      <a-row>
        <a-col :span="12">
          <a-form-item
            label="书名"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <!-- 用v-decorator注册字段，或者定义一个对象，用v-model双向绑定其中的字段 -->
            <a-input placeholder="输入书名，模糊查询"
              v-decorator="['bookName', { rules: [] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="出版年份"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="输入出版年份" 
              v-decorator="['publishYear', { rules: [{pattern: /^\d{4}$/, message: '输入4位年份' }] }]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item
            label="作者"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="输入作者，模糊查询" 
              v-decorator="['authorName', {}]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
        <a-button type="primary" size="small" html-type="submit">查询</a-button>
        <a-button type="primary" size="small" :style="{ marginLeft: '8px' }" html-type="reset">重置</a-button>
        <a-button type="dashed" size="small" :style="{ marginLeft: '30px' }" html-type="button" @click="gotoBookAdd">新增</a-button>
      </a-form-item>
    </a-form>
  </div>

  <!-- 数据展示 -->
  <div class="data-display">
    <a-table :columns="columns" :dataSource="data" :rowKey="record => record.id" :pagination="pagination">
      <template slot="action" slot-scope="text, record">
        <!-- 两种vuerouter的路由方式，1.详情功能里面通过编程式导航，用this.$router.push；2.编辑功能里面的router-link组件。
            两个是等价的，router-link点击后实际就是用了编程式导航 
        -->
        <a href="javascript:;" @click="() => gotoBookDetail(record.id, text)">详情</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="() => gotoBookEdit(record.id)">编辑</a>
        <!-- <router-link :to="'/book/edit/' + record.id">编辑</router-link> -->
        <a-divider type="vertical" />
        <a-popconfirm
          title="删除后无法恢复，确定删除吗？"
          @confirm="deleteBook(record.id, text)"
          okText="确定"
          cancelText="放弃"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</div>
</template>

<script>

  import {bookType} from '../constants.js'

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      customRender: (text, record, index) => {
        // window.console.log(text, record, index)
        // 从value转成lable
        return bookType.filter(t => t.value === text)[0].label
      }
    },
    {
      title: '书名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '作者',
      dataIndex: 'author.name',
      key: 'author.name',
    },
    {
      title: '出版日期',
      key: 'publishDay',
      dataIndex: 'publishDay',
    },
    {
      title: '出版社',
      key: 'publish.name',
      dataIndex: 'publish.name',
    },
    {
      title: '书库位置',
      key: 'location',
      dataIndex: 'location',
    },
    {
      title: '价格',
      key: 'price',
      dataIndex: 'price',
    },
    {
      title: '预览图',
      key: 'thumbnail',
      dataIndex: 'thumbnail',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      scopedSlots: {
        customRender: 'action'
      }
    },
  ];

  // 本地mock数据
  // import {books} from '../dataSample.js';
  // let bookList = books;
  let bookList = [];
  let queryParams = {
    bookName: null,
    authorName: null,
    publishYear: null,
  };

  export default {
    data() {
      // 分页相关变量
      let currentPage = 1, totalRecords = 0, pageSize = 5;
      // 第一次进入页面时的查询，只查第一页，默认一页5笔
      this.$axios
        .get('http://localhost:8000/bookstore/books/')
        .then(response => {
          window.console.log('response:', response);
          // window.console.log('old data', bookList);
          // 清空原查询结果
          bookList.splice(0, bookList.length)

          // 需要使用vue能够监测达到的数据修复方式，这样vue才能自动更新视图
          if (response.data && response.data.books.length > 0) {
            // 按照官网说明，可以直接用concat方法合并数组，但是实际不行，因此改成逐个元素push进去
            // bookList = bookList.concat(response.data.books)
            response.data.books.forEach(e => bookList.push(e));
            // 分页控制信息
            this.pagination.total = response.data.pagination.total;
            this.pagination.pageSize = response.data.pagination.pageSize;
            this.pagination.current = response.data.pagination.pageNo;
          }
          // window.console.log('new data', bookList);
        })
        .catch(function (error) { // 请求失败处理
          window.console.log(error);
        }
      );
      return {
        data: bookList,
        columns,
        pagination: {
          position: 'bottom',
          size: "small",
          total: totalRecords,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: ['5', '10', '20', '50'],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => {return '共' + total + '笔，第' + range[0] + '~' + range[1] + '笔'},
          onChange: (pageNo, pageSize) => {
            window.console.log('change page no:', pageNo, pageSize);
            this.queryBooks(null, pageNo, pageSize)
          },
          onShowSizeChange: (pageNo, pageSize) => {
            window.console.log('change page size:', pageNo, pageSize);
            this.queryBooks(null, pageNo, pageSize)
          }
        },
        formLayout: 'inline',
        // bookQueryFrom: this.bookQueryFrom ? this.bookQueryFrom : this.$form.createForm(this, {}),
      };
    },
    created() {
      this.bookQueryFrom = this.$form.createForm(
        this,
        {
          onFieldsChange: (_, changedFields) => {
            // window.console.log('onFieldsChange', changedFields);
            // this.$emit('change', changedFields);
          },
          mapPropsToFields: () => {
            window.console.log('mapPropsToFields')
            return {
              bookName: this.$form.createFormField({
                value: this.restoreBookName,
              }),
              authorName: this.$form.createFormField({
                value: this.restoreAuthorName,
              }),
              publishYear: this.$form.createFormField({
                value: this.restorePublishYear,
              }),
            };
          },
          onValuesChange: (_, values) => {
            window.console.log('onValuesChange', values);
            for(let [k, v] of Object.entries(values)) {
              // window.console.log('k,v', k, v)
              queryParams[k] = v;
            }
            window.console.log('queryParams', queryParams);
          },
        }
      )
    },
    computed: {
      formItemLayout() {
        const { formLayout } = this;
        return formLayout === 'horizontal' ? 
          {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
          : {};
      },
      buttonItemLayout() {
        const { formLayout } = this;
        return formLayout === 'horizontal' ? 
          {
            wrapperCol: { span: 14, offset: 4 },
          }
          : {};
      },
      // 三个查询条件从store中取值
      restoreBookName() {
        let storedQueryParam = this.$store.state.queryParams.get(this.$route.path);
        window.console.log('computed-bookName store value', storedQueryParam);
        if (storedQueryParam) {
          queryParams.bookName = storedQueryParam.bookName;
          return storedQueryParam.bookName;
        } else {
          return "";
        }
      },
      restoreAuthorName() {
        let storedQueryParam = this.$store.state.queryParams.get(this.$route.path);
        window.console.log('computed-authorName store value', storedQueryParam);
        if (storedQueryParam) {
          queryParams.authorName = storedQueryParam.authorName;
          return storedQueryParam.authorName;
        } else {
          return "";
        }
      },
      restorePublishYear() {
        let storedQueryParam = this.$store.state.queryParams.get(this.$route.path);
        window.console.log('computed-publishYear store value', storedQueryParam);
        if (storedQueryParam) {
          queryParams.publishYear = storedQueryParam.publishYear;
          return storedQueryParam.publishYear;
        } else {
          return "";
        }
      }
    },
    methods: {
      // 查询按钮的查询功能，支持分页
      queryBooks(e, pageNo, pageSize) {
        // 校验错误
        this.bookQueryFrom.validateFields((err, values) => {
          if (err) {
            this.$message.error('查询条件校验失败');
            return;
          }
          // values就是查询条件form里面的值
          window.console.log('Received values of form: ', values);

          // POST请求入参
          const queryParam = {
            param: values,
          }
          window.console.log('pagination:', this.pagination)
          queryParam.pagination = {
            pageNo: pageNo ? pageNo : this.pagination.current,
            pageSize: pageSize ? pageSize : this.pagination.pageSize
          }
          
          // 提交查询请求queryValues
          this.$axios
            .post('http://localhost:8000/bookstore/books/', queryParam)
            .then(response => {
              window.console.log('response:', response);
              // window.console.log('old data', bookList);
              // 清空原查询结果
              bookList.splice(0, bookList.length)

              // 需要使用vue能够监测达到的数据修复方式，这样vue才能自动更新视图
              if (response.data) {
                if (response.data.books.length > 0) {
                  // 按照官网说明，可以直接用concat方法合并数组，但是实际不行，因此改成逐个元素push进去
                  // bookList = bookList.concat(response.data.books)
                  response.data.books.forEach(e => bookList.push(e));
                }
                // 分页控制信息
                this.pagination.total = response.data.pagination.total;
                this.pagination.pageSize = response.data.pagination.pageSize;
                this.pagination.current = response.data.pagination.pageNo;
              }
              // window.console.log('new data', bookList);
            })
            .catch(function (error) { // 请求失败处理
                window.console.log(error);
            });
        });
      },
      // 详情页面
      gotoBookDetail(bookId) {
        // 进入详情页面之前，保存当前页面的查询条件
        window.console.log(this.$route.path, queryParams);
        this.$store.commit('saveQueryParams', {path: this.$route.path, param: queryParams});
        this.$router.push('/book/' + bookId);
      },
      // 编辑页面
      gotoBookEdit(bookId) {
        // 进入编辑页面之前，保存当前页面的查询条件
        window.console.log(this.$route.path, queryParams);
        this.$store.commit('saveQueryParams', {path: this.$route.path, param: queryParams});
        this.$router.push('/book/edit/' + bookId);
      },
      // 删除
      deleteBook(bookId) {
        window.console.log('deleteBook:', bookId);
        this.$axios
          .get('http://localhost:8000/bookstore/book/del/' + bookId)
          .then(response => {
            window.console.log('response:', response.data);
            // 刷新页面，简单粗暴方案
            this.$router.go(0);
            // 刷新页面，复杂方案
            // todo
          })
          .catch(function (error) { // 请求失败处理
            window.console.log(error);
          }
        );
      },
      gotoBookAdd() {
        this.$router.push('/book/add');
      }
    },
    beforeMount: function() {
      // 进入页面前，设置面包屑
      let matchedBreadcrumb = this.$store.state.breadcrumbs.filter(b => b.path === this.$route.path);
      if (matchedBreadcrumb && matchedBreadcrumb.length > 0) {
        this.$store.commit('removeBreadcrumb', this.$store.state.breadcrumbs.indexOf(matchedBreadcrumb[0]));
      } else {
        this.$store.commit(
          'addBreadcrumb', 
          {
              path: this.$route.path, 
              breadcrumbName: '图书',
          }
        );
      }
    }
  };
</script>
