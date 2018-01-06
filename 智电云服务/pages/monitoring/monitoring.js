var wxCharts = require('../../lib/wxcharts.js');
var app = getApp();
var lineChart1 = null;
var lineChart2 = null;
Page({
  data: {
    windowWidth: '320px',
    shownavindex: '',
    shownavindex2: '1',
    leftClick: true,
    mianClick: '',
    //终端号
    clickZd: '',
    //综合时间选择
    timeType: 1,
    //终端电量日期类别
    timeTypeZd: 1,
    //确认按钮的状态
    okStatus: false,
    isfull: false,
    //折线图数据
    line1Data: [],
    line1Date: [],
    line2Data: [],
    line2Date: [],
    timeText: '15分钟',
    radioItems: [
      { name: '15分钟', value: '0', checked: true },
      { name: '日', value: '1' },
      { name: '月', value: '2' }
    ],
    showAll: '',
    showDateSel: '',
    // 户号
    hh: [],
    // 终端
    zd: []
  },
  touchHandler: function (e) {
    lineChart1.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart1.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart1.scrollEnd(e);
    lineChart1.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  touchHandler2: function (e) {
    lineChart2.scrollStart(e);
  },
  moveHandler2: function (e) {
    lineChart2.scroll(e);
  },
  touchEndHandler2: function (e) {
    lineChart2.scrollEnd(e);
    lineChart2.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  //菜单栏点击确认事件
  clickOk: function (e) {
    this.setData({
      showAll: false,
      isfull: false
    })
    if (this.data.leftClick) {
      //综合电量请求
      this.electric();
      this.setData({
        shownavindex: false
      })
      // console.log(this.data)
    } else {      
      this.setData({
        shownavindex: false
      })
      if (this.data.timeText == '15分钟'){
        //每个终端电量请求
        this.electricEveryMin();
      } else if (this.data.timeText == '日') {
        this.electricEveryDay();
      }else{
        this.electricEvery();
      }
      console.log(this.data, 99999)
    }
  },
  clickLeft: function (e) {
    this.setData({
      shownavindex2: 1,
      leftClick: true,
      mianClick: '',
      clickZd: '',
      okStatus: false
    })
  },
  clickMain: function (e) {
    this.setData({
      shownavindex2: 2,
      leftClick: false,
      mianClick: e.target.dataset.selscted,
      clickZd: '',
      okStatus: true
    })
    //终端请求
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/customers/wiringdiagram',
      data: { 'cus_id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res.data, 11111)
        if (res.data.status === '1') {
          let te = [];
          let tem = [];
          //如果户号和点击相同，去除其下的终端
          res.data.data.map(function (a) {
            if (a.user_no === that.data.mianClick) {
              te.push(a.clientids)
              a.clientids.map(function (e) {
                tem.push(e.clientid)
                // console.log(e.clientid, 3333)
              })
            }
          })
          // console.log(te)
          //判断其数据是否存在，存在去除
          te.map(function (b) {
            // console.log(b)
            if (b.length === 0) {
              that.setData({
                zd: ['暂无数据'],
                okStatus: true,
              })
              // console.log(that.data.zd)
            } else {
              that.setData({
                zd: tem
              })
            }
          })
        } else {
          console.log(res.data.status)
        }
      }
    })
  },
  clickRight: function (e) {
    this.setData({
      shownavindex2: 3,
      leftClick: false,
      okStatus: false,
      clickZd: e.target.dataset.selsctedzd
    })
    // console.log(this.data,99999)
  },
  // 时间选择 
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    // console.log(radioItems,11111111)
    this.setData({
      radioItems: radioItems
    });
    console.log(e.detail.value, 11111111)
    if (e.detail.value === '0') {
      this.setData({
        timeType: '1',
        timeTypeZd: '1',
        showDateSel: false,
        isfull: false,
        timeText: '15分钟'
      });
      //电量负荷数据请求
      if (this.data.leftClick) {
        this.electric();
      } else {
        this.electricEveryMin();
        console.log(this.data)
        this.zdFhEvery();
      }
      // console.log(this.data.timeType)
    } else if (e.detail.value === '1') {
      this.setData({
        timeType: '2',
        timeTypeZd: '4',
        showDateSel: false,
        isfull: false,
        timeText: '日'
      });
      let that = this;
      if (this.data.leftClick) {
        //电量请求
        this.electric();
      } else {
        this.electricEveryDay();
      }
      // console.log(this.data.timeType)
    } else if (e.detail.value === '2') {
      this.setData({
        timeType: '3',
        timeTypeZd: '5',
        showDateSel: false,
        isfull: false,
        timeText: '月'
      });
      let that = this;
      //电量数据请求
      if (this.data.leftClick) {
        this.electric();
      } else {
        this.electricEvery();
      }
      // console.log(this.data.timeType)
    }
  },
  // 遮罩层
  hidebg: function (e) {
    this.setData({
      isfull: 'false',
      shownavindex: 1
    })
  },
  tapName11: function (event) {
    // console.log(this.data.showAll)
    if (!this.data.showAll) {
      this.setData({
        showAll: true,
        showDateSel: false,
        isfull: true,
        shownavindex: 1
      })
    } else {
      this.setData({
        showAll: false,
        showDateSel: false,
        isfull: false,
        shownavindex: 0
      })
    }
  },
  tapName12: function (event) {
    if (!this.data.showDateSel) {
      this.setData({
        showAll: false,
        showDateSel: true,
        isfull: true,
        shownavindex: 2
      })
    } else {
      this.setData({
        showAll: false,
        showDateSel: false,
        isfull: false,
        shownavindex: 0
      })
    }
  },
  tapName2: function (event) {
    console.log(event.currentTarget.dataset.sel)
    shownavindex2: event.currentTarget.dataset.sel
  },
  onLoad: function (e) {
    //wx-chart自动宽度100%
    var windowWidth = '320px';
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    this.setData({
      windowWidth: windowWidth
    })
    //户号请求
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/customers/wiringdiagram',
      data: { 'cus_id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        // console.log(res.data.data,222)
        if (res.data.status === '1') {
          let te = [];
          let zdHao = '';
          res.data.data.map(function (a) {
            te.push(a.user_no)
            if (a.clientids.length != 0) {
              zdHao = a.clientids[0].clientid
            } else {
              zdHao = '999600CC'
            }
          })
          that.setData({
            'hh': te,
            'clickZd': zdHao
          })
        } else {
          console.log(res.data.status)
        }
      }
    })
    // console.log(that.data)
    
    lineChart1 = new wxCharts({
      canvasId: 'lineCanvas1',
      type: 'line',
      // enableScroll: true,
      categories: ['0'],
      animation: true,
      title: {
        name: "单位: Mw.h",
        fontSize: '14px'
      },
      series: [{
        name: '电量',
        data: ['0'],
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单位 Mw.h'
      },
      width: this.data.windowWidth,
      legend: false,
      height: 180,
      dataLabel: false,
      dataPointShape: false,
      extra: {
        lineStyle: 'straight'
      }
    });

    lineChart2 = new wxCharts({
      canvasId: 'lineCanvas2',
      type: 'line',
      // enableScroll: true,
      categories: ['0'],
      animation: true,
      legend: false,
      series: [{
        name: '负荷',
        data: ['0']
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单位 Mw.h'
      },
      width: that.data.windowWidth,
      height: 180,
      dataLabel: false,
      dataPointShape: false,
      extra: {
        lineStyle: 'straight'
      }
    });
    //综合电量请求
    this.electric();
    //综合终端负荷请求，只有十五分钟的
    this.zdFhEvery();

  },
  //综合电量请求
  electric: function (e) {
    let that = this;
    //综合电量请求
    wx.request({
      url: app.globalData.baseUrl + 'api/devices/datachart2',
      data: { 'type': that.data.timeType, 'cus-id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res)
        let tem1 = [];
        let tem2 = [];
        if (res.data.status == '1') {
          console.log(res.data)
          if (res.data.data.length == 0) {
            lineChart1.updateData({
              categories: ['0'],
              series: [{
                name: '电量使用',
                color: '#0089f0',
                data: ['0']
              }]
            })
           } else {
            for (let a in res.data.data) {
              tem1.push(res.data.data[a].day);
              tem2.push(res.data.data[a].num)
            }
            lineChart1.updateData({
              categories: tem1,
              series: [{
                name: '电量使用',
                color: '#0089f0',
                data: tem2
              }]
            });
          }          
        } else {
          lineChart1.updateData({
            categories: ['0'],
            series: [{
              name: '电量使用',
              color: '#0089f0',
              data: ['0']
            }]
          })    
          console.log(res.data.status)
        }
      }
    })
  },
  //每个终端电量请求
  electricEvery: function (e) {
    //console.log(e, 566)
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/devices/datachart',
      data: { 'type': 1, 'time': that.data.timeTypeZd, 'clientid': that.data.clickZd },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        let tem1 = [];
        let tem2 = [];
        console.log(res)
        if (res.data.status === '1') {
          if(res.data.data.length == 0){
            //日期 数据
            lineChart1.updateData({
              categories: ['0'],
              series: [{
                name: '电量使用',
                color: '#0089f0',
                data: ['0']
              }]
            });
          }else{
            let data = res.data.data;
            for (let a in data) {
              // console.log(data[a])
              tem1.push(data[a].collect_time);
              tem2.push(data[a].electricity)
            }
            //日期 数据
            lineChart1.updateData({
              categories: tem1,
              series: [{
                name: '电量使用',
                color: '#0089f0',
                data: tem2
              }]
            });
          }
        } else {
          console.log(res.data.status)
        }
      }
    })
  },
  //每个终端电量15分钟请求
  electricEveryMin: function (e) {
    //console.log(e, 566)
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/devices/datachart',
      data: { 'type': '1', 'time': '1', 'clientid': that.data.clickZd },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        let tem1 = [];
        let tem2 = [];
        console.log(res)
        if (res.data.status === '1') {
          if (res.data.data.length == 0) {
            //日期 数据
            lineChart1.updateData({
              categories: ['0'],
              series: [{
                name: '电量使用',
                color: '#0089f0',
                data: ['0']
              }]
            });
          } else {
            let data = res.data.data;
            for (let a in data) {
              // console.log(data[a])
              tem1.push(data[a].collect_time.substring(10));
              tem2.push(data[a].electricity)
            }
            //日期 数据
            lineChart1.updateData({
              categories: tem1,
              series: [{
                name: '电量使用',
                color: '#0089f0',
                data: tem2
              }]
            });
          }
        } else {
          console.log(res.data.status)
        }
      }
    })
  }, 
  //每个终端电量每日请求
  electricEveryDay: function(e) {
    //console.log(e, 566)
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/devices/datachart',
      data: { 'type': '1', 'time': '4', 'clientid': that.data.clickZd },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        let tem1 = [];
        let tem2 = [];
        console.log(res)
        if (res.data.status === '1') {
          if (res.data.data.length == 0) {
            //日期 数据
            lineChart1.updateData({
              categories: ['0'],
              series: [{
                name: '电量使用',
                color: '#0089f0',
                data: ['0']
              }]
            });
          } else {
            let data = res.data.data;
            for (let a in data) {
              // console.log(data[a])
              tem1.push(data[a].collect_time.substr(0, 10));
              tem2.push(data[a].electricity)
            }
            //日期 数据
            lineChart1.updateData({
              categories: tem1,
              series: [{
                name: '电量使用',
                color: '#0089f0',
                data: tem2
              }]
            });
          }
        } else {
          console.log(res.data.status)
        }
      }
    })
  },
  //终端负荷请求，只有十五分钟的
  zdFhEvery: function (e) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/devices/datachart',
      data: { 'type': '7', 'time': '1', 'clientid': that.data.clickZd },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        if (res.data.status === '1') {
          console.log(res)
          console.log(that.data)
          if(res.data.data.length == 0){
            lineChart2.updateData({
              categories: ['0'],
              series: [{
                name: '负荷',
                color: '#0089f0',
                data: ['0']
              }]
            })    
          }
          // res.data.data.map(function (a) {
          //   // console.log(a.active_power)
          //   that.data.line2Data.push(a.active_power)
          //   that.data.line2Date.push(a.created_at.substring(10))
          // })
          
        } else {
          console.log(res.data.status)
        }
      }
    })
  }
});

