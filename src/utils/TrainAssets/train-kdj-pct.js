import request from "@/utils/request.js";
import { ElNotification } from "element-plus";
import { useTrainStore } from "@/store/main.js";
import Worker from "./train-kdj-pct.worker";

const train = (source, target, config) => {
    const trainStore = useTrainStore();
    trainStore.loss = [];
    trainStore.epochs = 0;
    trainStore.currentEpochs = 0;
    trainStore.isTraining = true;
    trainStore.profit = []
    trainStore.aggressiveProfit = []
    trainStore.profitConclude = []

    let [x, y, consecutiveDays] = [[], [], Number(config.consecutiveDays)];
    source.map((item, index) => {
        x.push(source.slice(index, index + consecutiveDays));
    });
    target.map((item, index) => {
        y.push(target[index + consecutiveDays]);
    });
    x = x.slice(0, x.length - consecutiveDays);
    y = y.slice(0, y.length - consecutiveDays);

    const data = { x, y, config }
    data.action = 'train'
    let worker = new Worker();
    worker.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.action === 'updateStore') {
            trainStore.loss.push(data.loss)
            trainStore.epochs = data.epochs
            trainStore.currentEpochs = data.currentEpochs
        } else if (data.action === 'updateProgress') {
            trainStore.isTraining = data.isTraining
        } else if (data.action === 'updateProfit') {
            trainStore.profit = data.profit
            trainStore.aggressiveProfit = data.aggressiveProfit
            trainStore.profitConclude = data.profitConclude
            worker.terminate()
        }
    };
    worker.postMessage(JSON.stringify(data));
};

const startTrain = async (config) => {
    let dataSource = [];
    let target = [];
    if (config.dataSource === "kdj") {
        await request
            .calKDJ({
                stock_code: config.targetStock,
                start_date: config.date[0],
                end_date: config.date[1],
            })
            .then((res) => {
                res.data.data.map((item) => {
                    let newArr = [];
                    item.map((sub) => {
                        newArr.push(Number(sub.toFixed(3)));
                    });
                    dataSource.push(newArr);
                });
            });
    }

    await request
        .getKData({
            stock_code: config.targetStock,
            start_date: config.date[0],
            end_date: config.date[1],
            frequency: "d",
        })
        .then((res) => {
            res.data.data.map((item) => {
                target.push(Number(Number(item[8]).toFixed(3)));
            });
            target.splice(0, 8);
        });

    if (dataSource.length > target.length) {
        dataSource.length = target.length;
    } else if (dataSource.length < target.length) {
        target.length = dataSource.length;
    }

    train(dataSource, target, config);
};

export default {
    startTrain,
};
