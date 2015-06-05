Polymer({

  is: 'px-ts-chart',

  /**
   * Properties block, expose attribute values to the DOM via 'reflect'
   *
   * @property properties
   * @type Object
   */
  properties: {

    /**
     * Start time of zoom-ed area shown in the navigator
     *
     * @type {String}
     * @default undefined
     */
    rangeStart: {
      type: String,
      observer: 'rangeObserver'
    },

    /**
     * End time of zoom-ed area shown in the navigator
     *
     * @type {String}
     * @default undefined
     */
    rangeEnd: {
      type: String,
      observer: 'rangeObserver'
    },

    /**
     * Whether to show the zoom-able / scroll-able area at the bottom of the chart
     *
     * @type {Boolean}
     * @default true
     */
    navigatorEnabled:{
      type: Boolean,
      value: true
    },

    /**
     * See http://api.highcharts.com/highcharts#chart.backgroundColor
     *
     * @default rgb(255,255,255)
     */
    backgroundColor: {
      type: String,
      value: 'rgb(255,255,255)'
    },

    /**
     * See http://api.highcharts.com/highcharts#chart.events
     *
     * @default redraw function()
     */
    events: {
      type: Object,
      value: {
        redraw: function() {
          var extremes = this.xAxis[0].getExtremes();
          var tsChart = Polymer.dom(this.renderTo).parentNode.parentNode;

          if (tsChart.debounce) {//in export case this function will be called outside the realm of a polymer components
            tsChart.debounce(
              'set-extremes', function () {
                this.rangeStart = extremes.min;
                this.rangeEnd = extremes.max;
              }, 250);
          }
        },
        selection: function(evt) {
          if (evt.originalEvent.shiftKey) {
            return true;
          }
          else if (evt.xAxis) {
            var axis = evt.xAxis[0];
            this.xAxis[0].removePlotBand("selection");
            this.xAxis[0].addPlotBand({ // mark the weekend
              color: 'rgba(200,231,251,0.3)',
              from: axis.min,
              to: axis.max,
              id: "selection",

              label: {
                align: "right",
                useHTML: true,
                text: "<i class='fa fa-lg fa-search-plus mr- style-scope px-ts-chart' onclick='var wc=this; while(!wc.chart) {wc = wc.parentNode} wc.chart.xAxis[0].setExtremes(" + evt.xAxis[0].min + ", " + evt.xAxis[0].max + ");wc.chart.xAxis[0].removePlotBand(\"selection\")' title='Zoom to " + moment(evt.xAxis[0].min).format('LLL') + " to " + moment(evt.xAxis[0].max).format('LLL') + "'></i> <i class='fa fa-lg mr- fa-pencil style-scope px-ts-chart' onclick='alert(this.innerHTML)' title='Annotate'></i> <i class='fa fa-lg mr- fa-times style-scope px-ts-chart' onclick='var wc=this; while(!wc.chart) {wc = wc.parentNode} wc.chart.xAxis[0].removePlotBand(\"selection\");' title='Close selection'></i>"
              }
            });
            return false;
          }
        }
      }
    },

    /**
     * See http://api.highcharts.com/highcharts#plotOptions.series.events
     *
     * @default show & hide series function()
     */
    seriesEvents: {
      type: Object,
      value: {
        show: function() {
          var tsChart = Polymer.dom(this.chart.renderTo).parentNode.parentNode;
          // tsChart.chartState.seriesState = this.chart.series;
          tsChart.set('chartState.seriesState', this.chart.series)
        },
        hide: function() {
          var tsChart = Polymer.dom(this.chart.renderTo).parentNode.parentNode;
          // tsChart.chartState.seriesState = this.chart.series;
          tsChart.set('chartState.seriesState', this.chart.series)
        }
      }
    },

    /**
     * See http://api.highcharts.com/highcharts#chart.height
     *
     * @default 400
     */
    height: {
      type: Number,
      value: 400
    },

    /**
     * See http://api.highcharts.com/highcharts#chart.margin
     *
     * @default [90,30,30,30]
     */
    margin: {
      type: Array,
      value: [96,40,30,40]
    },

    /**
     * See http://api.highcharts.com/highcharts#chart.plotBorderWidth
     *
     * @default 1
     */
    plotBorderWidth: {
      type: Number,
      value: 1
    },

    /**
     * See http://api.highcharts.com/highcharts#chart.plotBorderWidth
     *
     * @default [0,0,25,0]
     */
    spacing: {
      type: Array,
      value: [0,0,25,0]
    },

    /**
     * See http://api.highcharts.com/highcharts#chart.zoomType
     *
     * @default "x"
     */
    zoomType: {
      type: String,
      value: 'x'
    },

    /**
     * URL for the chart export server (converts to image / pdf / etc). Default is null.  Can use "http://export.highcharts.com"
     * for demo purposes only...no intellectual property should go through that server.
     */
    exportServerUrl: {
      type: String
    },

    /**
     * Holds chart state for binding between charts & serialising chart settings.
     *
     * @default {}
     */
    chartState: {
      type: Object,
      value: function(){
        return {};
      },
      notify: true//,
      // observer: 'chartStateUpdated'
    },

    /**
     * Mapping of color name to rgb value for use in datavis.
     *
     * @type {Object}
     * @default Same is datavis colors in px-colors-design
     */
    dataVisColors: {
      type: Object,
      value: {
        "dv-basic-blue": "rgb(93, 165, 218)",
        "dv-basic-orange": "rgb(250, 164, 58)",
        "dv-basic-green": "rgb(96, 189, 104)",
        "dv-basic-pink": "rgb(241, 124, 176)",
        "dv-basic-brown": "rgb(178, 145, 47)",
        "dv-basic-purple": "rgb(178, 118, 178)",
        "dv-basic-yellow": "rgb(222, 207, 63)",
        "dv-basic-red": "rgb(241, 88, 84)",
        "dv-basic-gray": "rgb(77, 77, 77)",

        "dv-light-blue": "rgb(136, 189, 230)",
        "dv-light-orange": "rgb(251, 178, 88)",
        "dv-light-green": "rgb(144, 205, 151)",
        "dv-light-pink": "rgb(246, 170, 201)",
        "dv-light-brown": "rgb(191, 165, 84)",
        "dv-light-purple": "rgb(188, 153, 199)",
        "dv-light-yellow": "rgb(237, 221, 70)",
        "dv-light-red": "rgb(240, 126, 110)",
        "dv-light-gray": "rgb(140, 140, 140)",

        "dv-dark-blue": "rgb(38, 93, 171)",
        "dv-dark-orange": "rgb(223, 92, 36)",
        "dv-dark-green": "rgb(5, 151, 72)",
        "dv-dark-pink": "rgb(229, 18, 111)",
        "dv-dark-brown": "rgb(157, 114, 42)",
        "dv-dark-purple": "rgb(123, 58, 150)",
        "dv-dark-yellow": "rgb(199, 180, 46)",
        "dv-dark-red": "rgb(203, 32, 39)",
        "dv-dark-gray": "rgb(0, 0, 0)"
      }
    },

    /**
     * Mapping of color names in the order they should be applied to chart series.
     *
     * @type {Array}
     */
    seriesColorOrder: {
      type: Array,
      value: [
        "dv-basic-blue",
        "dv-basic-orange",
        "dv-basic-green",
        "dv-basic-pink",
        "dv-basic-brown",
        "dv-basic-purple",
        "dv-basic-yellow",
        "dv-basic-red",
        "dv-basic-gray",

        "dv-light-blue",
        "dv-light-orange",
        "dv-light-green",
        "dv-light-pink",
        "dv-light-brown",
        "dv-light-purple",
        "dv-light-yellow",
        "dv-light-red",
        "dv-light-gray",

        "dv-dark-blue",
        "dv-dark-orange",
        "dv-dark-green",
        "dv-dark-pink",
        "dv-dark-brown",
        "dv-dark-purple",
        "dv-dark-yellow",
        "dv-dark-red",
        "dv-dark-gray"
      ]
    }
  },

  observers: [
    'chartStateUpdated(chartState.*)'
  ],

  defaultYAxisConfig: null,

  defaultSeriesConfig: null,

  chartStateUpdated: function(evt){
    var chartExtremesHaveChanged = function (self){
      var currentChartExtremes = self.chart.xAxis[0].getExtremes();
      return (currentChartExtremes.max !== evt.value.chartZoom.max || currentChartExtremes.min !== evt.value.chartZoom.min);
    };

    var chartAndEventAreValid= function(self){
      return(self.chart && evt.value.srcElement);
    };

    if (chartAndEventAreValid(this)){
      if (chartExtremesHaveChanged(this)) {
        if (evt.value.srcElement !== this){
          this.chart.xAxis[0].setExtremes(evt.value.chartZoom.min, evt.value.chartZoom.max, true);
        }
      }
    }
  },

  /**
   * Lifecycle callback to create the Highchart 'chart' object and consume the config / series elements
   */
  ready: function() {
    var chartConfig = this.buildConfig();
    var _this = this;

    this.chart = new Highcharts.StockChart(chartConfig);

    var axisEls = Polymer.dom(this).querySelectorAll("px-chart-yaxis");
    var axisElsProcessed = 0;
    if (!axisEls || axisEls.length === 0) {
      //update the default yAxis with our own default options...
      this.defaultYAxisConfig = this.defaultYAxisConfig || document.createElement("px-chart-yaxis");
      this.chart.yAxis[0].update(this.defaultYAxisConfig.buildConfig(this.dataVisColors["dv-light-gray"]), /*redraw*/false);

      this.addInitialSeries();
    }
    else {
      axisEls.forEach(function(axisEl) {
        var yAxisReadyHandler = function(yAxisOrEvt) {
          var axis = yAxisOrEvt.target || yAxisOrEvt;
          var axisConfig = axis.buildConfig(_this.dataVisColors["dv-light-gray"]);
          _this.addYAxis(axisConfig, /*noRedraw*/true);
          axisElsProcessed++;
          if (axisElsProcessed === axisEls.length) {
            _this.addInitialSeries();
          }
        };
        axisEl.axisReady ? yAxisReadyHandler(axisEl) : axisEl.addEventListener("y-axis-ready", yAxisReadyHandler);
      });
    }
  },

  listeners: {
    'after-set-extremes': 'firechartStateUpdated'
  },

  firechartStateUpdated: function(evt){
    var extremes = this.chart.xAxis[0].getExtremes();
    var tsChart = Polymer.dom(this).node;
    tsChart.debounce(
      'set-chart-state', function() {
        this.set('chartState', {chartZoom: extremes, srcElement: this});
      }, 250);
  },

  /**
   * Internal callback for Highcharts config ready
   */
  addInitialSeries: function() {
    //find series elements in light dom ("Polymer.dom(this)" vs. "Polymer.dom(this.root)", which would be shadow dom)
    var seriesEls = Polymer.dom(this).querySelectorAll("px-chart-series");
    var _this = this;
    var seriesElReadyHandler = function(seriesElOrEvt) {
      var seriesEl = seriesElOrEvt.target || seriesElOrEvt;
      _this.addSeries(seriesEl.buildConfig(), /*noRedraw*/true);
      seriesEl.addEventListener("data-changed", function(evt) {
        _this.updateSeries(seriesEl.id, evt.detail.value, /*noRedraw*/false);
      });
      _this.chart.redraw();
      _this.debounce(
        'chart-reflow', function () {
          _this.chart.reflow();
        }, 50);
    };
    seriesEls.forEach(function (seriesEl) {
      seriesEl.seriesReady ? seriesElReadyHandler(seriesEl) : seriesEl.addEventListener("series-ready", seriesElReadyHandler);
    });
  },

  /**
   * Sets display string for start/end range when internal value changes
   */
  rangeObserver: function () {
    var controlsEl = Polymer.dom(this).querySelector("[data-controls]");
    if (controlsEl && controlsEl.set) {
      var mStart = moment(this.rangeStart);
      var mEnd = moment(this.rangeEnd);
      controlsEl.set("rangeStartDisplayStr", mStart.isValid() ? mStart.format('L') + " " + mStart.format("hh:ss") : null);
      controlsEl.set("rangeEndDisplayStr", mEnd.isValid() ? mEnd.format('L') + " " + mEnd.format("hh:ss") : null);
    }
  },

  addYAxis: function(axisConfig, defaultColor, noRedraw) {
    if (!axisConfig) {
      this.defaultYAxisConfig = this.defaultYAxisConfig || document.createElement("px-chart-yaxis");
      this.defaultYAxisConfig.offset = this.defaultYAxisConfig.offset + 10;
      axisConfig = this.defaultYAxisConfig.buildConfig(defaultColor || this.dataVisColors["dv-light-gray"]);
    }
    this.chart.addAxis(axisConfig, /*isX*/false, !noRedraw);
  },

  /**
   * Adds a series to the chart, adding a yAxis as needed
   *
   * @param {Object} seriesConfig
   *    @config {String} id
   *    @config {Array} data
   *    @config {Number} yAxis Optional. The axis index to which the series should be bound. Defaults to 0.
   *    @config {Number} lineWidth Optional.
   *    @config {Object} marker. Optional. Highcharts marker config
   *    @config {Object} tooltip. Optional. Highcharts tooltip config
   * @param {Boolean} noRedraw Optional. If true, does not force a chart redraw() after adding or updating the series
   */
  addSeries: function(seriesConfig, noRedraw) {
    if (seriesConfig && this.hasSeries(seriesConfig.id)) {
      this.updateAxisThreshold(seriesConfig, seriesConfig.upperThreshold, "upperThreshold");
      this.updateAxisThreshold(seriesConfig, seriesConfig.lowerThreshold, "lowerThreshold");
      this.updateSeries(seriesConfig.id, seriesConfig.data, noRedraw);
    }
    else {
      if (!seriesConfig) {
        this.defaultSeriesConfig = this.defaultSeriesConfig || document.createElement("px-chart-series");
        seriesConfig = this.defaultSeriesConfig.buildConfig();
      }
      if (!seriesConfig.id) {
        seriesConfig.id = this.chart.series.length;
      }
      if (seriesConfig.axisId) {//associate with yAxis
        for (var i = 0; i < this.chart.yAxis.length; i++) {
          if (this.chart.yAxis[i].userOptions.id === seriesConfig.axisId) {
            seriesConfig.yAxis = i;
            break;
          }
        }
        if (typeof seriesConfig.yAxis === "undefined") {
          throw new Error("Tried to associate series " + seriesConfig.id + " to yAxis id " + seriesConfig.axisId + " but it doesn't exist.");
        }
      }
      else if (typeof seriesConfig.yAxis === "undefined") {
        seriesConfig.yAxis = 0;//apply to default yAxis...
      }
      this.updateAxisThreshold(seriesConfig, seriesConfig.upperThreshold, "upperThreshold");
      this.updateAxisThreshold(seriesConfig, seriesConfig.lowerThreshold, "lowerThreshold");
      this.chart.addSeries(seriesConfig, !noRedraw);
      if (!noRedraw) {
        this.chart.reflow();
      }
    }
  },

  /**
   * Threshold lines are optionally bound to series. This function processes threshold values on a given series and
   * applies them on the y-axis that is associated with the given series.
   *
   * @param seriesConfig
   */
  updateAxisThreshold: function(seriesConfig, thresholdValue, id) {
    var yAxisIndex = seriesConfig.yAxis || 0;
    var yAxis = this.chart.yAxis[yAxisIndex];
    yAxis.removePlotLine(id);
    if (typeof thresholdValue !== "undefined") {
      var seriesColor = seriesConfig.color;
      if (!seriesColor) {
        if (this.hasSeries(seriesConfig.id)) {
          seriesColor = this.chart.get(seriesConfig.id).options.color;
        }
        else {
          seriesColor = this.chart.options.colors[this.chart.series.length];
        }
      }
      var thresholdConfig = {
        dashStyle: "ShortDash",
        color: seriesColor,
        value : thresholdValue,
        id: id,
        width : 1,
        label : {
          align: yAxis.options.opposite ? "right" : "left",
          style: {
            fontSize: '0.8rem',
            color: seriesColor
          },
          text : thresholdValue
        }
      };
      yAxis.addPlotLine(thresholdConfig);
    }
  },

  /**
   * Updates a series on the chart, adding a default series as needed.
   *
   * @param {String} seriesId
   * @param {Array} data
   * @param {Boolean} noRedraw Optional. If true, does not force a chart redraw() after adding or updating the series
   */
  updateSeries: function(seriesId, data, noRedraw) {
    if (!this.hasSeries(seriesId)) {
      this.addSeries(/*seriesConfig*/null, /*noRedraw*/true);
    }
    this.chart.get(seriesId).setData(data, !noRedraw);
    if (!noRedraw) {
      this.chart.reflow();
    }
  },

  /**
   * Removes a series from the chart
   *
   * @param {String} seriesId
   */
  removeSeries: function(seriesId) {
    this.chart.get(seriesId).remove();
  },

  /**
   * Returns true if the chart has a series with the given id
   *
   * @param {String} seriesId
   * @return {Boolean}
   */
  hasSeries: function(seriesId) {
    return (this.chart.get(seriesId) != null);
  },

  /**
   * Toggles display of points on the chart
   *
   * @param {Array} seriesIds Optional. seriesIds ids of the series to update, or null for all
   */
  togglePointMarkers: function(seriesIds) {
    var _this = this;
    var seriesToUpdate = seriesIds ? seriesIds.map(function(id) {return _this.chart.get(id)}) : this.chart.series;
    seriesToUpdate.forEach(function(series) {
      var existingMarkerOpts = series.options.marker;
      series.update({marker: {enabled: (!existingMarkerOpts || !existingMarkerOpts.enabled)}}, /*redraw*/false);
    });
    this.chart.redraw();
  },

  /**
   * Returns true of rangeStart / end has changed
   *
   * @param {Number} start Range start time in milliseconds since the epoch
   * @param {Number} end Range end time in milliseconds since the epoch
   * @return {Boolean}
   */
  hasExtremeChanged: function (start, end) {
    var extremes = this.chart.xAxis[0].getExtremes();
    return extremes.min !== start || extremes.max !== end;
  },

  /**
   * Sets the range start / end given number of months back from present
   *
   * @param {Number} value Number of (unit, e.g. "months") back from present
   * @param {String} unit momentjs time unit string, e.g. "months"
   */
  setRangeFromPresent: function (value, unit) {
    var m = moment();
    m.subtract(value, unit);
    this.rangeStart = m.valueOf();
    this.setExtremesIfChanged(this.rangeStart, this.rangeEnd);
  },

  /**
   * Fires one "refresh-series" event for each series on the chart, each event has the id of the series.
   */
  refreshAllSeries: function () {
    var _this = this;
    this.chart.series.forEach(function(series) {
      _this.fire("refresh-series", series.options.id);
    });
  },

  /**
   * Sets chart extremes to given start and end times
   *
   * @param {Number} startTime Range start time in milliseconds since the epoch
   * @param {Number} endTime Range end time in milliseconds since the epoch
   */
  setExtremesIfChanged: function (startTime, endTime) {
    if (this.hasExtremeChanged(startTime, endTime)) {
      this.rangeStart = startTime;
      this.rangeEnd = endTime;
      this.chart.xAxis[0].setExtremes(this.rangeStart, this.rangeEnd);
    }
    else {
      // always set the visible strings back to a good value
      this.rangeObserver();
    }
  },

  /**
   * Builds up highcharts config object
   */
  buildConfig: function() {
    var self = this;

    var createSeriesColorsArray = function(colors, keysInOrder){
      return keysInOrder.map(function(key) {
        var color = colors[key];
        if (color) {
          return color;
        }
      });
    };

    return {
      colors: createSeriesColorsArray(this.dataVisColors, this.seriesColorOrder),
      annotationsOptions: {
        enabledButtons: false
      },
      chart: {
        events: this.events,
        height: this.height,
        margin: this.margin,
        plotBorderColor: this.dataVisColors["dv-light-gray"],
        plotBorderWidth: this.plotBorderWidth,
        renderTo: this.$.container,
        spacing: this.spacing,
        style: {
          fontFamily: 'inherit',
          fontSize: 'inherit'
        },
        zoomType: this.zoomType,
        selectionMarkerFill: "rgba(200,231,251,0.5)"
      },

      exporting: {
        chartOptions: {
          rangeSelector: {
            enabled: false
          }
        },
        buttons: {
          enabled: true
        },
        url: this.exportServerUrl || "javascript:alert('No export-server-url attribute configrued on this chart')"
      },

      credits: {
        enabled: false
      },
      legend: {
        enabled: true,
        verticalAlign: 'top',
        align: 'left',
        itemDistance: 150,
        floating: true,
        itemMarginTop: 5,
        itemStyle: {
          fontSize: 'inherit',
          fontWeight: 'normal'
        }
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      },
      navigator: {
        adaptToUpdatedData: true,
        height: 50,
        margin: 15,
        outlineColor: this.dataVisColors["dv-light-gray"],
        maskFill: 'rgba(200,231,251,0.3)',
        series: {
          color: 'transparent',
          lineColor: this.dataVisColors["dv-dark-blue"],
          lineWidth: 2
        },
        xAxis: {
          gridLineWidth: 0,
          labels: {
            style: {
              fontSize: '0.8rem'
            },
            y: 15
          }
        }
      },
      plotOptions: {
        line: {
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          }
        },
        scatter: {
          marker: {
            enabled: true
          }
        },
        series: {
          marker: {},
          events: this.seriesEvents
        }
      },
      rangeSelector: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      title: {
        text: null
      },
      tooltip: {
        backgroundColor: "white",
        borderColor: this.dataVisColors["dv-light-gray"],
        shadow: false,
        style: {
          fontFamily: 'inherit',
          fontSize: 'inherit'
        },
        headerFormat: '<span>{point.key}</span><br/>',
        pointFormat: '<span style="color:{series.color}">{series.name}: {point.y}</span><br/>'
      },
      xAxis: {
        events: {
          afterSetExtremes: function(event) {
            self.fire('after-set-extremes', event);
          }
        },
        labels: {
          align: "left",
          style: {
            fontSize: '0.8rem'
          },
          x: 3,
          y: 12
        },
        lineColor: this.dataVisColors["dv-light-gray"],
        showFirstLabel: false,
        showLastLabel: false,
        startOnTick: true,
        title: {
          text: null
        }
      }
    };
  }
});
