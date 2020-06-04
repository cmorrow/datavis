import React, { Component } from 'react'
import axios from 'axios'
import * as d3 from "d3";

export default class Chart extends Component {

   constructor(props) {
      super(props);
      this.state = {
         chartEl: null,
         data: null,
         rows: null,
         barHeight: 25,
         order: 'DESC',
         prop: 'date',
         transitionCount: 0
      };
    }

   componentDidMount() {
      const vm = this;
      axios.get('./data/Covid-US-06032020.json')
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
      const vm = this;
      data = data.data;
      const chartEl = d3.select(this.rootNode);
      const dailyScale = d3.scaleLinear();
      const maxValue = d3.max(data, function(d) { return +d.daily_confirmed_cases;} );
      const minValue = d3.min(data, function(d) { return +d.daily_confirmed_cases;} );
      const colorScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([d3.rgb('#0000ff'), d3.rgb("#ff0000")]);

      dailyScale
      .domain([minValue, maxValue])
      .range([20, 100]);

      // set data with date prop used
      const rows = chartEl.selectAll("div").data(data, d => d.date);
      

      const row = rows.enter()
         .append('div')
         .attr("class", "chart-row")
         .style("top", (d, i) => (i * (vm.state.barHeight + 1)) + 'px');

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
         rows: rows,
         data: data,
         dailyScale,
         colorScale
      });

   }

   sortChart(order, prop){
      const vm = this;
      const chartEl = d3.select(this.rootNode);

      let data;
      let transitionCount = vm.state.transitionCount + 1;
      if(prop === 'date'){
         data = vm.state.data.slice().sort((a,b) => d3[order](a[prop], b[prop]));
      }else{
         data = vm.state.data.slice().sort((a,b) => d3[order](+a[prop], +b[prop]));
      }

      const trans = d3.transition()
      .duration(750)
      .ease(d3.easeQuadInOut);

      const rows = d3.selectAll('div.chart-row');
      rows.data(data, d => d.date)
      .style('z-index', transitionCount)
      .transition(trans)
      .delay((d, i) => i * 10)
      .style('top', (d, i) => {
         const val = (i * (vm.state.barHeight + 1)) + 'px';
         return val;
      })
      .style('opacity', 0.5)
      .transition(500)
      .style('opacity', 1)

      const bar = rows.select('.bar')
         .style('background-color', function(d){
            var percent = Math.floor(vm.state.dailyScale(+d.daily_confirmed_cases));
            return vm.state.colorScale(+d.daily_confirmed_cases);
         })
         .style('width', function(d) {
            var percent = Math.floor(vm.state.dailyScale(+d.daily_confirmed_cases));
            return percent + '%';
         });

      rows
      .select('.date')
      .text(d => d.date);

      rows
      .select('.value')
      .text(d => d.daily_confirmed_cases);

      vm.setState({
         prop,
         order: (order === 'ascending') ? 'ASC' : 'DESC',
         transitionCount
      });
   }

   _setRef (componentNode) {
      this.rootNode = componentNode;
   }

   render() {
      return (
         <div className="chart bg-white pt-3">
            <div className="container-fluid">
               <div className="row">
                  <div className="col">
                     Sorting <strong>{this.state.prop}</strong> {this.state.order}
                  </div>
               </div>
               <div className="row mb-2">
                  <div className="col col-sm-8">
                     <button onClick={() => this.sortChart('descending', 'date')} className="btn btn-primary" type="button">Date DESC</button>
                     <button onClick={() => this.sortChart('ascending', 'date')} className="btn btn-primary ml-2" type="button">Date ASC</button>
                  </div>
                  <div className="col col-sm-4 text-sm-right">
                     <button onClick={() => this.sortChart('descending', 'daily_confirmed_cases')} className="btn btn-primary" type="button">Cases DESC</button>
                     <button onClick={() => this.sortChart('ascending', 'daily_confirmed_cases')} className="btn btn-primary ml-2" type="button">Cases ASC</button>
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
