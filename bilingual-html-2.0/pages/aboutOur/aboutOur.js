//aboutOur.js
Page({
  onShareAppMessage: function () {
    return {
      title: '双语儿童',
      desc: '100天培养双语儿童',
      path: '/pages/aboutOur/aboutOur'
    }
  },
    scanCode:function(){
       wx.scanCode({
         success: function(res){
           // success
         },
         fail: function() {
           // fail
         },
         complete: function() {
           // complete
         }
       })
    },
})