import request from "@/utils/request.js";
import * as tf from '@tensorflow/tfjs';

const train = (source, target) => {
    let [s, t] = [source, target]

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [3] }));

    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    const xs = tf.tensor2d(s.flat(Infinity), [s.length, 3]);
    const ys = tf.tensor2d(t, [t.length, 1]);

    model.fit(xs, ys, { epochs: 1000 }).then(() => {
        model.predict(tf.tensor2d([0.0047, 0.01313, -0.0083], [1,3])).print();
        //  打开浏览器控制台看输出
    });
}

const startTrain = (config) => {
    let dataSource = [];
    let target = []
    if (config.dataSource.includes('macd')) {
        request
            .calMACD({
                stock_code: config.targetStock,
                start_date: config.date[0],
                end_date: config.date[1],
            })
            .then((res) => {
                dataSource = res.data.data

                request.getKData({
                    stock_code: config.targetStock,
                    start_date: config.date[0],
                    end_date: config.date[1],
                    frequency: 'd'
                }).then((res) => {
                    res.data.data.map(item => {
                        target.push(Number(item[8]))
                    })
                    target.splice(0, 33)
                    train(dataSource, target)
                })
            })
    }
}

export default {
    startTrain
}