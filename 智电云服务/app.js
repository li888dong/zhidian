//app.js
App({
  data: {
    user_noList: ''
  },
  onLaunch: function () {
    if (!Object.values){
      Object.values = function (obj) {
        var ownProps = Object.keys(obj),
          i = ownProps.length,
          resArray = new Array(i); // preallocate the Array
        while (i--)
          resArray[i] = obj[ownProps[i]];

        return resArray;
      };
    }
    // 获取用户信息
    this.getPromission()
  },
  //全局数据
  globalData: {
    baseUrl: 'https://www.cx8o92.cn/',
    loginStatus: true,
    userInfo: null,
    access_token: '',
    cus_id: 1841,
    id: '',
    mobile: '',
    cus_name: "",
    nickname:'',
    avatarUrl: ''
  },
  onLoad: function () {
    console.log(11, 'aaaaaaaaaaaa')
    // this.getUserno()
  },
  //上传用户信息
  upUserInfo(){
    let that = this;
    wx.request({
      url: that.globalData.baseUrl + 'api/userscus/wxLogin',
      data: {
        'mobile' : that.globalData.mobile ? that.globalData.mobile : '',
        'nickname' : that.globalData.nickname ? that.globalData.nickname : '无',
        'headingurl' : that.globalData.avatarUrl ? that.globalData.avatarUrl : ''
      },
      header: {
        'authorization': that.globalData.access_token
      },
      method: 'POST',
      success: res => {
        if(res.data.status == 1){
          console.log(res.data, '用户信息上传完成');
        }else{
          console.log(res.data, '用户信息上传失败');
        }
      },
      fail: function (err) {
        console.log(err)
      }
    }) 
  },
  getUserno() {
    let that = this;
    console.log(baseUrl)
    wx.request({
      url: that.globalData.baseUrl + 'api/customers/wiringdiagram',
      data: { 'cus_id': this.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': this.globalData.token
      }, 
      success: function (res) {
        console.log(res)
      }
    })
  },
  getPromission: function() {
    let that = this;
    var loginStatus = this.globalData.loginStatus;
    console.log(loginStatus)
    if (!loginStatus) {
      wx.openSetting({
        success: function(data) {
          if(data) {
            if (data.authSetting["scope.userInfo"] == true) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials: false,
                 success: function(data) {
                   console.info("2成功获取用户返回数据");
                   console.info(data.userInfo);
                   that.globalData.nickname = data.userInfo.nickname;
                   that.globalData.avatarUrl = data.userInfo.avatarUrl;
                   that.upUserInfo()
                },
                 fail: function() {
                  console.info("2授权失败返回数据");

                }               });

            }

          } 
        },
        fail: function() {
          console.info("设置失败返回数据");
        }
        });
    } else {
      wx.login({
        success: function(res) {
          if (res.code) {
           wx.getUserInfo({
              withCredentials: false,
               success: function(data) {
                console.info("1成功获取用户返回数据");
                console.info(data.userInfo);
                that.globalData.nickname = data.userInfo.nickname;
                that.globalData.avatarUrl = data.userInfo.avatarUrl;
                that.upUserInfo()
                console.log(that.globalData)
              },
              fail: function() {
                console.info("1授权失败返回数据");
                loginStatus = false;
                // 显示提示弹窗
                 wx.showModal({
                  title: '用户授权失败',
                  content: '用户信息无法确认！请点击确认重新授权，如果给您造成不便敬请谅解',
                  success: function(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: function (data) {
                          if (data) {
                            if (data.authSetting["scope.userInfo"] == true) {
                              loginStatus = true;
                              wx.getUserInfo({
                                withCredentials: false,
                                success: function (data) {
                                  console.info("3成功获取用户返回数据");
                                  console.info(data.userInfo);
                                  that.globalData.nickname = data.userInfo.nickname;
                                  that.globalData.avatarUrl = data.userInfo.avatarUrl;
                                  that.upUserInfo()
                                },
                                fail: function () {
                                  console.info("3授权失败返回数据");
                                }
                              });
                            }
                          }
                        },
                        fail: function () {
                          console.info("设置失败返回数据");
                        }
                      });
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });
              }
            });
          }
        },
        fail: function() {
          console.info("登录失败返回数据");
        }
      });
    }
  }
})
