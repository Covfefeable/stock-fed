import * as tf from "@tensorflow/tfjs";
function trainModel(x, y, config) {
  const consecutiveDays = Number(config.consecutiveDays);
  const xs = tf.tensor3d(x, [x.length, x[0].length, x[0][0].length]);
  const ys = tf.tensor2d(y, [y.length, 1]);
  const model = tf.sequential();

  model.add(
    tf.layers.conv1d({
      inputShape: [consecutiveDays, 3],
      filters: 60,
      kernelSize: 1,
      activation: "relu",
    })
  );
  model.add(
    tf.layers.lstm({
      units: 80,
      returnSequences: true,
    })
  );
  model.add(tf.layers.lstm({ units: 1 }));

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

      model
        .predict(tf.tensor3d([x[x.length - 1]], [1, consecutiveDays, 3]))
        .print();
      let store = {
        action: "updateProgress",
        isTraining: false,
      };
      postMessage(JSON.stringify(store));
    });
}
onmessage = (e) => {
  let data = JSON.parse(e.data);
  let { x, y, config } = data;
  if (data.action === "train") {
    trainModel(x, y, config);
  }
};
