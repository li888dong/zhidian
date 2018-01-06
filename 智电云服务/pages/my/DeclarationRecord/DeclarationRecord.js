// pages/my/DeclarationRecord/DeclarationRecord.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logData: []
  },
  //电费单详情页面
  chartLog: function (e) {
    const id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "/pages/my/DeclarationRecord/DeclarationRecordLog/DeclarationRecordLog?id=" + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/declare/log',
      data: { 'cus_id': app.globalData.cus_id},
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res.data);
        
        if (res.data.status === '1') {
          let data = res.data.data;
          that.setData({
            'logData': data
          })
          wx.hideLoading()
          // console.log(that.data);
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