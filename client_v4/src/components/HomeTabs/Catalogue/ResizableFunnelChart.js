import React, { useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import funnel from "highcharts/modules/funnel";
import highchartsMore from "highcharts/highcharts-more";

import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

import "./ResizableFunnelChart.css";
import { ColumnHeightOutlined } from '@ant-design/icons';

// Initialize Highcharts modules
funnel(Highcharts);
highchartsMore(Highcharts);

// Disable Highcharts watermark
Highcharts.setOptions({
  credits: {
    enabled: false,
  },
});

const data = [
  { name: "Landing", value: 33.3, fill: "#F9B8A6" },
  { name: "Site", value: 26.7, fill: "#F39F8E" },
  { name: "App", value: 20.0, fill: "#E07E65" },
  { name: "Board", value: 13.3, fill: "#8E4E2A" },
  { name: "Bill", value: 6.7, fill: "#653712" },
];

const ResizableFunnelChart = () => {
  const [height, setHeight] = useState(300);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      Highcharts.chart(chartRef.current, {
        chart: {
          type: "funnel",
        },
        title: {
          text: "",
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b> {point.y:.1f}%",
            },
            neckWidth: "30%",
            neckHeight: "25%",
            width: "70%"
          },
        },
        series: [{
            name: 'Catalogue',
            data: data.map(({ name, value, fill }) => ({name, y: value, color: fill}))
          }]
      });
    }
  }, [data]);

  const onResize = (event, { size }) => {
    setHeight(size.height);
  };

  return (
    <ResizableBox
      width="100%"
      height={height}
      axis="y"
      minConstraints={[300, 100]}
      maxConstraints={[300, 400]}
      onResize={onResize}
      handle={
        <span className="catalogue-resizable-handle">
          <ColumnHeightOutlined />
        </span>
      }
    >
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </ResizableBox>
  );
};

export default ResizableFunnelChart;