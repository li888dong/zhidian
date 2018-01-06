const app = getApp()

Page({
  data: {
    uNameStatus: false,
    uNumStatus: false,
    yzNumStatus: false,
    btnStatus: true,
    uName: '',
    uNum: '',
    yzmCode: '',
    times: '获取验证码',
    yzmBtn: false,
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0
  },
  login: function(e){
    let that = this;    
    wx.request({
      url: app.globalData.baseUrl + 'api/userscus/verify',
      data: {
        'fullname': that.data.uName,
        'mobile': that.data.uNum,
        'code': that.data.yzmCode
      },
      header: {
        'authorization': app.globalData.access_token
      },
      method: 'POST',
      success: res => {
        // console.log(res);
        let tem = {};
        console.log(app.globalData);
        if(res.data.status == 1){
          console.log(res.data);
          
          tem.cus_id = res.data.userinfo.cus_id;
          tem.id = res.data.userinfo.id;
          tem.cus_name = res.data.userinfo.cus_name;

          wx.setStorage({
            key: "sessionkey",
            data: res.data.session
          })
          try {
            wx.setStorageSync('globalData', tem)
          } catch (e) {
            console.log(e)
          }
          wx.showToast({
            title: '验证成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: "/pages/index/index",
            })
          }, 2000)
        }else{
          console.log(res,33333333333333333)
          wx.showToast({
            title: '验证失败',
            icon: 'loading',
            duration: 2000
          })
        }
      },
      fail: function (err) {
        console.log(err)      
      }
    })
  },
  getYzm: function(e){
    let that = this;
    //手机号码验证
    let num = this.data.uNum;
    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!myreg.test(num)) {
      wx.showToast({
        title: '号码格式无效',
        icon: 'loading',
        duration: 1000
      })
      return false;
    } else {
      app.globalData.mobile = this.data.uNum;
      if (this.data.uNameStatus && this.data.uNumStatus && this.data.yzNumStatus) {
        this.setData({
          'btnStatus': false
        })
        console.log(111111)        
      } else {
        console.log(22222)
      }
      wx.request({
        url: app.globalData.baseUrl + 'api/login/sendcode',
        data: {
          mobile: that.data.uNum
        },
        header: {
          'authorization': app.globalData.access_token
        },
        method: 'GET',
        success: res => {
          console.log(res);
          if (res.data.status === 1) {
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 3500
            })
            that.setData({ times: 60, yzmBtn: true});
            let time1 = setInterval(function () {
              that.data.times--;
              that.setData({ times: that.data.times })
              // console.log(that.data.times);
              if (that.data.times <= 0) {
                that.setData({ times: '重新获取', yzmBtn : false})
                clearInterval(time1)
              }
            }, 1000)
            
          } else {
            wx.showToast({
              title: "获取失败",
              icon: 'loading',
              duration: 1500
            })
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
      console.log(this.data)
    }  
    
  },
  uName: function(e){
    // console.log(e.detail.value)
    this.data.uName = e.detail.value;
    this.data.uNameStatus =true;
    if (this.data.uNameStatus && this.data.uNumStatus && this.data.yzNumStatus) {
      this.setData({
        'btnStatus': false
      })
      console.log(111111)
      console.log(this.data.uNameStatus && this.data.uNumStatus && this.data.yzNumStatus)
    }else{
      console.log(22222)
    }
    // console.log(this.data)
  },
  iphoneNum: function(e){
    this.data.uNumStatus = true;
    this.data.uNum = e.detail.value;
    console.log(this.data.uNum)    
  },
  yzm: function(e){
    this.setData({'yzmCode' : e.detail.value})
    this.data.yzNumStatus = true;
    if (this.data.uNameStatus && this.data.uNumStatus && this.data.yzNumStatus) {
      this.setData({
        'btnStatus': false
      })
      console.log(111111)
      
    } else {
      console.log(22222)
    }
    console.log(this.data)
  },
  onLoad() {
    
    
  },
  
})