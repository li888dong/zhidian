// pages/my/ElectricityBill/ElectricityBill.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //电费单信息列表
    datas: '',
    isMonths: '',
    isShow: 1,
    pic: true
  },
  changeStatus: function (e) {
    // console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index;
    let isMonths = e.currentTarget.dataset.ismonths;
    if (index == this.data.isShow){
      this.setData({
        'isShow': 0,
        'isMonths': ''
      })
      return
    }
    this.setData({
      'isShow': index,
      'isMonths': isMonths
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  showPic: function(e){
    // console.log(app.globalData.baseUrl)
    let baseUrl = app.globalData.baseUrl;
    let filesPaths = e.currentTarget.dataset.pic;
    let filesPath = [];
    filesPaths.map(function(e){
      filesPath.push(baseUrl + e)
    })
    console.log(filesPath, baseUrl)
    wx.previewImage({
      urls: filesPath // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/users/ebilllist',
      data: { 'cus_id': app.globalData.cus_id, type: 2 },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.status === '1') {
          // let userList = res.data.data.data;
          let data = res.data[0];
          console.log(data);
          that.setData({ 'datas': data, isMonths: data[1].month})
          wx.hideLoading();
        } else {
          console.log(res.data.status)
        }
      }
    })
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