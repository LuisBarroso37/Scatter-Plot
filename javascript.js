let data;
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

//GET json from url using fetch
async function getData(Url) {
  const fetchRes = await fetch(Url);
  const fetchResData = await fetchRes.json();
  
  return fetchResData;
}

//Get data and use it to make scatter plot graph
getData(url).then(val => {
  data = val;

const timeParse = d3.timeParse("%M:%S");
const timeFormat = d3.timeFormat("%M:%S");
  
let timeArr = [];
  data.forEach(val => {
  timeArr.push(timeParse(val.Time));
});
  
//Scatter plot\\
  const w = 900;
  const h = 600;
  const padding = 70;
  const minTime = d3.min(timeArr, d => d);
  const maxTime = d3.max(timeArr, d => d);
  const minYear = d3.min(data, d => d.Year);
  const maxYear = d3.max(data, d => d.Year); 
  
  //Scales
  const xScale = d3.scaleLinear()
                   .domain([minYear - 1, maxYear + 1])
                   .range([padding, w - padding]);
  
  const yScale = d3.scaleTime()
                   .domain([minTime, maxTime])
                   .range([padding, h - padding]);
  
  //Tooltip
  const tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip');
  
  //Circle
  const svg = d3.select('#chart')
                .append('svg')
                .attr('width', w)
                .attr('height', h);
  
  svg.selectAll('circle') 
     .data(data)
     .enter()
     .append('circle')
     .attr('cx', d => xScale(d.Year))
     .attr('cy', d => yScale(timeParse(d.Time)))
     .attr('r', d => 8)
     .attr('class', 'dot')
     .attr('data-xvalue', d => d.Year)
     .attr('data-yvalue', d => timeParse(d.Time))
     .attr('fill', d => d.Doping == '' ? '#33ff33' : '#ff3333')
     .on('mouseover', d => {
      tooltip.style("left", d3.event.pageX + 20 + "px")
             .style("top", d3.event.pageY - 100 + "px")
             .style("display", "inline-block")
             .style('opacity', 1)
             .html(`Name: ${d.Name}<br> Nationality: ${d.Nationality}<br>Place: ${d.Place}<br>Time: ${d.Time}<br>Year: ${d.Year}${d.Doping ? `<br><br/> ${d.Doping}` : ''}`)
             .attr('data-year', d.Year);
     })
     .on('mouseout', d => {
      tooltip.style('opacity', 0)
             .style('display', 'none');
     });
  
  //Axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  svg.append('g')
     .attr('transform', `translate(0, ${(h - padding)})`)
     .attr('id', 'x-axis')
     .call(xAxis);
    
  svg.append('g')
     .attr('transform', `translate(${padding}, 0)`)
     .attr('id', 'y-axis')
     .call(yAxis);
  
//Axes labels
  svg.append('text')
     .attr('transform', `translate(${(w/2)}, ${(h - padding + 50)})`)
     .attr('class', 'label')
     .text('Year');
  
  svg.append('text')
     .attr('transform', 'rotate(-90)')
     .attr('y', padding - 50)
     .attr('x', -(h / 2))
     .attr('class', 'label')
     .text('Time in minutes');
  
  //Legend
  svg.append('text')
     .attr('y', (h - padding) - 200)
     .attr('x', w - padding - 80)
     .attr('id', 'legend')
     .text('No doping allegations');
  
  svg.append('text')
     .attr('y', (h - padding) - 180)
     .attr('x', w - padding - 80)
     .attr('id', 'legend')
     .text('Doping allegations');
  
  svg.append("rect")
    .attr('y', (h - padding) - 215)
    .attr('x', w - padding - 105)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', '#33ff33');
  
  svg.append("rect")
    .attr('y', (h - padding) - 195)
    .attr('x', w - padding - 105)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', '#ff3333');
});