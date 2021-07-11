function init() {
    
  var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data)
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
};
 
// call the init function
init();

// create function optionChanged
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
};

// create function build meta data table
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
      
    Object.entries(result).forEach(([key,value]) => 
    PANEL.append("h6").text(key + ": " + value)
    )
    });
};

// create build charts function
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    // variable that holds the array of samples
    var samples = data.samples;
    // variable that holds the array of choosen sample number
    var samplesFilter = samples.filter(samp => samp.id == sample);
    // variable that holds that first sample in the array
    var result = samplesFilter[0];


    // variables to hold arrays for otu ids, labels, and sample values 
    var otuID = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    var yticks = otuID.slice(0,10).reverse().map(function(num){
      return "OTU: " + num
    });

    // create Bar Data for trace
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // create bar layout 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {
          title: "Sample Values"
        }
    };

    // call the plot
    Plotly.newPlot("bar", barData, barLayout); 


    //Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuID,
        colorscale: "Earth"
        }
    }];

    //Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Samples Per Culture",
      xaxis: {
        title: "OTU IDs"
      }
    };

    //Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout,{responsive: true}); 


    // create variable that holds array of metadata
    var metadata = data.metadata;
    // variable that holds array for choose metadata sample
    var metadataFilter = metadata.filter(meta => meta.id == sample);
    // variable that holds first metadata obj
    var metaResult = metadataFilter[0];
        
    // convert wash frequency to float
    var washFreq = parseFloat(metaResult.wfreq)

    // data for gauge chart 
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Washes Per Week<br>"
        },
      gauge: {
        axis: { range: [0, 10], thickmode: "array", thickvals: [0,2,4,6,8,8,10], thicktext: [0,2,4,6,8,10]},
        bar: { color: "black" },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "yellowgreen"},
          {range: [8,10], color: "green"}
        ]
      }
    }];

    // create layout 
      var gaugeLayout = { 
         width: 600, height: 500, margin: { t: 0, b: 0 },
    };

    
    // plot guage plot
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

})
};

      
      


      



      






   
