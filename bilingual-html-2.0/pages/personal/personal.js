/**personal.js**/
var that;
var value;
var imgUrl = '';
var request =getApp()
var requestUrl=request.requestUrl
Page({
  data: {
    user: {
      name: '',
      brith: '未设置',
      gender: '未设置',
      infoStatus:0
    },
    imgUrl: '../../images/BbInfoHeadPic.png',
    go: true
  },


  //请求
  onShow: function () {
    that = this;
    that.setData({
      go: true
    })
    var value = wx.getStorageSync('key')
    console.log(value)
    var that = this
    //请求个人资料
    wx.request({
      url: requestUrl+'a/u/user?token=' + value,
      data: {},
      method: 'GET',
      success: function (res) {
        if(res.data.code==0){
        var user = res.data.user;
        user.showage = parseInt(user.age/12)
        if (user.infoStatus == 1) {
          // 将时间戳转化成时间 
          var time = new Date(user.birthday);
          //  console.log("year="+year)
          var addZero = function (x) {
            return x < 10 ? '0' + x : x;
          };
          var year = time.getFullYear();
          var month = time.getMonth() + 1;
          var day = time.getDate();
          var brithday = year + '.' + addZero(month) + '.' + addZero(day);
          user.brith = brithday;
          // 将性别转化成男女 
          if (user.gender == 0) {
            user.gender = '男孩'
          }
          else {
            user.gender = '女孩'
          }
          that.setData({
            user: user,
            imgUrl: user.imgUrl,

          })
        } else {
          that.setData({
            imgUrl: imgUrl,

          })
        }
        }
      
      },
      fail: function () {
        that.setData({
          imgUrl: imgUrl,
        })
      }
    });

  },
  //去修改宝宝资料
  toBabyInfo: function () {
    that = this 
    var go = that.data.go
    if (go == true) {
      that.setData({
        go: false
      })
      wx.navigateTo({
        url: '../babyInfo/babyInfo',
        success: function (res) {
          // success
        },
        fail: function (res) {
          // fail

        },
        complete: function (res) {
          // complete
             console.log(res)
        }
      })
    }

  },
  //去打开记录
  toCardRecord: function () {
    that = this
    var go = that.data.go
    if (go == true) {
      that.setData({
        go: false
      })
      wx.navigateTo({
        url: '../cardRecord/cardRecord',

      })


    }


  },
  toAboutOur: function () {
    that = this;
    var go = that.data.go
    if (go == true) {
      that.setData({
        go: false
      })
      wx.navigateTo({
        url: '../aboutOur/aboutOur',
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }

  },



})