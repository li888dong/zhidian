// pages/my/user/user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cusList:[],
    isChangeId: ''
  },
  //添加客户
  toAddUser: e =>{
    wx.redirectTo({
      url: '/pages/my/user/userAdd/userAdd',
    })
  },
  //删除用户
  delUser: function(e){
    let idDel = e.currentTarget.dataset.iddel;
    console.log(e.currentTarget.dataset.iddel)
    let that = this;

    wx.showModal({
      title: '删除用户',
      content: '删除后不可恢复,需重新添加,您确定吗?',
      confirmText: "删除",
      cancelText: "取消",
      success: function (res) {
        // console.log(res);
        if (res.confirm) {
          console.log('用户点击删除')
          wx.request({
            url: app.globalData.baseUrl + 'api/userscus/' + idDel,
            method: 'DELETE',
            header: {
              'authorization': app.globalData.access_token
            },
            success: function (res) {
              // console.log(res)
              if (res.data.status === '1') {
                console.log(res)
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                //刷新页面
                that.getUserList()
              } else {
                console.log(res.data.status)
                wx.showToast({
                  title: '删除失败',
                  icon: 'success',
                  duration: 2000
                })
              }
            }
          })
        } else {
          console.log('用户点击取消删除')
        }
      }
    })    
  },
  //跳传修改页面
  edit: function(e){
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    const mobel = e.currentTarget.dataset.mobel;
    wx.redirectTo({
      url: "/pages/my/user/userChange/userChange?id=" + id + '&name=' + name + '&mobel=' + mobel,
    })
  },
  // 打开修改项
  changeShow: function(e){
    // console.log(e.currentTarget.dataset.idshow)
    let isChange = e.currentTarget.dataset.idshow;
    if (isChange == this.data.isChangeId){
      this.setData({
        isChangeId: ''
      })
      return
    }
    this.setData({
      isChangeId: isChange
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(this)
    this.getUserList()
  },
  //获取用户列表
  getUserList: function(e){
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/userscus/index',
      data: { 'cus_id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.status === '1') {
          // console.log(res)
          let userList = res.data.data.data;
          console.log(userList)
          let user = [];
          userList.map(function (i) {
            user.push({
              'fullname': i.fullname,
              'last_logintime': i.last_logintime ? i.last_logintime : '',
              'imgurl': i.imgurl ? i.imgurl : '',
              'mobile': i.mobile,
              'cus_id': i.cus_id,
              'id': i.id
            })
          })
          that.setData({
            cusList: user
          })
          wx.hideLoading();
          console.log(that.data.cusList)
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