<template>
  <div class="home">
    <el-card class="box-card">
      <el-form :inline="true" :model="stockData">
        <el-form-item label="股票名称">
          <el-select
            v-model="stockData.stock_code"
            filterable
            remote
            placeholder="请输入代码或股票名称"
            :remote-method="fetchStock"
          >
            <el-option
              v-for="item in stockData.options"
              :key="item.code"
              :label="item.code_name"
              :value="item.code"
            ></el-option>
          </el-select>
          <Favour @update-favour="updateFavour" @select-favour="selectFavour" />
        </el-form-item>
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="stockData.date"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            :disabledDate="disabledDate"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="k线类型">
          <el-radio-group v-model="stockData.frequency">
            <el-radio-button
              v-for="(item, index) in kOptions"
              :key="index"
              :label="item.label"
              :disabled="item.disabled"
            ></el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <BasicInfo
        :code="stockData.stock_code"
        @disableMinute="disableMinute"
        @disabledDate="updateDisabledDate"
        ref="basic"
      />
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>k线与指标</span>
        </div>
      </template>
      <el-skeleton :rows="15" animated v-show="loading" />
      <Echart
        v-show="!loading"
        :option="option"
        :style="style.mainStyle"
        @echart-instanse="addInstanse"
      ></Echart>
      <Echart
        v-show="!loading"
        :option="option_macd"
        :style="style.macdStyle"
        @echart-instanse="addInstanse"
      ></Echart>
      <Echart
        v-show="!loading"
        :option="option_kdj"
        :style="style.kdjStyle"
        @echart-instanse="addInstanse"
      ></Echart>
    </el-card>
  </div>
  <el-backtop />
</template>

