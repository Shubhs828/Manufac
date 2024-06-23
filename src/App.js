import React from 'react';
import { Table } from '@mantine/core';
const data = require('./Dataset.json');

// Step 1: Process the data to extract necessary information
const aggregatedByYear = {};
const aggregatedByCrop = {};

data.forEach(entry => {
  const year = entry.Year.split(',')[1].trim(); // Extracting year from "Financial Year (Apr - Mar), 1950"
  const crop = entry['Crop Name'];
  const production = parseFloat(entry['Crop Production (UOM:t(Tonnes))']) || 0;
  const Yield = parseFloat(entry['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']) || 0;
  const area = parseFloat(entry['Area Under Cultivation (UOM:Ha(Hectares))']) || 0;

  // Aggregate by year
  if (!aggregatedByYear[year]) {
    aggregatedByYear[year] = {
      maxProduction: { crop: '', value: -Infinity },
      minProduction: { crop: '', value: Infinity }
    };
  }

  if (production > aggregatedByYear[year].maxProduction.value) {
    aggregatedByYear[year].maxProduction = { crop, value: production };
  }

  if (production < aggregatedByYear[year].minProduction.value) {
    aggregatedByYear[year].minProduction = { crop, value: production };
  }

  // Aggregate by crop
  if (!aggregatedByCrop[crop]) {
    aggregatedByCrop[crop] = { totalYield: 0, totalArea: 0, count: 0 };
  }

  aggregatedByCrop[crop].totalYield += Yield;
  aggregatedByCrop[crop].totalArea += area;
  aggregatedByCrop[crop].count++;
});

// Step 2: Calculate averages
const averageByCrop = {};
Object.keys(aggregatedByCrop).forEach(crop => {
  const avgYield = aggregatedByCrop[crop].totalYield / aggregatedByCrop[crop].count;
  const avgArea = aggregatedByCrop[crop].totalArea / aggregatedByCrop[crop].count;
  averageByCrop[crop] = {
    avgYield: avgYield.toFixed(3),
    avgArea: avgArea.toFixed(3)
  };
});

// Step 3: Generate tables data
const data1 = Object.keys(aggregatedByYear).map(year => ({
  year,
  maxProduction: aggregatedByYear[year].maxProduction,
  minProduction: aggregatedByYear[year].minProduction
}));

const data2 = averageByCrop;

// Step 4: Define table components
const Table1 = ({ data }) => (
  <Table>
    <thead>
      <tr>
        <th>Year</th>
        <th>Crop with Max Production</th>
        <th>Crop with Min Production</th>
      </tr>
    </thead>
    <tbody>
      {data.map(entry => (
        <tr key={entry.year}>
          <td>{entry.year}</td>
          <td>{entry.maxProduction.crop}</td>
          <td>{entry.minProduction.crop}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const Table2 = ({ data }) => (
  <Table>
    <thead>
      <tr>
        <th>Crop</th>
        <th>Average Yield</th>
        <th>Average Area</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(data).map(crop => (
        <tr key={crop}>
          <td>{crop}</td>
          <td>{data[crop].avgYield}</td>
          <td>{data[crop].avgArea}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

// Step 5: Define the App component
const App = () => (
  <div>
    <h2>Table 1: Yearly Max/Min Production</h2>
    <Table1 data={data1} />

    <h2>Table 2: Average Yield and Area</h2>
    <Table2 data={data2} />
  </div>
);

export default App;
