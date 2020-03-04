<template>
  <a-form :form="bookForm" :label-col="{span: 6}" :wrapper-col="{span: 12}">
    <a-tabs
      defaultActiveKey="1"
      :tabPosition="tabMode"
      v-if="bookData"
    >
      <!-- 书籍信息 -->
      <a-tab-pane tab="书籍" key="1">
        <a-row>
          <a-col :span="12">
            <a-form-item label="图书类型" >
              <a-select :options="bookType" :value="bookData.type" :disabled="viewMode"></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="书名" >
              <a-input id="name" :disabled="viewMode" v-model="bookData.name"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="书库位置">
              <a-input id="location" :disabled="viewMode" v-model="bookData.location"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="价格">
              <a-input id="price" :disabled="viewMode" v-model="bookData.price"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="预览图">
              <a-input id="thumbnail" :disabled="viewMode" v-model="bookData.thumbnail"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="出版日期">
              <a-input id="publishDay" :disabled="viewMode" v-model="bookData.publishDay"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-tab-pane>
      <!-- 作者信息 -->
      <a-tab-pane tab="作者" key="2">
        <a-row>
          <a-col :span="12">
            <a-form-item label="作者">
              <a-input id="author.name" :disabled="viewMode" v-model="bookData.author.name"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生日">
              <a-input id="author.birthday" :disabled="viewMode" v-model="bookData.author.birthday"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="笔名">
              <a-input id="author.nickName" :disabled="viewMode" v-model="bookData.author.nickName"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别">
              <a-select :options="genderSelection" :value="bookData.author.gender" :disabled="viewMode"></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="地址">
              <a-input id="author.address" :disabled="viewMode" v-model="bookData.author.address"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="电子邮箱">
              <a-input id="author.email" :disabled="viewMode" v-model="bookData.author.email"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="手机">
              <a-input id="author.mobile" :disabled="viewMode" v-model="bookData.author.mobile"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="固话">
              <a-input id="author.phone" :disabled="viewMode" v-model="bookData.author.phone"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-tab-pane>
      <!-- 出版信息 -->
      <a-tab-pane tab="出版社" key="3">
        <a-row>
          <a-col :span="12">
            <a-form-item label="出版社">
              <a-input id="publish.name" :disabled="viewMode" v-model="bookData.publish.name"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地址">
              <a-input id="publish.address" :disabled="viewMode" v-model="bookData.publish.address"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="电话">
              <a-input id="publish.phone" :disabled="viewMode" v-model="bookData.publish.phone"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱">
              <a-input id="publish.email" :disabled="viewMode" v-model="bookData.publish.email"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </a-form>
</template>

<script>
// import {books} from '../dataSample.js'
import {bookType, genderSelection} from '../constants.js'

export default {
  data() {
    return {
      tabMode: 'left',
      viewMode: true,
      bookData: null,
      bookType: bookType,
      genderSelection: genderSelection,
      // bookForm: this.$form.createForm(this, {}),
    };
  },
  beforeCreate() {
    // window.console.log(this.$route.params);
    this.bookForm = this.$form.createForm(this, {});
  },
  created () {
    this.queryBookById()
  },
  beforeMount: function() {
    let matchedBreadcrumb = this.$store.state.breadcrumbs.filter(b => b.path === this.$route.path);
    if (matchedBreadcrumb && matchedBreadcrumb.length > 0) {
      this.$store.commit('removeBreadcrumb', this.$store.state.breadcrumbs.indexOf(matchedBreadcrumb[0]));
    } else {
      this.$store.commit(
        'addBreadcrumb', 
        {
            path: this.$route.path, 
            breadcrumbName: '详情',
        }
      );
    }
  },
  methods: {
    queryBookById () {
      // 取数据，可以改成调用api
      let bookById;
      // let bookByIds = books.filter(b => (b.id === parseInt(this.$route.params.id)));
      this.$axios
        .get('http://localhost:8000/bookstore/book/' + this.$route.params.id)
        .then(response => {
          window.console.log('response:', response.data);
          bookById = response.data;
          window.console.log('book info:', bookById);
          if (!bookById) {
            window.console.log("没有找到对应的书籍");
          }
          this.bookData = bookById;
        })
        .catch(function (error) { // 请求失败处理
          window.console.log(error);
        }
      );
    }
  }
};
</script>