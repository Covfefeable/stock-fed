<template>
  <el-dialog
    v-model="taskDialog"
    title="创建训练任务"
    width="40%"
    center
    draggable
  >
    <div class="dialog-body">
      <el-form
        ref="trainForm"
        :rules="rules"
        :model="taskTrainInfo"
        label-width="auto"
        label-position="left"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskTrainInfo.name" />
        </el-form-item>
        <el-form-item label="训练类型">
          <el-radio-group v-model="taskTrainInfo.type">
            <el-radio border label="singleStock">个股</el-radio>
            <el-radio border label="emotion" disabled>全市场</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标个股" prop="targetStock">
          <el-select
            v-model="taskTrainInfo.targetStock"
            placeholder="当前的目标个股"
          >
            <el-option
              v-for="(item, index) in taskTrainInfo.stockOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据源" prop="dataSource">
          <el-radio-group v-model="taskTrainInfo.dataSource">
            <el-radio border label="macd">MACD</el-radio>
            <el-radio border label="kdj">KDJ</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="日连续" prop="consecutiveDays">
          <el-tooltip
            effect="dark"
            content="例：5日连续会将五组连续日数据作为一组"
            placement="top"
          >
            <el-input
              type="number"
              style="width: 212px"
              :min="2"
              v-model="taskTrainInfo.consecutiveDays"
              placeholder="日连续"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="关联项">
          <el-radio-group v-model="taskTrainInfo.relatedTarget">
            <el-radio border label="pct">涨跌幅</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="日期选择">
          <el-date-picker
            v-model="taskTrainInfo.date"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            :disabledDate="disabledDate"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="损失函数">
          <el-select
            v-model="taskTrainInfo.loss"
            placeholder="选择合适的损失函数"
          >
            <el-option
              v-for="(item, index) in taskTrainInfo.lossOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优化函数">
          <el-select
            v-model="taskTrainInfo.optimizer"
            placeholder="选择合适的优化优化函数"
          >
            <el-option
              v-for="(item, index) in taskTrainInfo.optimizerOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            type="number"
            :min="0.001"
            style="width: 190px; margin-left: 10px"
            v-model="taskTrainInfo.learningRate"
            placeholder="学习步长"
          >
            <template #prepend>学习步长</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Batch Size" prop="batchSize">
          <el-input
            type="number"
            style="width: 212px"
            :min="1"
            v-model="taskTrainInfo.batchSize"
            placeholder="输入 Batch Size"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="epochs" prop="epochs">
          <el-input
            type="number"
            style="width: 212px"
            :min="1"
            v-model="taskTrainInfo.epochs"
            placeholder="输入 epochs"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="测试集数量" prop="testNum">
          <el-input
            type="number"
            style="width: 212px"
            :min="1"
            v-model="taskTrainInfo.testNum"
            placeholder="输入 测试集数量"
          >
          </el-input>
        </el-form-item>
        <el-divider content-position="left">模型</el-divider>
        <el-form-item label="模型详情">
          <div v-for="(item, index) in modelDetail" :key="index">
            <div
              v-if="
                taskTrainInfo.dataSource === item.dataSource &&
                taskTrainInfo.relatedTarget === item.relatedTarget
              "
            >
              <div>{{ item.model }}</div>
              <div v-for="(desc, index_2) in item.desc" :key="index_2">
                {{ "第" + (index_2 + 1) + "层：" + desc }}
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm(trainForm)">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, ref, watch } from "vue";
import config from "@/utils/config.js";
import { ElMessage } from "element-plus";
const moment = require("moment");
export default {
  props: {
    info: Object,
  },
  setup(props, context) {
    watch(props.info, (val) => {
      taskTrainInfo.stockOptions = [
        {
          label: val.name,
          value: val.code,
        },
      ];
      taskTrainInfo.targetStock = val.code;
      taskTrainInfo.name = "训练任务_" + val.name + "_" + Number(new Date());
    });
    const taskDialog = ref(false);
    const trainForm = ref();
    let curTime =
      new Date().getHours() > 17
        ? moment().format("YYYY-MM-DD")
        : moment().subtract(1, "days").format("YYYY-MM-DD");
    const taskTrainInfo = reactive({
      status: 0,
      name: "",
      type: "singleStock",
      targetStock: "",
      date: ["2022-01-01", curTime],
      loss: "meanSquaredError",
      optimizer: "adam",
      learningRate: 0.1,
      batchSize: 32,
      epochs: 200,
      testNum: 7,
      dataSource: "macd",
      consecutiveDays: 5,
      relatedTarget: "pct",
      stockOptions: [
        {
          label: props.info.name,
          value: props.info.code,
        },
      ],
      lossOptions: config.lossOptions,
      optimizerOptions: config.optimizerOptions,
    });
    const rules = reactive({
      name: [
        {
          required: true,
          message: "请输入任务名称",
          trigger: "blur",
        },
        { min: 1, max: 50, message: "名称长度在1-50之间", trigger: "blur" },
      ],
      dataSource: [
        {
          required: true,
          message: "请选择一个数据源",
          trigger: "change",
        },
      ],
      consecutiveDays: [
        {
          required: true,
          message: "请输入日连续参数",
          trigger: "blur",
        },
      ],
      batchSize: [
        {
          required: true,
          message: "请输入 batch size",
          trigger: "blur",
        },
      ],
      epochs: [
        {
          required: true,
          message: "请输入 epochs",
          trigger: "blur",
        },
      ],
      testNum: [
        {
          required: true,
          message: "请输入 testNum",
          trigger: "blur",
        },
      ],
    });

    const shortcuts = config.shortcuts;
    const disabledDate = (time) => {
      return (
        time.getTime() >
          Date.now() - (new Date().getHours() > 17 ? 0 : 3600 * 1000 * 24) ||
        time.getTime() < new Date(props.info.ipoDate).getTime()
      );
    };

    const cancel = () => {
      taskDialog.value = false;
    };

    const confirm = (trainForm) => {
      trainForm.validate((valid, fields) => {
        if (!valid) {
          console.log("表单不正确", fields);
          return;
        } else {
          let data = JSON.parse(JSON.stringify(taskTrainInfo));
          data.createTime = Number(new Date());
          let my_task = localStorage.getItem("my_task")
            ? JSON.parse(localStorage.getItem("my_task"))
            : [];

          my_task.push(data);
          localStorage.setItem("my_task", JSON.stringify(my_task));
          ElMessage({
            message: "创建成功，请到模型页面查看",
            type: "success",
          });
          cancel();
        }
      });
    };

    const open = () => {
      taskDialog.value = true;
    };

    const modelDetail = reactive([
      {
        dataSource: "macd",
        relatedTarget: "pct",
        model: "sequential 模型",
        desc: [
          "conv1d: ( filters: 60; kernelSize: 1; activation: relu )",
          "lstm: ( units: 80; returnSequences: true )",
          "lstm: ( units: 1 )",
          "dense: ( units: 1 )",
        ],
      },
      {
        dataSource: "kdj",
        relatedTarget: "pct",
        model: "sequential 模型",
        desc: [
          "conv1d: ( filters: 60; kernelSize: 1; activation: relu )",
          "lstm: ( units: 80; returnSequences: true )",
          "lstm: ( units: 1 )",
          "dense: ( units: 1 )",
        ],
      },
    ]);
    return {
      taskDialog,
      taskTrainInfo,
      shortcuts,
      rules,
      trainForm,
      modelDetail,
      cancel,
      confirm,
      open,
      disabledDate,
    };
  },
};
</script>
<style scoped>
.dialog-body {
  max-height: 550px;
  overflow: auto;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>