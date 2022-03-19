import request from "@/utils/request.js";
import * as tf from '@tensorflow/tfjs';

const train = (source, target, config) => {
    console.log(source, target, config)
    let [s, t] = [source, target]

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [3] }));
    // model.add(tf.layers.dense({
    //     name: "learning_stack_1",
    //     activation: "relu",
    //     kernelInitializer: "randomNormal",
    //     units: 1
    //   }));

    model.compile({ loss: config.loss, optimizer: tf.train[config.optimizer](config.learningRate) });

    const xs = tf.tensor2d(s, [s.length, 3]);
    const ys = tf.tensor2d(t, [t.length, 1]);

    model.fit(xs, ys, {
        batchSize: config.batchSize, epochs: config.epochs, callbacks: {
            onEpochEnd: async (epoch, logs) => {
                console.log(epoch + ':' + logs.loss);
            }
        }
    }).then(() => {
        model.predict(tf.tensor2d([0.0047, 0.01313, -0.0083], [1, 3])).print();
        //  打开浏览器控制台看输出
    });
}

const startTrain = async (config) => {
    let dataSource = [];
    let target = []
    if (config.dataSource.includes('macd')) {
        await request
            .calMACD({
                stock_code: config.targetStock,
                start_date: config.date[0],
                end_date: config.date[1],
            })
            .then((res) => {
                res.data.data.map(item => {
                    let newArr = []
                    item.map(sub => {
                        newArr.push(Number(sub.toFixed(3)))
                    })
                    dataSource.push(newArr)
                })
                // dataSource = res.data.data
            })
    }

    await request.getKData({
        stock_code: config.targetStock,
        start_date: config.date[0],
        end_date: config.date[1],
        frequency: 'd'
    }).then((res) => {
        res.data.data.map(item => {
            target.push(Number(Number(item[8]).toFixed(3)))
        })
        target.splice(0, 33)
    })
    train(dataSource, target, config)
}

export default {
    startTrain
}