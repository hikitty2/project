//app.js
var aaa;
var key;
App({

  onLaunch: function () {
    wx.removeStorageSync('key');
  },
  // onHide: function () {
  //   wx.switchTab({
  //     url: '../card/card',
  //     success: function(res){
  //       // success
  //       console.log(res)
  //     },
  //     fail: function(res) {
  //       // fail
  //               console.log(res)

  //     },
  //     complete: function(res) {
  //       // complete
  //               console.log(res)

  //     }
  //   })
  // },
  requestUrl:"https://www.jnshu.com/bilingual/"

})