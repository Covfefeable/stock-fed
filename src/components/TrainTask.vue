<template>
  <el-dialog
    v-model="taskDialog"
    title="创建训练任务"
    width="30%"
    center
    draggable
  >
    <div class="dialog-body">
      <el-form
        ref="form"
        :model="taskTrainInfo"
        label-width="auto"
        label-position="left"
      >
        <el-form-item label="任务名称">
          <el-input v-model="taskTrainInfo.name" />
        </el-form-item>
        <el-form-item label="训练类型">
          <el-radio-group v-model="taskTrainInfo.type">
            <el-radio border label="singleStock">个股</el-radio>
            <el-radio border label="emotion" disabled>全市场</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标个股">
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
        <el-form-item label="数据源">
          <el-checkbox-group v-model="taskTrainInfo.dataSource">
            <el-checkbox-button label="macd" name="type"
              >MACD</el-checkbox-button
            >
            <el-checkbox-button label="kdj" name="type" disabled
              >KDJ</el-checkbox-button
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="关联目标">
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
        <el-form-item label="优化器">
          <el-select
            v-model="taskTrainInfo.optimizer"
            placeholder="选择合适的优化器"
          >
            <el-option
              v-for="(item, index) in taskTrainInfo.optimizerOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            style="width: 170px; margin-left: 10px"
            v-model="taskTrainInfo.learningRate"
            placeholder="输入学习步长"
          >
            <template #prepend>学习步长</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, ref, watch } from "vue";
import config from "@/utils/config.js";
import train from "@/utils/train.js"
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
    });
    const taskDialog = ref(false);
    const taskTrainInfo = reactive({
      name: "",
      type: "singleStock",
      targetStock: "",
      date: ['2022-01-01', '2022-03-16'],
      loss: "meanSquaredError",
      optimizer: "adam",
      learningRate: 0.01,
      dataSource: ["macd"],
      relatedTarget: 'pct',
      stockOptions: [
        {
          label: props.info.name,
          value: props.info.code,
        },
      ],
      lossOptions: config.lossOptions,
      optimizerOptions: config.optimizerOptions,
    });
    watch(taskTrainInfo, (val) => {
      if (val.dataSource.length === 0) {
        val.dataSource = ["macd"];
      }
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

    const confirm = () => {
      taskDialog.value = false;
      train.startTrain(taskTrainInfo)
    };

    const open = () => {
      taskDialog.value = true;
    };
    return {
      taskDialog,
      taskTrainInfo,
      shortcuts,
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
  min-height: 600px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>