<script>
const moment = require("moment");
import { reactive, ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import Echart from "@/components/Echart";
import BasicInfo from "@/components/BasicInfo.vue";
import Favour from "@/components/Favour.vue";
import config from "@/utils/config.js";
import chart from "@/utils/chart.js";
import request from "@/utils/request.js";

export default {
  name: "Home",
  components: {
    Echart,
    BasicInfo,
    Favour,
  },
  setup() {
    let option = reactive({
      option: {},
    });
    let option_macd = reactive({
      option: {},
    });
    let option_kdj = reactive({
      option: {},
    });
    let loading = ref(false);
    let ipoDate = ref(0);
    let splitDate = [];
    let echartsTotal = [];
    const shortcuts = config.shortcuts;
    let kOptions = reactive(JSON.parse(JSON.stringify(config.kOptions)));
    const disableMinute = (disable) => {
      kOptions.map((item) => {
        if (item.label.includes("分")) {
          item.disabled = disable;
        }
      });
    };
    const disabledDate = (time) => {
      return (
        time.getTime() >
        Date.now() - (new Date().getHours() > 17 ? 0 : 3600 * 1000 * 24) ||
        time.getTime() < new Date(ipoDate.value).getTime()
      );
    };
    const updateDisabledDate = (ipo) => {
      ipoDate.value = ipo;
    };

    const style = {
      mainStyle: {
        chartStyle: {
          width: "100%",
          height: "400px",
        },
      },
      macdStyle: {
        chartStyle: {
          width: "100%",
          height: "250px",
        },
      },
      kdjStyle: {
        chartStyle: {
          width: "100%",
          height: "300px",
        },
      },
    };

    let curTime =
      new Date().getHours() > 17
        ? moment().format("YYYY-MM-DD")
        : moment().subtract(1, "days").format("YYYY-MM-DD");
    const stockData = reactive({
      input: "",
      stock_code: "sh.000001",
      date: ["2022-01-01", curTime],
      frequency: "日k",
      options: [
        {
          code: "sh.000001",
          code_name: "上证综合指数",
        },
      ],
    });

    onMounted(() => {
      onSubmit();
    });
    const basic = ref();
    const updateFavour = () => {
      basic.value.isAdded();
    };

    const selectFavour = (data) => {
      stockData.options = [
        {
          code: data.code,
          code_name: data.name,
        },
      ];
      stockData.stock_code = data.code;
    };

    const addInstanse = (e) => {
      echartsTotal.push(e);
    };
    const calMACDMax = (data) => {
      let max = 0;
      data.map((item) => {
        let ma = Math.max(...item);
        let mi = Math.min(...item);
        mi = Math.abs(mi);
        let fin = mi > ma ? mi : ma;
        max = max > fin ? max : fin;
      });
      if (max < 0.1) return 0.1;
      return Math.ceil(max * 10) / 10;
    };
    const connectCharts = () => {
      echartsTotal.map((item) => {
        echarts.getInstanceByDom(document.getElementById(item)).group = "main";
      });
      echarts.connect("main");
    };
    const resizeChart = () => {
      nextTick(() => {
        echartsTotal.map((item) => {
          echarts.getInstanceByDom(document.getElementById(item)).resize();
        });
      });
    };
    const fetchStock = (e) => {
      if (!e) return;
      request
        .searchStock({
          stock_name: e,
        })
        .then((res) => {
          stockData.options = res.data.filter((item) => {
            // 排除场外的
            return item.code.indexOf("of.") === -1;
          });
        });
    };
    const onSubmit = () => {
      loading.value = true;
      const dict = {
        "5分": "5",
        "15分": "15",
        "30分": "30",
        "60分": "60",
        日k: "d",
        周k: "w",
        月k: "m",
      };
      const data = {
        stock_code: stockData.stock_code,
        start_date: stockData.date[0],
        end_date: stockData.date[1],
        frequency: dict[stockData.frequency],
      };
      request.getKData(data).then((res) => {
        let data = res.data.data;
        renderMainChart(JSON.parse(JSON.stringify(data)), stockData.stock_code);
        const params = {
          stock_code: stockData.stock_code,
          start_date: stockData.date[0],
          end_date: stockData.date[1],
        };
        request
          .calMACD(params)
          .then((res_1) => {
            renderMACDChart(JSON.parse(JSON.stringify(res_1.data.data)));
            request
              .calKDJ(params)
              .then((res_2) => {
                renderKDJChart(JSON.parse(JSON.stringify(res_2.data.data)));
              })
              .finally(() => {
                loading.value = false;
                // 改变loading后宽度异常，手动resize
                resizeChart();
              });
          })
      });
    };
    const renderMainChart = (data, name) => {
      let processed = chart.stockOptions.splitData(data);
      let o = JSON.parse(JSON.stringify(chart.stockOptions.option));
      o.xAxis.data = processed.categoryData;
      splitDate = processed.categoryData;
      o.series[0].name = stockData.frequency;
      o.legend.data[0] = stockData.frequency;
      o.series[0].data = processed.values;
      o.series[1].data = chart.stockOptions.calculateMA(5, processed);
      o.series[2].data = chart.stockOptions.calculateMA(10, processed);
      o.series[3].data = chart.stockOptions.calculateMA(20, processed);
      o.series[4].data = chart.stockOptions.calculateMA(30, processed);
      option.option = o;
    };
    const renderMACDChart = (data) => {
      let max = calMACDMax(data);
      let processed = chart.macdOptions.splitData(data);
      let o = JSON.parse(JSON.stringify(chart.macdOptions.option));
      o.xAxis[0].data =
        stockData.frequency === "日k" ? splitDate : processed.categoryData;
      o.series[0].data = processed.hist;
      o.series[1].data = processed.dea;
      o.series[2].data = processed.dif;
      o.yAxis[0].max = max;
      o.yAxis[0].min = -max;
      o.yAxis[1].max = max;
      o.yAxis[1].min = -max;
      option_macd.option = o;
    };

    const renderKDJChart = (data) => {
      let processed = chart.lineChart.splitKDJData(data);
      let o = JSON.parse(JSON.stringify(chart.lineChart.option));
      o.xAxis.data =
        stockData.frequency === "日k" ? splitDate : processed.categoryData;
      o.grid = {
        y: 30,
        y2: 60,
      };
      o.dataZoom = [
        {
          type: "inside",
          start: 50,
          end: 100,
        },
        {
          show: true,
          type: "slider",
          top: "90%",
          start: 50,
          end: 100,
        },
      ];
      o.legend = {
        data: ["K", "D", "J"],
        orient: "vertical",
        y: 50,
        x: 50,
        borderWidth: 1,
        padding: 10,
        itemGap: 15,
      };
      o.series[0] = {
        name: "K",
        data: processed.k,
        type: "line",
        smooth: true,
      };
      o.series[1] = {
        name: "D",
        data: processed.d,
        type: "line",
        smooth: true,
      };
      o.series[2] = {
        name: "J",
        data: processed.j,
        type: "line",
        smooth: true,
      };
      option_kdj.option = o;
      nextTick(() => {
        stockData.frequency === "日k"
          ? connectCharts()
          : echarts.disconnect("main");
      });
    };
    return {
      basic,
      loading,
      option,
      option_macd,
      option_kdj,
      style,
      stockData,
      shortcuts,
      kOptions,
      disableMinute,
      updateDisabledDate,
      onSubmit,
      addInstanse,
      fetchStock,
      updateFavour,
      selectFavour,
      disabledDate,
    };
  },
};
</script>

<style lang="less" scoped>
.home {
  min-height: 100vh;
  padding: 10px;

  .box-card {
    margin: 10px 20px;
  }

  .stock-item {
    display: flex;
    justify-content: space-around;

    .item-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.65);
    }
    .item-code {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
</style>