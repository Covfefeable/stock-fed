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
            <el-radio border label="amount" disabled>交易量</el-radio>
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
            type="number"
            :min="0.001"
            style="width: 190px; margin-left: 10px"
            v-model="taskTrainInfo.learningRate"
            placeholder="学习步长"
          >
            <template #prepend>学习步长</template>
          </el-input>
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
      taskTrainInfo.name = '训练任务_' + val.name + '_' +  Number(new Date)
    });
    const taskDialog = ref(false);
    const trainForm = ref();
    const taskTrainInfo = reactive({
      name: "",
      type: "singleStock",
      targetStock: "",
      date: ["2022-01-01", "2022-03-16"],
      loss: "meanSquaredError",
      optimizer: "adam",
      learningRate: 0.01,
      dataSource: ["macd"],
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
        { min: 1, max: 20, message: "名称长度在1-20之间", trigger: "blur" },
      ],
      dataSource: [
        {
          required: true,
          message: "请至少选择一个数据源",
          trigger: "change",
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

          let my_task = localStorage.getItem("my_task")
            ? JSON.parse(localStorage.getItem("my_task"))
            : [];

          my_task.push(data);
          localStorage.setItem("my_task", JSON.stringify(my_task));
          ElMessage({
            message: '创建成功，请到模型页面查看',
            type: "success",
          });
          cancel();
        }
      });
    };

    const open = () => {
      taskDialog.value = true;
    };
    return {
      taskDialog,
      taskTrainInfo,
      shortcuts,
      rules,
      trainForm,
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