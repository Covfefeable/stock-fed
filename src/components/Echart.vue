<template>
    <div class="echarts" :style="style.chartStyle" :id="echart_id"></div>
</template>

<script>
import { watch } from 'vue'
import * as echarts from "echarts";
export default {
  name: "echart",
  props: {
    option: Object,
    style: Object
  },
  setup(props, context) {
    window.addEventListener('resize', () => {
      if(echarts.getInstanceByDom(document.getElementById(echart_id))) {
        echarts.getInstanceByDom(document.getElementById(echart_id)).resize()
      }
    })
    // 懒得写销毁 :)
    const echart_id = Math.floor(Date.now() * Math.random());
    context.emit('echart-instanse', echart_id)
    watch(props.option, (newVal) => {
      let myEcharts
      if (!echarts.getInstanceByDom(document.getElementById(echart_id))) {
        myEcharts = echarts.init(document.getElementById(echart_id))
      } else {
        myEcharts = echarts.getInstanceByDom(document.getElementById(echart_id))
      }
      myEcharts.setOption(newVal.option)
    })
    return { echart_id };
  },
};
</script>
