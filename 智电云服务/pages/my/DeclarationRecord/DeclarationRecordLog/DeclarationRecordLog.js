// pages/my/DeclarationRecord/DeclarationRecordLog/DeclarationRecordLog.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLog: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/declare/' + id,
      method: 'GET',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        // console.log(res);
        if (res.data.status === '1') {
          console.log(data);
          let data = res.data.data;
          that.setData({
            'dataLog': data
          })
          console.log(that.data);
        } else {
          console.log(res.data.status)
        }
      }
    })
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
  
  }
})