// pages/my/DeclarationRecord/electricity/remarks/remarks.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textLog: ''
  },
  //文本框输入为空的判断
  isNull: function(str){
    if(str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  },
  clickOk: function (e) {
    try {
      if (this.isNull(this.data.textLog)){
        setTimeout(function () {
          wx.navigateBack({
            url: "/pages/my/DeclarationRecord/electricity/electricity",
          })
        }, 1500)
      }else{
        wx.setStorage({
          key: "reMark",
          data: this.data.textLog
        })
        console.log(this.data.textLog)

        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1500
        })

        setTimeout(function () {
          wx.navigateBack({
            url: "/pages/my/DeclarationRecord/electricity/electricity",
          })
        }, 1500)
      }
    } catch (e) {
      console.log(e)
    }
  },
  bindDateChange: function (e) {
    // console.log(e)
    this.setData({
      textLog: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    try {
      wx.getStorage({
        key: 'reMark',
        success: function (res) {
          console.log(res.data)
          if (res.data) {
            that.setData({
              'textLog': res.data
            })
          } else {
            that.setData({
              'textLog': ''
            })
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
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