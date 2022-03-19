// 当天数据17点后才会更新
let delay = new Date().getHours() > 17 ? 0 : 3600 * 1000 * 24 * 1;
export default {
  // 当天暂时不支持选取
  shortcuts: [
    {
      text: "最近一周",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 - delay);
        end.setTime(end.getTime() - delay);
        return [start, end];
      },
    },
    {
      text: "最近一个月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 - delay);
        end.setTime(end.getTime() - delay);
        return [start, end];
      },
    },
    {
      text: "最近三个月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90 - delay);
        end.setTime(end.getTime() - delay);
        return [start, end];
      },
    },
    {
      text: "最近一年",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 - delay);
        end.setTime(end.getTime() - delay);
        return [start, end];
      },
    },
    {
      text: "最近三年",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1093 - delay);
        end.setTime(end.getTime() - delay);
        return [start, end];
      },
    },
    {
      text: "最近五年",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1823 - delay);
        end.setTime(end.getTime() - delay);
        return [start, end];
      },
    },
    {
      text: "最近十年",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3648 - delay);
        end.setTime(end.getTime() - delay);
        return [start, end];
      },
    },
  ],
  kOptions: [
    {
      label: "5分",
      disabled: false,
    },
    {
      label: "15分",
      disabled: false,
    },
    {
      label: "30分",
      disabled: false,
    },
    {
      label: "60分",
      disabled: false,
    },
    {
      label: "日k",
      disabled: false,
    },
    {
      label: "周k",
      disabled: false,
    },
    {
      label: "月k",
      disabled: false,
    },
  ],
  lossOptions: [{
    label: '均方误差',
    value: 'meanSquaredError'
  }, {
    label: '绝对误差',
    value: 'meanAbsoluteError'
  }, {
    label: '计算加权误差',
    value: 'computeWeightedLoss'
  }, {
    label: '余弦距离误差',
    value: 'cosineDistance'
  }, {
    label: 'hinge 误差',
    value: 'hingeLoss'
  }, {
    label: 'huber 误差',
    value: 'huberLoss'
  }, {
    label: 'log 误差',
    value: 'logLoss'
  }, {
    label: 'sigmoid 交叉熵误差',
    value: 'sigmoidCrossEntropy'
  }, {
    label: 'softmax 交叉熵误差',
    value: 'softmaxCrossEntropy'
  }],
  optimizerOptions: [{
    label: 'Adam 算法',
    value: 'adam'
  }, {
    label: '随机梯度下降',
    value: 'sgd'
  }, {
    label: 'momentum 算法',
    value: 'momentum'
  }, {
    label: 'adagrad 算法',
    value: 'adagrad'
  }, {
    label: 'adadelta 算法',
    value: 'adadelta'
  }, {
    label: 'adamax 算法',
    value: 'adamax'
  }, {
    label: 'rmsprop 算法',
    value: 'rmsprop'
  }]
};
