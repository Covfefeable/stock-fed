import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

export const useTrainStore = defineStore({
  id: "train",
  state: () => ({
    loss: [],
    profit: [],
    aggressiveProfit: [],
    profitConclude: {},
    epochs: 0,
    currentEpochs: 0,
    isTraining: false,
  }),
  getters: {
    getProcess() {
      if (!this.epochs && !this.currentEpochs) return 0;
      if (isNaN((this.currentEpochs / this.epochs) * 100)) return 0;
      if (this.currentEpochs / this.epochs === 1) return 100
      return ((this.currentEpochs / this.epochs) * 100).toFixed(1);
    },
  },
  actinos: {},
});

// 下面这破玩意没法做响应式
// const useTrainStore = defineStore("train", () => {
//   let loss = reactive([]);
//   let epochs = ref(0);
//   let currentEpochs = ref(0);
//   const updateLoss = (data) => {
//     loss.push(data);
//   }
//   const clearLoss = () => {
//     loss = [];
//   }
//   const updateEpochs = (total, current) => {
//     epochs = total;
//     currentEpochs = current;
//     console.log(epochs, currentEpochs)
//   }
//   const clearEpochs = () => {
//     epochs = 0;
//     currentEpochs = 0;
//   }
//   const getProcess = () => {
//       if (!epochs && !currentEpochs) return 0;
//       if (isNaN(currentEpochs / epochs * 100)) return 0;
//       return (currentEpochs / epochs * 100).toFixed(1)
//   }
//   return {
//     epochs,
//     currentEpochs,
//     loss,
//     getProcess,
//     updateLoss,
//     clearLoss,
//     updateEpochs,
//     clearEpochs,
//   };
// });
// export default useTrainStore;
