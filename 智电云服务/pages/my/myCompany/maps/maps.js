// map.js
Page({
  data: {
    markers: [{
      iconPath: '../../../../images/icon_home_solid.png',
      id: 0,
      latitude: 34.7994444444,
      longitude: 113.5991666664,
      width: 50,
      height: 50,
      label: {
        content: '',
        fontSize: 10,
        color: '#0f0'
      }
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})