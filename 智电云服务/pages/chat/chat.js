// pages/my/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'http://192.168.2.111/api/index/usedschedule',
      data: { 'com_id': '1'},
      method: 'POST',
      header: {
        'authorization': "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjgxMjA4ZTg4ZmI3ODdlY2VjOWY0ZDliMzNlZTFhNjBjMGVhYTJlNDJiZjNhY2RkY2QzMTdhMzgyMzU0OTUyMTk4YjlkMGJmYWU4ZmVkYmYyIn0.eyJhdWQiOiIxIiwianRpIjoiODEyMDhlODhmYjc4N2VjZWM5ZjRkOWIzM2VlMWE2MGMwZWFhMmU0MmJmM2FjZGRjZDMxN2EzODIzNTQ5NTIxOThiOWQwYmZhZThmZWRiZjIiLCJpYXQiOjE1MTM2NjMyODQsIm5iZiI6MTUxMzY2MzI4NCwiZXhwIjoxNTE0OTU5Mjg0LCJzdWIiOiIiLCJzY29wZXMiOltdfQ.dI4JA9m_0Qct9EjljvXBC0dFwZjMhL1_P4rSyY34xSIRbEFz3xkbdYjTF9_zTS6-YbFn8VR4f9c_ff7ENZd2yCod9uQjWrhZrjJVQrwZmIr0bbFbj8ZWgJYAGDcfOjuLC9xbA2JZ_3LNB8NXdTfrsPL6HsoIgpGltXX7kCgyY1AhiKuQ4ofVqFOM579iqkrn3D4KAPXsx8KrvSXy1m-Ekqu7ALjTdOkhDc7TMWthaEq4gpLZyg1GypOTCwb67C20UrOlVrRSx6QQQftYT29qu5y8dEEUQFyYLYGGKOWgtB91EE4NbkGqoDyqmFXnIybRLQmWV0iTEL1pVs5BZ-dTXnxj0TrVSeh9LFji7SvYmc-_AP4W7jiYnOMKErwrjkGECarYtDQTa6i68pKYMevm35Vlj2tJIaMcflRij3cZ9mX9GN4xYwgsBgOdvSDNPIxKrr6p-N_x2v6MyeGTAap47sg5m4wMeDhHIk_PPgC6dN_WYsMRbUj3nCNWlRyn22IPfvcTCCVksQ3GKw7JkFVdhYiHt9mqnUHZb_ngCYaD2klHA9Krbfuj0uVVZCUZi-S_QH1hDk_dtQeCjmIxSDhKY8Gwet0BQwVelIq2NwxI8zTJd3VVQP1VVd9804aOzY9S2kQz7W2L7l6ERmfO1nrvuz1DHZ9I7iwV7e9Lrg2S2pc"
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status === '1'){
          console.log(res.data.data)
        }else {
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