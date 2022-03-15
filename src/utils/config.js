export default {
  // 当天暂时不支持选取
  shortcuts: [
    {
      text: "最近一周",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 8);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        return [start, end];
      },
    },
    {
      text: "最近一个月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        return [start, end];
      },
    },
    {
      text: "最近三个月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        return [start, end];
      },
    },
    {
      text: "最近一年",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 366);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        return [start, end];
      },
    },
    {
      text: "最近三年",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1094);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        return [start, end];
      },
    },
    {
      text: "最近五年",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1824);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        return [start, end];
      },
    },
    {
      text: "最近十年",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3649);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
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
};
