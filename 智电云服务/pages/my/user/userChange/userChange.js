// pages/my/user/userChange/userChange.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    uNmae: '',
    uMoble: '',
  },
  bindDateChange: function (e) {
    this.setData({
      uNmae: e.detail.value
    })
  },
  bindDateChangeM: function(e) {
    this.setData({
      uMoble: e.detail.value
    })
  },
  showTopTips: function(e){
    // 获取文本框的值
    
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/userscus/update',
      data: { 'id': that.data.id, 'fullname': that.data.uNmae, 'mobile': that.data.uMoble},
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        // console.log(res)
        if (res.data.status === '1') {
          console.log(res)
          console.log(that.data)
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })

          setTimeout(function () {
            wx.redirectTo({
              url: "/pages/my/user/user",
            })
          }, 1500)
        } else {
          console.log(res.data.status)
          wx.showToast({
            title: '修改失败',
            icon: 'loading',
            duration: 1500
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 'id': options.id, 'uNmae': options.name, 'uMoble': options.mobel})
    // console.log(options,6666666)
    
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