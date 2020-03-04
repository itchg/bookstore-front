<template>
  <div>
    <div id="bookCountByCagetory" :style="{width: '300px', height: '300px'}"></div>
    <div id="bookCountByCountry" :style="{width: '100%', height: '300px'}"></div>
  </div>
</template>

<script>
import {bookType} from '../constants.js'

// 按需引入echarts
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  name: 'systemInfo',
  data () {
    return {
      msg: '系统监控'
    }
  },
  mounted(){
    this.drawChartOfBookCountByCountry();
    this.drawChartOfBookCountByCategory();
  },
  methods: {
    // 国别新书发布数量柱状图，同步数据
    drawChartOfBookCountByCountry(){
      // 请求后端数据
      let xAxis = [], datas = []
      this.$axios
        .get('http://localhost:8000/bookstore/sys/cntByCountry')
        .then(response => {
          window.console.log('response:', response);
          if (response && response.data) {
            for (let item of response.data) {
              xAxis.push(item.name)
              datas.push(item.count)
            }
          }
          window.console.log(xAxis);
          // window.console.log(datas);

          // 基于准备好的dom，初始化echarts实例
          let bookCountByCountry = echarts.init(document.getElementById('bookCountByCountry'));
          // 绘制图表
          bookCountByCountry.setOption({
              title: { text: '国别新书发布数量(2019)' },
              // 要有tooltip配置项，默认show=true，没有配置项则不会出现
              tooltip: {},
              xAxis: {
                  data: xAxis
              },
              yAxis: {},
              series: [{
                  name: '国别新书发布数量',
                  type: 'bar',
                  data: datas,
                  tooltip: {
                    formatter: '国家:{b}, 新书数量:{c}'
                  }
              }]
          });
        })
        .catch(function (error) { // 请求失败处理
          window.console.log(error);
        }
      );
    },
    // 馆藏图书类别统计
    drawChartOfBookCountByCategory() {
      // 基于准备好的dom，初始化echarts实例
      let bookCountByCagetory = echarts.init(document.getElementById('bookCountByCagetory'));
      bookCountByCagetory.showLoading();

      this.$axios
        .get('http://localhost:8000/bookstore/sys/cntByCategory')
        .then(response => {
          window.console.log('response:', response);
          let pieDatas = []
          if (response && response.data && response.data.length > 0) {
            for (let item of response.data) {
              pieDatas.push({
                name: item.type,
                value: item.cnt,
              });
            }
          }
          bookCountByCagetory.hideLoading();
          bookCountByCagetory.setOption({
            title: {text: '馆藏图书统计'},
            tooltip: {},
            series:{
              type: 'pie',
              startAngle: 0,
              data: pieDatas,
              radius: '60%',
              label: {
                position: 'outside',
                alignTo: 'none',
                bleedMargin: 0,
              },
              tooltip: {
                formatter: '图书种类:{b}<br/>数量:{c}, 占比:{d}%'
              }
            }
          });
        })
        .catch(function (error) { // 请求失败处理
          window.console.log(error);
        }
      );
    }
  }
}
</script>