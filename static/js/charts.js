function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {

    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samples=data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray=samples.filter(obj=>obj.id==sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata=data.metadata;
    var metadataFilter=metadata.filter(sampleobj=>sampleobj.id==sample);

    // Create a variable that holds the first sample in the array.
    var results=sampleArray[0];
  

    // 2. Create a variable that holds the first sample in the metadata array.
    var metaresult=metadataFilter[0];
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs=results.otu_ids;
    var otuLabels=results.otu_labels;
    var sampleValues=results.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wash_freq=parseInt(metaresult.wfreq);
   
    // Create the yticks for the bar chart.

    var yticks = otuIDs.slice(0,10).reverse().map(function (name) {return `OTU ${name}`})
    var xticks=sampleValues.slice(0,10).reverse();
    var labels=otuLabels.slice(0,10).reverse();

    //Create the trace for the barchart

    var barData = [{
      x: xticks,
      y: yticks,
      type:'bar',
      orientation:'h',
      text:labels,
      marker:{
        color: 'darkcyan'
      }

    }
      
    ];

    //Create the layout for the bar chart

    var barLayout = {
      title:"Top 10 Bacteria Cultures Found"
     
    };

    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot("bar",barData,barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues ,
      text: otuLabels,
      hoverinfo:'text',
      mode: 'markers',
      marker:{
        size: sampleValues,
        color: otuIDs,
        colorscale:"Earth"

      }
    }
   
    ];

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend:false
      
    };

    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 


    // 4. Create the trace for the gauge chart.
    var gaugeData = [ {
      domain: { x: [0, 1], y: [0, 1] },
      value: wash_freq,
      title: {text: "Belly Button Washing Frequency <br> Scrubs per Week", font: {size: 18}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10]},
        bar: { color: "black" },
        steps: [
          { range: [0, 1], color: 'teal' },
          { range: [1, 2], color: 'teal' },
          { range: [2, 3], color: 'turquoise' },
          { range: [3, 4], color: 'turquoise' },
          { range: [4, 5], color: 'aquamarine' },
          { range: [5, 6], color: 'aquamarine' },
          { range: [6, 7], color: 'lightseagreen' },
          { range: [7, 8], color: 'lightseagreen' },
          { range: [8, 9], color: 'limegreen' },
          { range: [9, 10], color: 'limegreen' }
        ],
      }  
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 500, 
      margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  
  });
};
