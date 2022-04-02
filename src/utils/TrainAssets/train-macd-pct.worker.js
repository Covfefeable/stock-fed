// import * as tf from "@tensorflow/tfjs";
// 从 cdn 引入, 或 require 引入最快，上面的引入方式会打包出 80MB 的 worker
// importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.15.0')
const tf = require("./tfjs.min.js");
let globalModel = null;
function trainModel(x, y, config) {
  const consecutiveDays = Number(config.consecutiveDays);
  const testNum = Number(config.testNum);
  let x_test = x.slice(x.length - testNum);
  let y_test = y.slice(y.length - testNum);

  x = x.slice(0, x.length - testNum);
  y = y.slice(0, y.length - testNum);
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
    inputShape: [consecutiveDays, 3],
    activation: "relu",
    units: 10
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
  let total = 10000
  let aggressiveTotal = 10000
  let record = []
  let aggressiveRecord = []
  x.map((item, index) => {
    const value = globalModel.predict(tf.tensor3d([item], [1, consecutiveDays, 3])).dataSync()[0];
    const actual = y[index]
    if (value > 0) {
      total = total * (1 + actual / 100)
    }
    record.push(total)
    aggressiveRecord.push(aggressiveTotal * (1 + actual / 100))
  });
  let profit = {
    action: "updateProfit",
    profit: record,
    aggressiveProfit: aggressiveRecord
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
