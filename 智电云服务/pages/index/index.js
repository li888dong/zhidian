var wxCharts = require('../../lib/wxcharts.js');

var app = getApp();
var ringChart = null;
var BarCanvas = null;

Page({
  data: {
    purchased: '',
    actual_used: ''
  },
  toMon: function(e){
    wx.switchTab({
      url: '/pages/monitoring/monitoring',
    })
  },
  updateData: function () {
    ringChart.updateData({
      title: {
        name: '80%'
      },
      subtitle: {
        color: '#ff0000'
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    try {
      var value = wx.getStorageSync('globalData')
      if (value) {
        console.log(value, 11111111111111)
        // app.globalData = value
        app.globalData.cus_id = value.cus_id;
        app.globalData.id = value.id;
        app.globalData.cus_name = value.cus_name;

      }
    } catch (e) {
      console.log(e, 11111111111111)
    }

    //请求令牌
    wx.request({
      url: app.globalData.baseUrl + 'oauth/token',
      data: {
        'grant_type': 'client_credentials',
        'client_id': 1,
        'client_secret': 'IRwipTloBj54dYeznekQt2shYHaTrmeIIRXq0bQb'
      },
      method: 'POST',
      success: res => {
        app.globalData.access_token = res.data.access_token
        that.reqData();
      },
      fail: function (err) {
        console.log(err)
      }
    })
    
  },
  onReady: function (e) {
  },
  reqData:function(e){
    app.upUserInfo()
    // 检查登录状态 
    let that = this;
    wx.getStorage({
      key: 'sessionkey',
      success: function (res) {
        console.log(res.data, '登陆成功')
      },
      fail: function (res) {
        console.log(res.data, '登陆失败')
        wx.redirectTo({
          url: '../login/login',
        })
        //登录态过期 重新登录
        wx.login({
          success: res => {
            if (res.code) {
              console.log(res)
              wx.request({
                url: app.globalData.baseUrl + "api/userscus/getkey",
                data: { 'code': res.code },
                header: {
                  'authorization': app.globalData.access_token
                },
                method: "POST",
                success: res => {
                  console.log(res, 'openid' + "上传成功")
                },
                fail: err => {
                  console.log(err)
                },
              })
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      }
    })
    // console.log(app.globalData)
    
    wx.setNavigationBarTitle({
      title: app.globalData.cus_name
    })
    var windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    };
    wx.request({
      url: app.globalData.baseUrl + 'api/index/usedschedule',
      data: { 'cus_id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        // console.log(res,666666666666)
        if (res.data.status === '1') {
          that.setData({
            purchased: res.data.data.purchased,
            actual_used: res.data.data.actual_used,
          })
          var purchased = res.data.data.purchased - 0;
          var actual_used = res.data.data.actual_used - 0;
          // console.log(purchased)
          // console.log(actual_used)
          // 圆形显示的购买剩余电量
          var remain = res.data.data.purchased - res.data.data.actual_used;
          // console.log(remain)
          // 使用百分比
          var useRatio = parseInt(actual_used / purchased * 10000) / 100 ? parseInt(actual_used / purchased * 10000) / 100 : 0 + '%';
          // console.log(that.data, 666666666666)
          ringChart = new wxCharts({
            animation: true,
            canvasId: 'ringCanvas',
            top: 15,
            type: 'ring',
            extra: {
              ringWidth: 20,
              pie: {
                offsetAngle: -90
              }
            },
            title: {
              name: useRatio,
              color: '#000000',
              fontSize: 30
            },
            subtitle: {
              name: '已用',
              color: '#888888',
              fontSize: 16
            },
            series: [{
              name: '已用电量',
              color: '#4FA8F9',
              data: actual_used <= 0 ? 0.01 : actual_used,
              stroke: false
            }, {
              name: '购买电量',
              color: '#6ec71e',
              data: remain,
              stroke: false
            }],
            disablePieStroke: true,
            width: windowWidth,
            height: windowWidth / 1.69,
            dataLabel: false,
            legend: false,
            background: '#ffffff',
            padding: 0
          });
          ringChart.addEventListener('renderComplete', () => {
            // console.log('renderComplete');
          });
          setTimeout(() => {
            ringChart.stopAnimation();
          }, 500);
        } else {
          console.log(res.data.status)
        }
      }
    });

    // 月度偏差请求
    wx.request({
      url: app.globalData.baseUrl + 'api/devanalysis/chart',
      data: { 'cus_id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.status === '1') {
          let datas = res.data.citys;
          // console.log(datas)
          // 日期
          let dates = [];
          //偏差数据队列
          let dataList = [];
          // 申报电量
          let data1 = [];
          // 实际用电量
          let data2 = [];
          for (let i in datas) {
            dates.push(i)
          }
          for (let j in datas) {
            dataList.push(datas[j]);
          }

          // console.log(dataList)
          for (let l in dataList) {
            if (dataList[l].dev.length === 0) {
              data1[l] = 0
            } else {
              data1[l] = dataList[l].dev[0].declare
            }
          }
          for (let o in dataList) {
            if (dataList[o].dev.length === 0) {
              data2[o] = 0
            } else {
              data2[o] = dataList[o].dev[0].actual_used
            }
          }
          // console.log(data1, data2)
          BarCanvas = new wxCharts({
            animation: true,
            canvasId: 'BarCanvas',
            type: 'column',
            dataLabel: false,
            categories: dates,
            series: [
              {
                name: '申报电量',
                color: '#4FA8F9',
                data: data1
              },
              {
                name: '实际用电量',
                color: '#6ec71e',
                data: data2
              }
            ],
            yAxis: {
              title: '单位 Mw.h',
              format: function (val) {
                return val + ''
              }
            },
            width: windowWidth,
            height: 200
          });
        } else {
          console.log(res.data.status)
        }
      }
    })
  }
});