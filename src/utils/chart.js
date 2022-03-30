export default {
  stockOptions: {
    splitData: (rawData) => {
      const categoryData = [];
      const values = [];
      for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
      }
      return {
        categoryData: categoryData,
        values: values,
      };
    },
    calculateMA: (dayCount, data0) => {
      var result = [];
      for (var i = 0, len = data0.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += +data0.values[i - j][1];
        }
        result.push(sum / dayCount);
      }
      return result;
    },
    option: {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: ["日K", "MA5", "MA10", "MA20", "MA30"],
        orient: "vertical",
        y: 50,
        x: 50,
        borderWidth: 1,
        padding: 10,
        itemGap: 15,
      },
      xAxis: {
        type: "category",
        data: [], // categoryData
        offset: "500",
        // boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        // min: 'dataMin',
        // max: 'dataMax'
      },
      yAxis: {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      dataZoom: [
        {
          type: "inside",
          start: 50,
          end: 100,
        },
        {
          show: false,
          type: "slider",
          top: "90%",
          start: 50,
          end: 100,
        },
      ],
      series: [
        {
          name: "日K",
          type: "candlestick",
          data: [], // values
          itemStyle: {
            color: "#ec0000",
            color0: "#00da3c",
            borderColor: "#8A0000",
            borderColor0: "#008F28",
          },
          markPoint: {
            label: {
              formatter: function (param) {
                return param != null ? Math.round(param.value) + "" : "";
              },
            },
            data: [
              {
                name: "Mark",
                coord: ["2013/5/31", 2300],
                value: 2300,
                itemStyle: {
                  color: "rgb(41,60,85)",
                },
              },
              {
                name: "highest value",
                type: "max",
                valueDim: "highest",
              },
              {
                name: "lowest value",
                type: "min",
                valueDim: "lowest",
              },
              {
                name: "average value on close",
                type: "average",
                valueDim: "close",
              },
            ],
            tooltip: {
              formatter: function (param) {
                return param.name + "<br>" + (param.data.coord || "");
              },
            },
          },
          markLine: {
            symbol: ["none", "none"],
            data: [
              [
                {
                  name: "from lowest to highest",
                  type: "min",
                  valueDim: "lowest",
                  symbol: "circle",
                  symbolSize: 10,
                  label: {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: false,
                    },
                  },
                },
                {
                  type: "max",
                  valueDim: "highest",
                  symbol: "circle",
                  symbolSize: 10,
                  label: {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: false,
                    },
                  },
                },
              ],
              {
                name: "min line on close",
                type: "min",
                valueDim: "close",
              },
              {
                name: "max line on close",
                type: "max",
                valueDim: "close",
              },
            ],
          },
        },
        {
          name: "MA5",
          type: "line",
          data: [], // calculateMA(5, data0)
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA10",
          type: "line",
          data: [],
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA20",
          type: "line",
          data: [],
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA30",
          type: "line",
          data: [],
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    },
  },
  macdOptions: {
    splitData: (rawData) => {
      const categoryData = new Array(33).fill("-");
      const dif = new Array(33).fill(0);
      const dea = new Array(33).fill(0);
      const hist = new Array(33).fill(0);
      for (var i = 0; i < rawData.length; i++) {
        categoryData.push(String(i));
        dif.push(rawData[i][0]);
        dea.push(rawData[i][1]);
        hist.push(rawData[i][2]);
      }
      return {
        categoryData: categoryData,
        dif: dif,
        dea: dea,
        hist: hist,
      };
    },
    option: {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["bar", "line"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ["MACD", "DEA", "DIF"],
        orient: "vertical",
        y: 50,
        x: 50,
        borderWidth: 1,
        padding: 10,
        itemGap: 15,
      },
      dataZoom: [
        {
          type: "inside",
          start: 50,
          end: 100,
        },
        {
          show: true,
          type: "slider",
          top: "90%",
          start: 50,
          end: 100,
        },
      ],
      xAxis: [
        {
          type: "category",
          data: [], // 日期
          axisPointer: {
            type: "shadow",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "MACD",
        },
        {
          type: "value",
          name: "DEA",
        },
      ],
      series: [
        {
          name: "MACD",
          type: "bar",
          color: "#ec0000",
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: [],
        },
        {
          name: "DEA",
          type: "line",
          color: "#6076ff",
          smooth: true,
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: [],
        },
        {
          name: "DIF",
          type: "line",
          color: "#ffd700",
          smooth: true,
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: [],
        },
      ],
    },
  },
  lineChart: {
    option: {
      grid: {
        x: 40,
        y: 40,
        x2: 40,
        y2: 40
      },
      xAxis: {
        type: "category",
        data: [],
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        trigger: 'axis'
      },
      series: [
        {
          data: [],
          type: "line",
          smooth: true,
        },
      ],
    },
  },
};
