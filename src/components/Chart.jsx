import React, { Component } from 'react'
import axios from 'axios'
import * as d3 from "d3";

const barHeight = 25;

export default class Chart extends Component {

   constructor(props) {
      super(props);
      this.state = {
         data: null,
      };
    }

   getData = () => {
      console.log('get data!!');
   }

   componentDidMount() {
      const vm = this;
      axios.get('/data/Covid-US-06032020.json')
      .then(function (res) {
         // handle success
         vm.setState({
            data: res.data
         });
         vm.createChart(res)
      })
      .catch(function (error) {
         // handle error
         console.log(error);
      })
   }

   createChart(data){
      data = data.data;
      const chartEl = d3.select(this.rootNode);
      const dailyScale = d3.scaleLinear();
      const maxValue = d3.max(data, function(d) { return +d.daily_confirmed_cases;} );
      const minValue = d3.min(data, function(d) { return +d.daily_confirmed_cases;} );
      var colorScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([d3.rgb('#0000ff'), d3.rgb("#ff0000")]);

      dailyScale
      .domain([minValue, maxValue])
      .range([0, 100]);

      const rows = chartEl.selectAll("div").data(data);

      const row = rows.enter()
         .append('div')
         .attr("class", "chart-row")
         .style("top", (d, i) => (i * (barHeight + 1)) + 'px');

      row.append('span')
         .attr('class', 'date')
         .text(d => d.date)

      

      const bar = row.append('div')
         .attr('class', 'bar')
         .style("background-color", function(d){
            var percent = Math.floor(dailyScale(+d.daily_confirmed_cases));
            return colorScale(+d.daily_confirmed_cases) 
         })
         .style('width', function(d) {
            var percent = Math.floor(dailyScale(+d.daily_confirmed_cases));
            return percent + "%";
         });

      bar.append('span')
         .attr('class', 'value')
         .text(d => d.daily_confirmed_cases);
         
      

      this.setState({
         chartEl: null,
         items: rows,
         data: data
      });

   }

   sortChart(order){
      const chartEl = d3.select(this.rootNode);
      console.log(order)
      const data = this.state.data.slice().sort((a,b) => d3[order](+a.daily_confirmed_cases, +b.daily_confirmed_cases));

      const rows = chartEl.selectAll("div").data(data);

      rows.data(data)
      .transition(1000)
      .delay((d, i) => i * 20)
      .style("top", (d, i) => {
         const val = (i * barHeight) + 1 + 'px';
         return val;
      });
   }

   _setRef (componentNode) {
      this.rootNode = componentNode;
   }

   render() {
      return (
         <div className="chart">
            <div className="container-fluid">
               <div className="row mb-2">
                  <div className="col col-sm-8">
                     <button onClick={() => this.sortChart('ascending')} className="btn btn-primary" type="button">Sort ASC</button>
                     <button onClick={() => this.sortChart('descending')} className="btn btn-primary ml-2" type="button">Sort DESC</button>
                  </div>
                  <div className="col col-sm-4 text-sm-right">
                     <button onClick={() => this.sortChart('ascending')} className="btn btn-primary" type="button">Sort ASC</button>
                     <button onClick={() => this.sortChart('descending')} className="btn btn-primary ml-2" type="button">Sort DESC</button>
                  </div>
               </div>
               <div className="row">
                  <div className="col">
                     <div className="d3-chart" ref={this._setRef.bind(this)}></div>
                  </div>
               </div>
            </div>
         </div>
         
      )
   }
}
