<template>
  <el-descriptions :title="stockBasicInfo.name">
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
      <el-tag size="medium">{{ stockType[stockBasicInfo.type] }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="状态">{{
      stockStatus[stockBasicInfo.status]
    }}</el-descriptions-item>
  </el-descriptions>
</template>
<script>
import { onMounted, reactive, watch } from "vue";
import axios from "axios";
import api from "@/utils/api.js";
export default {
  props: {
    code: String,
  },
  setup(props) {
    watch(
      () => props.code,
      (newVal) => {
        getStockInfo();
      }
    );
    onMounted(() => {
      getStockInfo();
    });
    const stockType = {
      1: "股票",
      2: "指数",
      3: "其他",
      4: "可转债",
      5: "ETF",
    };
    const stockStatus = {
      1: "上市",
      2: "退市",
    };
    const stockBasicInfo = reactive({
      name: "--",
      code: "--",
      ipoDate: "--",
      outDate: "--",
      type: "--",
      status: "--",
    });

    const getStockInfo = () => {
      if (!props.code) return;
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
        })
        .catch((err) => {
          ElMessage({
            message: err,
            type: "error",
          });
        });
    };
    return { stockBasicInfo, stockType, stockStatus };
  },
};
</script>