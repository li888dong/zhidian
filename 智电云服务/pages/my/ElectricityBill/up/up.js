// pages/my/ElectricityBill/up/up.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telList: ['0371-66666666'],
    files: [],
    filePaths: [],
    //上传图片id
    fileid: '',
    month:'1月',
    mouthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    mouthListIndex: 0,

    userID: ['123456885', '123456885', '123456885'],
    userIDIndex: 0,
    power:'',
    money:'',
    user_no:'123456885',
    file:'',
  },
  delPic: function(e){
    let tem = [];
    let temUrl = [];
    let temPic = e.target.dataset.picurl
    this.data.files.map(function(item){
      if (item != temPic){
        tem.push(item)
      }
    })
    this.data.filePaths.map(function (i , k) {
      
      for(let j in i){
        console.log(i[j])
        if (i[j] != temPic){
          temUrl[k].push(i[j])
        }else{
          console.log('filePaths删除失败')
        }
      }      
    })
    console.log(temUrl)
    this.setData({ 'files': tem})
    console.log(this.data)
    // console.log(tem)
    // console.log(e.target.dataset.picurl)
  },
  powerGet:function(e){
     console.log(e);
     this.setData({
       power:e.detail.value,
     })
  },
  moneyGet:function(e){
    console.log(e);
    this.setData({
      money:e.detail.value
    })
  },
  upOk:function(e){
    //调用上传图片
    var that = this;
    this.upImage(); 
    //  处理图片id的逗号
    // setTimeout(function(){
    //   that.dfdUP()
    // },1000)
    
    
  },
  open: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['0371-66666666'],
      success: function (res) {
        console.log(res.tapIndex)
        that.makeCall(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });
  },
  makeCall: function (index) {
    let that = this;
    wx.makePhoneCall({ phoneNumber: that.data.telList[index] })
  },
  bindmouthListChange: function (e) {
    console.log('mouthList 发生选择改变，携带值为', e.detail.value);
    console.log(e);

    this.setData({
      mouthListIndex: e.detail.value
    })
  },
  bindUserIDChange: function (e) {
    console.log('userIDIndex 发生选择改变，携带值为', e.detail.value);
    console.log(e);
    this.setData({
      userIDIndex: e.detail.value
    })
  },
  //电费单数据上传
  dfdUP: function(e){
    //电费单图片id
    let fileId = this.data.fileid;
    fileId = fileId.substr(0, fileId.length - 1)
    let _this = this;
    let data = new Date();
    data = data.getFullYear();
    _this.data.mouthList[_this.data.mouthListIndex] = _this.data.mouthList[_this.data.mouthListIndex].split('月')[0];
    _this.data.month = data + '-' + '0' + _this.data.mouthList[_this.data.mouthListIndex];
    _this.data.user_no = _this.data.userID[_this.data.userIDIndex];
    wx.request({
      url: app.globalData.baseUrl + 'api/users/add_electric_bill',
      data: { cus_id: app.globalData.cus_id, uid: app.globalData.id, month: _this.data.month, user_no: _this.data.user_no, used_num: _this.data.power, price: _this.data.money, ebpic: fileId },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      },
    })
  },
  // 选择图片
  chooseImage: function (e) {
    var that = this;
    let tempPaths = [];
    wx.chooseImage({
      count: 2,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片       
        that.data.filePaths.push(res.tempFilePaths)
        // console.log(that.data);
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          file: res.tempFiles
        });
        console.log(that.data)
      }
    })
  },
  //上传图片
  upImage: function(e){
    let that = this;
    this.data.filePaths.map(function(i){
      // console.log(i[0])
      for(let j in i){
        // console.log(i[j])
        wx.uploadFile({
          url: app.globalData.baseUrl + 'api/file/uploadimg',
          filePath: i[j],
          name: 'image',
          header: {
            "Content-Type": "multipart/form-data",
            'authorization': app.globalData.access_token
          },
          // formData:
          // {
          //   userId: 1 //附加信息为用户ID
          // },
          success: function (res) {
            console.log(res)
            that.data.fileid += (JSON.parse(res.data).fileid + ',');
            console.log(that.data)
            that.dfdUP()
          },
          fail: function (res) {
            console.log(res);
          },
        })
      }
      
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'api/customers/wiringdiagram',
      data: { 'cus_id': app.globalData.cus_id},
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {
        console.log(res.data.data);
        let data = res.data.data;
        let tem = [];
        if(data.length == 0){
          that.setData({
            userID: ['暂无']
          })
        }else{
          data.map(function(i){
           tem.push(i.user_no)
          })
          that.setData({
            userID: tem
          })
          console.log(that.data)
        }
        
      },
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