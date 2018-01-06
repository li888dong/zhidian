var app = getApp();
Page({
  data: {
    cus_id : '',
    url: ''
  },
  onLoad: function (e) {
    let cus_id = app.globalData.cus_id;
    let url = "https://www.cx8o92.cn/fenxiwx/fenxi.html?cus_id=" + cus_id
    this.setData({ url: url})
    console.log(this.data)
  }
});
