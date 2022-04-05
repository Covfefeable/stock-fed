<template>
  <div
    draggable="true"
    @drag="drag"
    @click="detail"
    id="realtime"
    class="tiny-realtime"
    :style="progressStyle"
  >
    {{
      trainStore.getProcess && trainStore.isTraining
        ? trainStore.getProcess + "%"
        : "无任务"
    }}
  </div>

  <el-dialog
    v-model="trainingModel"
    title="当前任务"
    width="650px"
    draggable
    center
  >
    <div class="dialog-body">
      <el-divider content-position="left">损失值</el-divider>
      <Echarts :style="chartStyle" :option="chartOption" />
      <el-divider content-position="left">收益测算</el-divider>
      <Echarts :style="chartStyle" :option="profitOption" />
      <el-divider />
      <el-descriptions
        title="模型测算结果"
        :column="3"
        border
      >
        <el-descriptions-item>
          <template #label> 上涨 </template>
          {{ trainStore.profitConclude.up || 0 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 命中上涨 </template>
          {{ trainStore.profitConclude.upAim || 0 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 上涨命中率 </template>
          {{ trainStore.profitConclude.upAimRate || 0 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 下跌 </template>
          {{ trainStore.profitConclude.down || 0 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 命中下跌 </template>
          {{ trainStore.profitConclude.downAim || 0 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 下跌命中率 </template>
          {{ trainStore.profitConclude.downAimRate || 0 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 综合命中率 </template>
          {{
            (
              (trainStore.profitConclude.upAim +
                trainStore.profitConclude.downAim) /
              (trainStore.profitConclude.up + trainStore.profitConclude.down) * 100
            ).toFixed(2) + "%" || 0
          }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="trainingModel = false"
          >关闭</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { computed, nextTick, onMounted, reactive, ref } from "vue-demi";
import { useTrainStore } from "@/store/main.js";
import Echarts from "@/components/Echart.vue";
import chartConfig from "@/utils/chart.js";
export default {
  components: {
    Echarts,
  },
  setup() {
    const trainStore = useTrainStore();
    const progressStyle = computed(() => {
      const progress =
        trainStore.getProcess && trainStore.isTraining
          ? 100 - trainStore.getProcess
          : 100;
      return {
        left: modelCord[0] + "px",
        top: modelCord[1] + "px",
        background:
          "linear-gradient(#409eff " +
          progress +
          "%,#6076ff " +
          progress +
          "%)",
      };
    });
    const modelCord = reactive([110, 140]);
    const chartStyle = {
      chartStyle: {
        width: "600px",
        height: "150px",
      },
    };
    let chartOption = reactive({
      option: {},
    });
    let profitOption = reactive({
      option: {},
    });
    const trainingModel = ref(false);
    const drag = (e) => {
      if (!e.clientX && !e.clientY) return;
      modelCord[0] = e.pageX;
      modelCord[1] = e.pageY;
    };
    const detail = () => {
      trainingModel.value = true;
      nextTick(() => {
        let o = JSON.parse(JSON.stringify(chartConfig.lineChart.option));
        o.series[0].data = trainStore.loss;
        o.xAxis.data = Array.from({ length: trainStore.epochs }, (v, i) => i);
        chartOption.option = o;

        let p = JSON.parse(JSON.stringify(chartConfig.lineChart.option));
        p.series[0].data = trainStore.profit;
        p.series[0].name = "测算收益";
        p.series[1] = {
          name: "aggressive profit",
          data: trainStore.aggressiveProfit,
          type: "line",
          smooth: true,
        };
        p.xAxis.data = Array.from(
          { length: trainStore.profit.length },
          (v, i) => i + 1
        );
        profitOption.option = p;
      });
    };

    return {
      drag,
      detail,
      progressStyle,
      modelCord,
      trainingModel,
      trainStore,
      chartStyle,
      chartOption,
      profitOption,
    };
  },
};
</script>
<style lang="less" scoped>
.tiny-realtime {
  cursor: pointer;
  z-index: 2009;
  width: 50px;
  height: 50px;
  padding: 5px;
  color: #fff;
  text-align: center;
  line-height: 50px;
  position: absolute;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.25);
}
.dialog-body {
  min-height: 200px;
}
</style>