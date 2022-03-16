<template>
  <el-descriptions :title="stockBasicInfo.name" v-loading="loading">
    <template #extra>
      <el-button :type="added ? 'danger' : 'primary'" @click="favourate">{{
        added ? "删自选" : "加自选"
      }}</el-button>
      <el-button type="primary" @click="addTrainTask">训练</el-button>
    </template>
    <el-descriptions-item label="股票代码">{{
      stockBasicInfo.code
    }}</el-descriptions-item>
    <el-descriptions-item label="上市/发行日期">{{
      stockBasicInfo.ipoDate
    }}</el-descriptions-item>
    <el-descriptions-item label="退市日期">{{
      stockBasicInfo.outDate || "暂无"
    }}</el-descriptions-item>
    <el-descriptions-item label="证券类型">
      <el-tag size="default">{{ stockType[stockBasicInfo.type] }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="状态">{{
      stockStatus[stockBasicInfo.status]
    }}</el-descriptions-item>
  </el-descriptions>
  <trainTask :info="stockBasicInfo" ref="train"/>
</template>
<script>
import { ref, onMounted, reactive, watch } from "vue";
import axios from "axios";
import api from "@/utils/api.js";
import TrainTask from "@/components/TrainTask.vue"
export default {
  emits: ['disabledDate', 'disableMinute'],
  components: {
    TrainTask
  },
  props: {
    code: String,
  },
  setup(props, context) {
    watch(
      () => props.code,
      () => {
        getStockInfo();
      }
    );
    onMounted(() => {
      getStockInfo();
    });
    const loading = ref(false)
    const train = ref()
    const added = ref(false)
    const stockType = {
      1: "股票",
      2: "指数",
      3: "其他",
      4: "可转债",
      5: "ETF",
    };
    const stockStatus = {
      1: "上市",
      0: "退市",
    };
    const stockBasicInfo = reactive({
      name: "--",
      code: "--",
      ipoDate: "--",
      outDate: "--",
      type: "--",
      status: "--",
    });

    const addTrainTask = () => {
      train.value.open()
    }
    const isAdded = () => {
      if (!localStorage.getItem("my_stock")) {
        added.value = false
        return
      }
      let my_stock = JSON.parse(localStorage.getItem("my_stock"));
      let exist = false;
      my_stock.map((item) => {
        if (item.code === stockBasicInfo.code) {
          exist = true;
        }
      });
     added.value = exist;
    };

    const favourate = () => {
      if (stockBasicInfo.code === "--") return;
      let my_stock = [];
      if (localStorage.getItem("my_stock")) {
        my_stock = JSON.parse(localStorage.getItem("my_stock"));
      }
      if (added.value) {
        my_stock.map((item, index) => {
          if (item.code === stockBasicInfo.code) {
            my_stock.splice(index, 1);
          }
        });
      } else {
        my_stock.push({
          name: stockBasicInfo.name,
          code: stockBasicInfo.code,
          type: stockBasicInfo.type,
          status: stockBasicInfo.status,
        });
      }
      localStorage.setItem("my_stock", JSON.stringify(my_stock));
      isAdded()
    };

    const getStockInfo = () => {
      if (!props.code) return;
      loading.value = true
      axios
        .get(api.basic, {
          params: {
            stock_code: props.code,
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
          stockBasicInfo.name = res.data[0].code_name;
          stockBasicInfo.code = res.data[0].code;
          stockBasicInfo.ipoDate = res.data[0].ipoDate;
          stockBasicInfo.outDate = res.data[0].outDate;
          stockBasicInfo.type = res.data[0].type;
          stockBasicInfo.status = res.data[0].status;
          context.emit('disableMinute', stockBasicInfo.type === '2' ? true : false)
          isAdded()
          context.emit('disabledDate', stockBasicInfo.ipoDate)
        })
        .catch((err) => {
          ElMessage({
            message: err,
            type: "error",
          });
        }).finally(() => {
          loading.value = false;
        });
    };
    return { stockBasicInfo, stockType, stockStatus, added, train, loading, favourate, isAdded, addTrainTask };
  },
};
</script>