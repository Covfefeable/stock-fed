// import * as tf from "@tensorflow/tfjs";
// 从 cdn 引入, 或 require 引入最快，上面的引入方式会打包出 80MB 的 worker
// importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.15.0')
const tf = require("./tfjs.min.js");
let globalModel = null;
function trainModel(_x, _y, config) {
  const consecutiveDays = Number(config.consecutiveDays);
  const testNum = Number(config.testNum);
  let x_test = _x.slice(_x.length - testNum);
  let y_test = _y.slice(_y.length - testNum);

  let x = _x.slice(0, _x.length - testNum);
  let y = _y.slice(0, _y.length - testNum);
  const xs = tf.tensor3d(x, [x.length, x[0].length, x[0][0].length]);
  const ys = tf.tensor2d(y, [y.length, 1]);
  const model = tf.sequential();

  // model.add(
  //   tf.layers.conv1d({
  //     inputShape: [consecutiveDays, 3],
  //     filters: 60,
  //     kernelSize: 1,
  //     activation: "relu",
  //   })
  // );
  // model.add(
  //   tf.layers.lstm({
  //     units: 80,
  //     returnSequences: true,
  //   })
  // );
  // model.add(tf.layers.lstm({ units: 1 }));

  model.add(tf.layers.dense({
    inputShape: [consecutiveDays, x[0][0].length],
    // activation: "sigmoid",
    units: 40
  }))

  model.add(tf.layers.dense({
    units: 180
  }))
  model.add(tf.layers.dense({
    units: 100
  }))

  model.add(tf.layers.flatten())

  model.add(
    tf.layers.dense({
      units: 1,
    })
  );

  model.compile({
    optimizer: tf.train[config.optimizer](Number(config.learningRate)),
    loss: config.loss,
  });
  model
    .fit(xs, ys, {
      batchSize: Number(config.batchSize),
      epochs: Number(config.epochs),
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          let store = {
            action: "updateStore",
            loss: logs.loss,
            epochs: config.epochs,
            currentEpochs: epoch + 1,
          };
          postMessage(JSON.stringify(store));
        },
      },
    })
    .then(async () => {
      const result = await model.save("indexeddb://" + "MODEL_" + config.name);

      let store = {
        action: "updateProgress",
        isTraining: false,
      };
      postMessage(JSON.stringify(store));
      globalModel = model;
      predictProfit(x_test, y_test, consecutiveDays);
    });
}

function predictProfit(x, y, consecutiveDays) {
  let total = 100
  let aggressiveTotal = 100
  let record = []
  let aggressiveRecord = []
  let profitConclude = {
    up: 0,
    down: 0,
    upAim: 0,
    downAim: 0,
    upAimRate: 0,
    downAimRate: 0,
  }

  x.map((item, index) => {
    const value = globalModel.predict(tf.tensor3d([item], [1, consecutiveDays, x[0][0].length])).dataSync()[0];
    console.log(value)
    const actual = y[index]

    // 统计上涨下跌命中率
    if (actual > 0) {
      profitConclude.up += 1
      if (value > 0) {
        profitConclude.upAim += 1
      }
    } else {
      profitConclude.down += 1
      if (value <= 0) {
        profitConclude.downAim += 1
      }
    }

    if (value > 0) {
      total = total * (1 + actual / 100)
    }

    aggressiveTotal = aggressiveTotal * (1 + actual / 100)
    record.push(total)
    aggressiveRecord.push(aggressiveTotal)
  });

  profitConclude.upAimRate = (profitConclude.upAim / profitConclude.up * 100).toFixed(2) + '%'
  profitConclude.downAimRate = (profitConclude.downAim / profitConclude.down * 100).toFixed(2) + '%'
  let profit = {
    action: "updateProfit",
    profit: record,
    aggressiveProfit: aggressiveRecord,
    profitConclude: profitConclude
  };
  postMessage(JSON.stringify(profit));
}
onmessage = (e) => {
  let data = JSON.parse(e.data);
  let { x, y, config } = data;
  if (data.action === "train") {
    trainModel(x, y, config);
  }
};
