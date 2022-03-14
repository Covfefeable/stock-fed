<template>
  <div class="home">
    <el-card class="filter">
      <el-form :inline="true" :model="stockData">
        <el-form-item label="股票代码">
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
            >
            </el-option>
          </el-select>
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
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="k线类型">
          <el-radio-group v-model="stockData.frequency">
            <el-radio-button label="5分"></el-radio-button>
            <el-radio-button label="15分"></el-radio-button>
            <el-radio-button label="30分"></el-radio-button>
            <el-radio-button label="60分"></el-radio-button>
            <el-radio-button label="日k"></el-radio-button>
            <el-radio-button label="周k"></el-radio-button>
            <el-radio-button label="月k"></el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ stockData.stock_code }}</span>
        </div>
      </template>
      <el-skeleton :rows="15" animated v-show="loading" />
      <Echart
        v-show="!loading"
        :option="option"
        :style="style"
        @echart-instanse="addInstanse"
      ></Echart>
      <Echart
        v-show="!loading"
        :option="option_macd"
        :style="style"
        @echart-instanse="addInstanse"
      ></Echart>
    </el-card>
  </div>
  <el-backtop />
</template>

<script>
import { reactive, ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import { ElMessage } from "element-plus";
import Echart from "@/components/Echart";
import api from "@/utils/api.js";
import config from "@/utils/config.js";
import chart from "@/utils/chart.js";
export default {
  name: "Home",
  components: {
    Echart,
  },
  setup() {
    let option = reactive({
      option: {},
    });
    let option_macd = reactive({
      option: {},
    });
    let loading = ref(false);
    let splitDate = [];
    let echartsTotal = [];
    const shortcuts = config.shortcuts;

    const style = {
      boxStyle: {
        width: "100%",
        height: "500px",
      },
      chartStyle: {
        width: "100%",
        height: "400px",
      },
    };

    const stockData = reactive({
      input: "",
      stock_code: "sh.600000",
      date: ["2022-01-01", "2022-03-10"],
      frequency: "日k",
      options: [{
        code: 'sh.600000',
        code_name: '浦发银行'
      }]
    });

    onMounted(() => {
      onSubmit();
    });

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
      axios
        .get(api.search, {
          params: {
            stock_name: e,
          },
        })
        .then((res) => {
          if (res.data.code === "500") {
            ElMessage({
              message: res.data.msg,
              type: "warning",
            });
            return;
          }
          stockData.options = res.data
        })
        .catch((err) => {
          ElMessage({
            message: err,
            type: "error",
          });
        });
    };
    const selectStock = (e) => {
      console.log(e);
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
      axios
        .get(api.overview, {
          params: data,
        })
        .then((res) => {
          if (res.data.code === "500") {
            ElMessage({
              message: res.data.msg,
              type: "warning",
            });
            return;
          }

          let data = res.data.data;
          renderMainChart(
            JSON.parse(JSON.stringify(data)),
            stockData.stock_code
          );
          const params = {
            stock_code: stockData.stock_code,
            start_date: stockData.date[0],
            end_date: stockData.date[1],
          };
          axios
            .get(api.calMACD, {
              params: params,
            })
            .then((res) => {
              if (res.data.code === "500") {
                ElMessage({
                  message: res.data.msg,
                  type: "warning",
                });
                return;
              }
              renderMACDChart(JSON.parse(JSON.stringify(res.data.data)));
            })
            .catch((err) => {
              ElMessage({
                message: err,
                type: "error",
              });
            })
            .finally(() => {
              loading.value = false;
              // 改变loading后宽度异常，手动resize
              resizeChart();
            });
        })
        .catch((err) => {
          ElMessage({
            message: err,
            type: "error",
          });
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
      nextTick(() => {
        stockData.frequency === "日k"
          ? connectCharts()
          : echarts.disconnect("main");
      });
    };
    return {
      loading,
      option,
      option_macd,
      style,
      stockData,
      shortcuts,
      onSubmit,
      addInstanse,
      fetchStock,
      selectStock,
    };
  },
};
</script>

<style lang="less" scoped>
.home {
  min-height: 100vh;
  padding: 10px;

  .filter {
    margin: 10px 20px;
  }

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