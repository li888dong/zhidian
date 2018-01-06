// pages/my/DeclarationRecord/electricity/electricity.js
var wxCharts = require('../../../../lib/wxcharts.js');
var app = getApp();
var charts = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 定时器id
    in1: '',
    telList: ['0371-66666666'],
    remarks: '',
    remarksStatus: '',
    nextmonth: '',
    chartData: {
      month: [],
      dev: [],
      actual_used: [],
      last_actual_used: []
    },
    user_noList: [],
    user_elec: [],
    user_total: 0
  },
  toRemarks: (e) => {
    wx.navigateTo({
      url: '/pages/my/DeclarationRecord/electricity/remarks/remarks',
    })
  },
  // 月份显示
  monthText: function (e) {
    let date = new Date();
    let month = date.getMonth() + 1 == 12 ? 1 : date.getMonth() + 2;
    this.setData({ 'nextmonth': month })
    // console.log(this.data)
  },
  open: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['0371-66666666'],
      success: function (res) {
        console.log(res.tapIndex)
        that.makeCall(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });
  },
  makeCall: function (index) {
    let that = this;
    wx.makePhoneCall({ phoneNumber: that.data.telList[index] })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    //获取下一个月
    this.monthText();
    //取出缓存中的备注值    
    var in1 = setInterval(() => {
      try {
        wx.getStorage({
          key: 'reMark',
          success: function (res) {
            console.log(res.data)
            if (res.data) {
              that.setData({
                'remarks': res.data,
                remarksStatus: '已填写'
              })
            } else {
              console.log(res)
            }
          },
          fail: function(res) {
            that.setData({
              remarksStatus: '未填写'
            })
          }
        })
      } catch (e) {
        
        console.log(e)
      }
    }, 1000)
    this.setData({ 'in1': in1})
    let that = this;
    this.getUserno();
    //loading效果
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.baseUrl + 'api/declare/info',
      data: { 'cus_id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.status === '1') {
          console.log(res)
          let data = Object.values(res.data.data);
          let month = [],
            dev = [],
            actual_used = [],
            last_actual_used = [];
          data.map(i => {
            month.push(i.month);
            dev.push(i.declare);
            actual_used.push(i.actual_used);
            last_actual_used.push(i.last_actual_used);
          })

          that.setData({
            chartData: {
              month: month,
              dev: dev,
              actual_used: actual_used,
              last_actual_used: last_actual_used
            }
          })
          // console.log(that.data)
          that.drawChart()
          wx.hideLoading();
        } else {
          that.drawChart()
          wx.hideLoading()
          console.log(res.data.status)
        }
      }
    })

    // this.drawChart()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserno() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/customers/wiringdiagram',
      data: { 'cus_id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.status === '1') {
          let data = res.data.data;
          let noList = []
          data.map(i => {
            noList.push(i.user_no)
          })
          that.setData({
            user_noList: noList
          })
          // console.log(that.data.user_noList)
        }
      }
    })
  },
  drawChart() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      console.log(windowWidth)
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    // console.log(this.data)
    charts = new wxCharts({
      canvasId: 'charts',
      type: 'column',
      categories: this.data.chartData.month,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '月度申报',
        color: '#4FA8F9',
        data: this.data.chartData.dev
      }, {
        name: '月度实用',
        color: '#6EC71E',
        data: this.data.chartData.actual_used
      }, {
        name: '去年当度实用',
        color: '#F56E6A',
        data: this.data.chartData.last_actual_used
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单位 Mw.h'
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  inputDeclare(e) {
    let num = e.currentTarget.id.replace('delcare', '');
    num = num / 1;
    console.log(num, e.detail.value)
    this.data.user_elec[num] = e.detail.value;
    console.log(this.data.user_elec)
    this.setData({
      user_total: this.data.user_elec.reduce((pre, cur) => pre / 1 + cur / 1, 0)
    })
    console.log(this.data.user_total)
  },
  submit: function () {
    let that = this;
    let sbdlinfo = [],
      huhaoList = this.data.user_noList,
      sbList = this.data.user_elec;
    for (let i = 0; i < huhaoList.length; i++) {
      sbdlinfo.push({
        user_no: huhaoList[i],
        elec: sbList[i]
      })
    }
    wx.request({
      url: app.globalData.baseUrl + 'api/declare',
      data: { 'cus_id': app.globalData.cus_id, 'sbdl': this.data.user_total, 'sbdlinfo': sbdlinfo, 'uid': app.globalData.id, 'remarks': this.data.remarks },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res)
        wx.removeStorageSync('reMark')
        clearInterval(that.data.in1)
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })
  }
})