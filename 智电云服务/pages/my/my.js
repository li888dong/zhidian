var app = getApp();
Page({
  data: {
    upic: '',
    uInfo: ''
  },
  onLoad: function () {
    console.log(app.globalData)
    this.setData({
      upic: app.globalData.avatarUrl
    });
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/userscus/mycenter',
      method: 'POST',
      data:{
        id: app.globalData.id
      },
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.status === '1') {          
          that.setData({
            'uInfo': res.data.data
          })
          app.globalData.cus_name = res.data.data.cus_name
          console.log(that.data)
        } else {
          console.log(res.data.status)
          
        }
      }
    })
  }
});