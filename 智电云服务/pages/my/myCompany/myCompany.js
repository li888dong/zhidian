var wxCharts = require('../../../lib/wxcharts.js');
var app = getApp();
var ringChart = null;
Page({
  data: {
    cus_name: '',
    yUse: '',
    ySigned: '',
    dev: '',
    //户号
    hh: [],
    //企业情况
    cus: {
        ly_used: '',
        ly_maxload: '',
        bndyjdl: '',
        bndyjzdfh: ''
    },
    //联系方式
    contact: {
      province: "",
      city: "",
      county: "",
      address: "",
      contact: "",
      telphone: "",
      officephone: ""
    },
    ser: [
      {
        name: '8976534569',      
        data: 0.1
      }
    ]
  },
  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
  },
  updateData: function () {
    ringChart.updateData({
      title: {
        name: '80%'
      },
      subtitle: {
        color: '#ff0000'
      }
    });
  },
  onLoad: function(e) {
    //企业名字
    console.log(app.globalData)
    console.log(this.data)
    this.setData({
      'cus_name': app.globalData.cus_name
    })
    let that = this;
    // 企业基本信息
    wx.request({
      url: app.globalData.baseUrl + 'api/customers/myinfo',
      data: { 'cus_id': app.globalData.cus_id },
      method: 'POST',
      header: {
        'authorization': app.globalData.access_token
      },
      success: function (res) {        
        if (res.data.status === '1') {
          console.log(res.data)
          let data = res.data.data;          
          //年度已用电量,年度合同电量,当月偏差          
          that.setData({
            'yUse': data.year_has_used ? data.year_has_used : 0,
            'ySigned': data.signed_pat ? data.signed_pat : 0,
            'dev': data.dev ? data.dev : 0
          })
          //户号情况
          if (data.userno_info){
            let arr =  [];
            for(let k in data.userno_info){
              arr.push({
                'name': k,
                'data': data.userno_info[k] != 0 ? data.userno_info[k] : 0.1
                })
            }
            // console.log(arr)
            that.setData({
              'hh': arr
            })
          }else{
            that.setData({
              hh:{
                '000000': '0.1'
              }
            })
          }
          console.log(that.data.hh)

          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }

          ringChart = new wxCharts({
            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',
            extra: {
              ringWidth: 25,
              pie: {
                offsetAngle: -90
              }
            },
            series: that.data.hh,
            disablePieStroke: true,
            width: windowWidth,
            height: 260,
            dataLabel: true,
            legend: true,
            background: '#f5f5f5',
            padding: 0
          });
          ringChart.addEventListener('renderComplete', () => {
            console.log('renderComplete');
          });
          setTimeout(() => {
            ringChart.stopAnimation();
          }, 500);
          //企业概况
          if (data.cus_info){
            that.setData({
              'cus.ly_used' : data.cus_info.ly_used,
              'cus.ly_maxload': data.cus_info.ly_maxload,
              'cus.bndyjdl': data.cus_info.bndyjdl,
              'cus.bndyjzdfh': data.cus_info.bndyjzdfh
            })  
          }else{
            that.setData({
              'cus.ly_used': 0,
              'cus.ly_maxload': 0,
              'cus.bndyjdl': 0,
              'cus.bndyjzdfh': 0
            })
          }
          // console.log(that.data.cus)
          //联系方式
          if (data.contact_info) {
            that.setData({
              contact: {
                'province': data.contact_info.province,
                'city': data.contact_info.city,
                'county': data.contact_info.county,
                'address': data.contact_info.address,
                'contact': data.contact_info.contact ? data.contact_info.contact : '无',
                'telphone': data.contact_info.telphone ? data.contact_info.telphone : '无',
                'officephone': data.contact_info.officephone ? data.contact_info.officephone : '无'
              }
            })
          } else {
            that.setData({
              contact: {
                'province': "河南省",
                'city': "郑州市",
                'county': "高新区",
                'address': "大学科技园",
                'contact': "无",
                'telphone': "无",
                'officephone': "无"
              }
            })            
          }
          // console.log(that.data.contact,1111)
        } else {
          console.log(res.data.status)
        }
      }
    })

  },
  onReady: function (e) {
    
  }
});