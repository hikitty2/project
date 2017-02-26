Page({
  data: {
    go:true,
  },
  onShareAppMessage: function () {
    return {
      title: '我的打卡',
      desc: '我的打卡',
      path: '/pages/cardover/cardover'
    }
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
     var that = this ;
     that.setData({
      go:true
    })
  },


})