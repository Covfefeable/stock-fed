import request from "@/utils/request.js";

const getTestData = async (config) => {
  let dataSource = [];
  let target = [];
  if (config.dataSource === "macd") {
    await request
      .calMACD({
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
  } else if (config.dataSource === "kdj") {
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
      target.splice(0, 33);
    });

  let [x, consecutiveDays] = [[], Number(config.consecutiveDays)];
  dataSource.map((item, index) => {
    x.push(dataSource.slice(index, index + consecutiveDays));
  });
  x = x.slice(0, x.length - consecutiveDays);
  return x
};
export default { getTestData };
