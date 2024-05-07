import React, { Fragment, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgChartsReact } from "ag-charts-react";

export default function Chart() {
  const [options, setOptions] = useState({
    theme:'ag-default-dark',
    // Data: Data to be displayed within the chart
    data: [
      { month: "Jan",  TOKENS: 162000 },
      { month: "Mar",  TOKENS: 302000 },
      { month: "May",  TOKENS: 800000 },
      { month: "Jul",  TOKENS: 1254000 },
      { month: "Sep",  TOKENS: 950000 },
      { month: "Nov",  TOKENS: 200000 },
    ],
    // Series: Defines which chart type and data to use
    series: [
      { type: "bar", xKey: "month", yKey: "TOKENS" },
      { type: "line", xKey: "month", yKey: "avg" },
    ],
    // Axes: Configure the axes for the chart
    axes: [
      // Display category (xKey) as the bottom axis
      {
        type: "category",
        position: "bottom",
      },
      // Use left axis for 'TOKENS' series
      {
        type: "number",
        position: "left",
        keys: ["TOKENS"],
      },
      // Use right axis for 'avgTemp' series
      {
        type: "number",
        position: "right",
        keys: ["avgTemp"],
      },
     
    ],
  });

  return(
    <div style={{ width: '500px', height: '300px' }} >
    <h3>Usage</h3>
     <AgChartsReact options={options} /></div>
   );
};
