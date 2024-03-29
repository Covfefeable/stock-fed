<template>
  <div class="model">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>本地任务</span>
        </div>
      </template>
      <el-table :data="taskData">
        <el-table-column label="任务名称">
          <template #default="scope">
            <el-tag style="margin-right: 5px">{{
              convertName("targetStock", scope.row)
            }}</el-tag>
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据源" width="200">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.dataSource" :key="index">
              <el-tag style="margin-right: 5px">{{ item }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="关联项" width="100">
          <template #default="scope">
            {{ scope.row.relatedTarget === "pct" ? "涨跌幅" : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            {{ formatDate(scope.row.createTime, "YYYY-MM-DD h:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="时间范围" width="250">
          <template #default="scope">
            <span>{{ scope.row.date[0] + " - " + scope.row.date[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="深度学习参数" width="300">
          <template #default="scope">
            <el-tag style="margin-right: 5px">{{
              convertName("optimizer", scope.row)
            }}</el-tag>
            <el-tag>{{ convertName("loss", scope.row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button
              type="text"
              @click="handlePredict(scope.$index, scope.row)"
              >预测</el-button
            >
            <el-button
              type="text"
              @click="handleStart(scope.$index, scope.row)"
              :disabled="trainStore.isTraining"
              >开始任务</el-button
            >
            <el-button
              type="text"
              @click="handleUpload(scope.$index, scope.row)"
              disabled
              >上传参数</el-button
            >
            <el-button
              style="color: red"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
const moment = require("moment");
import * as tf from "@tensorflow/tfjs";
import { reactive } from "vue";
import train from "@/utils/TrainAssets/train.js";
import { useTrainStore } from "@/store/main.js";
import trainUtil from "@/utils/train.utils"
export default {
  name: "Model",
  setup() {
    const trainStore = useTrainStore();
    const taskData = reactive([]);
    let my_task = localStorage.getItem("my_task")
      ? JSON.parse(localStorage.getItem("my_task"))
      : [];
    my_task.map((item) => {
      taskData.push(item);
    });
    const convertName = (fieldName, data) => {
      let name = " -- ";
      let field = fieldName;
      if (field === "targetStock") field = "stock";
      data[field + "Options"].map((item) => {
        if (item.value === data[fieldName]) {
          name = item.label;
        }
      });
      return name;
    };
    const formatDate = (d, t) => {
      return moment(d).format(t);
    };
    const handlePredict = async (index, row) => {
      let model = await tf.loadLayersModel("indexeddb://" + "MODEL_" + row.name)
      trainUtil.getTestData(row)
    };
    const handleStart = (index, row) => {
      train.startTrain(row);
      console.log(index, row);
    };
    const handleUpload = (index, row) => {
      console.log(index, row);
    };
    const handleDelete = (index, row) => {
      const newData = taskData.filter((item, i) => {
        return i !== index;
      });
      localStorage.setItem("my_task", JSON.stringify(newData));
      taskData.splice(index, 1);
    };

    return {
      trainStore,
      taskData,
      convertName,
      handlePredict,
      handleStart,
      handleUpload,
      handleDelete,
      formatDate,
    };
  },
};
</script>
<style lang="less" scoped>
.model {
  min-height: 100vh;
  margin: 10px;
}
</style>
