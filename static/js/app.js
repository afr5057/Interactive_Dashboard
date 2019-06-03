function buildMetadata(sample) {

  // @TODO: Compvare the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;

  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(function (response) {
    var data = response;
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("p")
        .text(`${key}:${value}`)
    })
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then(function (sampleData) {

    const otu_ids = sampleData.otu_ids;
    const otu_labels = sampleData.otu_labels;
    const sample_values = sampleData.sample_values;

    // @TODO: Build a Bubble Chart using the sample data
    // https://plot.ly/javascript/bubble-charts/

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      // paper_bgcolor: rgb(188, 252, 252),
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Rainbow',
        // COLORSCALE OPTIONS: Blackbody, Electric, Earth, Bluered, YlOrRd, YlGnBu, RdBu, Portland, Picnic, Jet, Hot, Greys, Greens, Rainbow
        type: 'scatter',
        
      }
    }];
    var bubbleLayout = {
      title: '<b>Sample Frequency</b>',
      // margin: { t: 70, l: 10, r: 10, b: 15},
      // paper_bgcolor: rgb(188, 252, 252),
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
    };

    Plotly.plot('bubble', bubbleData, bubbleLayout, {responsive: true});

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // https://plot.ly/javascript/pie-charts/

    var ultimateColors = [
      ['rgb(56, 75, 126)', 'rgb(18, 36, 37)', 'rgb(34, 53, 101)', 'rgb(36, 55, 57)', 'rgb(6, 4, 4)'],
      ['rgb(177, 127, 38)', 'rgb(205, 152, 36)', 'rgb(99, 79, 37)', 'rgb(129, 180, 179)', 'rgb(124, 103, 37)'],
      ['rgb(33, 75, 99)', 'rgb(79, 129, 102)', 'rgb(151, 179, 100)', 'rgb(175, 49, 35)', 'rgb(36, 73, 147)'],
      ['rgb(146, 123, 21)', 'rgb(177, 180, 34)', 'rgb(206, 206, 40)', 'rgb(175, 51, 21)', 'rgb(35, 36, 21)']
    ];
    var pieData = [{
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie',
      name: 'Top Ten Samples',
      marker: {
        colors: ultimateColors[0],
      }
    }];

    var pieLayout = {
      margin: { t: 70, l: 10, r: 5, b: 5},
      title: {
        text: "<b>Top 10 Samples</b>"
      },
    }


    Plotly.plot('pie', pieData, pieLayout, {responsive: true});

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();