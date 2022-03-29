import request from "@/utils/request.js";
import * as tf from '@tensorflow/tfjs';
import { ElNotification } from 'element-plus'
import {useTrainStore} from '@/store/main.js'

const train = (source, target, config) => {
    const trainStore = useTrainStore()
    trainStore.loss = []
    trainStore.epochs = 0
    trainStore.currentEpochs = 0

    let [x, y, consecutiveDays] = [[], [], Number(config.consecutiveDays)];
    source.map((item, index) => {
        x.push(source.slice(index, index + consecutiveDays));
    });
    target.map((item, index) => {
        y.push(target[index + consecutiveDays]);
    });
    x = x.slice(0, x.length - consecutiveDays)
    y = y.slice(0, y.length - consecutiveDays)

    const xs = tf.tensor3d(x, [
        x.length,
        x[0].length,
        x[0][0].length,
    ]);
    const ys = tf.tensor2d(y, [y.length, 1]);
    const model = tf.sequential();

    model.add(tf.layers.conv1d({
        inputShape: [consecutiveDays, 3],
        filters: 60,
        kernelSize: 1,
        activation: 'relu'
    }));
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
    model.fit(xs, ys, {
        batchSize: Number(config.batchSize), epochs: Number(config.epochs), callbacks: {
            onEpochEnd: async (epoch, logs) => {
                trainStore.loss.push(Number(logs.loss))
                trainStore.epochs = Number(config.epochs)
                trainStore.currentEpochs = epoch + 1
            }
        }
    }).then( async () => {
        const result = await model.save('localstorage://' + '【模型】 - ' + config.name)
        ElNotification({
            title: '训练完成',
            message: config.name + '已训练完成！',
            type: 'success',
          })
        model.predict(tf.tensor3d([x[x.length - 1]], [1, consecutiveDays, 3])).print();
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