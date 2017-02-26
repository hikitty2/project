//cardInfo.js
var that;
var int;
var res;
var end;
var ender;
var enderr;
var request =getApp()
var requestUrl=request.requestUrl;
Page({
  data: {
    record: {},
    value: '',
    filePath: '',
    end: '',
    percent: 0,
    recordContent: '',
    isPlay: '1',
    int: '',
    id:'',
    res: '',
    uid:'',
    playIcon:true
  },
  //打卡详情
  onShareAppMessage: function () {
  
    return {
      title: '打卡详情',
      desc: '100天培养双语儿童',
      path: '/pages/cardInfo/cardInfo?id='+this.data.id
    }
  },

   onUnload: function() {
    // Do something when page close.
    wx.pauseVoice({
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });
    clearInterval(res);
  },
  onLoad: function (e) {
    var value = wx.getStorageSync('key');
    var id = e.index++||e.id;
    var uid = e.uid;
     this.setData({
      id:id
    });
    that = this;
    var getAudio = function(res){
      var str;
      str = JSON.parse(res.data.data.recordContent);
      var record = res.data.data;
      record.recordContent = str
      var time = new Date(record.updateAt);
      var addZero = function (x) {
        return x < 10 ? '0' + x : x;
      };
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var day = time.getDate();
      var hours = time.getHours();
      var min = time.getMinutes();
      var updateAt = year + '.' + addZero(month) + '.' + addZero(day) + ' ' + addZero(hours) + ':' + addZero(min);
      record.updateAt = updateAt;
      that.setData({
        record: record,
        end: record.recordSeconds,
        recordContent: str
      })

      wx.downloadFile({
        url: that.data.record.recordUrl,
        success: function (res) {
          console.log(res)
          that.setData({
            filePath: res.tempFilePath
          })
        },
        fail:function(res){
          console.log(res)
        }
      })
    }
    // if(!uid){
    //   //请求个人信息
    //   wx.request({
    //     url: requestUrl+'a/u/user?token=' + value,
    //     data: {},
    //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //     // header: {}, // 设置请求的 header
    //     success: function (res) {
    //       that.setData({
    //         uid: res.data.user.id
    //       })
    //     }
    //   });

    //   //非分享
    //   wx.request({
    //     url: requestUrl+'a/u/user/lesson/' + id + '/detail?token=' + value,
    //     data: {},
    //     method: 'GET',
    //     // header: {},
    //     success: function (res) {
    //       getAudio(res)
    //     }
    //   })
    // }else{

      //分享
      wx.request({
        url: requestUrl+'a/record/'+id+'/detail',
        data: {},
        method: 'GET',
        // header: {},
        success: function (res) {
          getAudio(res)
        }
      })
    // }

  },


 goPlay: function () {
   
    var add = (50 / (that.data.record.recordSeconds * 1000)) * 100;
    that = this;
    if (that.data.end == 0) {  //判断是否重新播放 
      that.setData({
        percent: 0
      })
      that.setData({
          isPlay: 2,
          playIcon:false
        })
        wx.playVoice({
          filePath: that.data.filePath,
          success: function (res) {
          }
        })

         end = that.data.end;
        ender = end*1000;
        enderr = ender;
        var percent = that.data.percent;
        // var end =10
         add = (50 / (that.data.record.recordSeconds * 1000)) * 100;
        // int = setInterval(function () {  //
        //   end--;
        //   that.setData({
        //     end: end,
        //   })
        //   if (end == 0) {
        //     clearInterval(int)
        //     console.log(percent)            
        //     that.setData({
        //       isPlay: true,
        //       playIcon:true,
        //       percent:0,
        //       end:that.data.record.recordSeconds
            
        //     })
        //   }
        // },
          // 1000)
        res = setInterval(function () {
          percent = percent + add;
          enderr = enderr-50;
            that.setData({
              percent: percent,
            })
          
          if(ender-enderr==1000){
            end--;
            ender = (ender-1000)
              that.setData({
              end:end
            })
          }
          if (end == 0) {
            clearInterval(res)
            that.setData({
              percent:0,
              playIcon:true,
              isPlay:'1',
              end:that.data.record.recordSeconds
            })
          }
        },
          50)




    } else {
      if (that.data.isPlay == 1) {//判断是暂停还是播放
        that.setData({
          isPlay: 2,
          playIcon:false
        })
        wx.playVoice({
          filePath: that.data.filePath,
          success: function (res) {
          }
        })

         end = that.data.end;
        ender = end*1000;
        enderr = ender;
        var percent = that.data.percent;
        // var end =10
         add = (50 / (that.data.record.recordSeconds * 1000)) * 100;
        // int = setInterval(function () {  //
        //   end--;
        //   that.setData({
        //     end: end,
        //   })
        //   if (end == 0) {
        //     clearInterval(int)
        //     console.log(percent)            
        //     that.setData({
        //       isPlay: true,
        //       playIcon:true,
        //       percent:0,
        //       end:that.data.record.recordSeconds
            
        //     })
        //   }
        // },
          // 1000)
        res = setInterval(function () {
          percent = percent + add;
          enderr = enderr-50;
            that.setData({
              percent: percent,
            })
          
          if(ender-enderr==1000){
            end--;
            ender = (ender-1000)
              that.setData({
              end:end
            })
          }
          if (end == 0) {
            clearInterval(res)
            that.setData({
              percent:0,
              playIcon:true,
              isPlay:"1",
              end:that.data.record.recordSeconds

            })
          }
        },
          50)
      } else if (that.data.isPlay == 2) {
        that.setData({
          isPlay: 3,
          playIcon:true,
        })
        wx.pauseVoice({  //停止播放
          success: function () {
          },
        });
        clearInterval(int);
        clearInterval(res);
      } else if (that.data.isPlay == 3) {
        that.setData({
          isPlay: 2,
          playIcon:false,
        })
       
        var percent = that.data.percent;
        wx.playVoice({
          filePath: that.data.filePath,
          success: function (res) {
          }
        })


        // var end =10

        // int = setInterval(function () {  //
        //   end--;
        //   that.setData({
        //     end: end,
        //   })
        //   if (end == 0) {
        //     clearInterval(int)
        //     that.setData({
        //       isPlay: true,
        //       playIcon:true,
        //       percent:0,
        //       end:that.data.record.recordSeconds,
        //     })
        //   }
        // },
        //   1000)
      res = setInterval(function () {
          percent = percent + add;
          enderr = enderr-50;
            that.setData({
              percent: percent,
            })
          
          if(ender-enderr==1000){
            end--;
            ender = (ender-1000)
              that.setData({
              end:end
            })
          }
          if (end == 0) {
            clearInterval(res)
            that.setData({
              percent:0,
              playIcon:true,
              isPlay:'1',
              end:that.data.record.recordSeconds,
            })
          }
        },
          50)
      }
    }
  },


})