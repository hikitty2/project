/**record.js**/
// var tempFilePath;
// var savedFilePath;
var Interval;
var that;
var IntervalSec;
var myTimeSec;
var myTime;
var min;
var sec = 0;
var passMsecer = 1000;
var size;
var passMsec = 0;
var thousand;
// var totalTime;
// var content;
// var value;
// var title;
var request =getApp()
var requestUrl=request.requestUrl;
Page({
  data: {
    record: '录音',
    sec: "00",    //秒数
    minute: "00", //分钟数
    percent1: 0,  //每10毫秒进度条的增量
    tempFilePath: '',
    start: 'startRecordFir',// 点击录音按钮变换图片
    stop: 'stopRecordFir',// 点击停止按钮变换图片
    play: 'goPlayFir',// 点击播放按钮变换图片
    isStart: false,
    isStop: true,//gif图的判断
    isPlay: true,
    totalTime: "",
    complete: true,
    savedFilePath: "",
    src: '',
    content: '',
    isWave: false,
    uploadOk: "",
    name: '',
    title: '',
    teacher: "",
    imageUrl: '',
    isPlayr:1,//判断是播放还是暂停  1是第一次正常播放，2是暂停，3是暂停后播放
  },

  onLoad: function (options) {

    this.setData({
      value: wx.getStorageSync('key')
    })
    that = this;
    wx.request({
      url: requestUrl+'a/lesson/detail',
      data: {

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        
        // success
        that.setData({
          imageUrl: res.data.data.imageUrl,
          teacher: res.data.data.teacher,
          title: res.data.data.title,
          content: JSON.parse(res.data.data.content)
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //开始录音
  startRecord: function () {
    var that = this
    //取消新的计时器
    clearInterval(myTimeSec)
    clearInterval(IntervalSec)
    wx.stopVoice({

    })
    this.setData({
      percent1: 0,
      sec: "00",
      minute: "00",
      start: 'startRecordSec',
      stop: 'stopRecordSec',
      play: 'goPlayFir',
      record: '录音',
      isStart: true,
      isWave: true,
      isPlayr:1

    })
    //进度条的变化
    Interval = setInterval(function () {
      //每10毫秒进度条的增量
      that.setData({
        percent1: that.data.percent1 + 0.16666
      })
      
    }, 100)

    //时间的变化
    myTime = setInterval(function () {
      var sec = that.data.sec;
      var min = that.data.min;

      sec++;   //第一秒开始不是数字转换成数字 第二秒开始时开始增加
      //这个范围内秒数前需要一个‘0’
      if (sec > 0 && sec < 10) {
        that.setData({
          sec: "0" + sec
        })
      } else {
        that.setData({
          sec: sec
        })

      }
      //到达60时停止录音
      if (sec == 60) {
        
        that.setData({
          totalTime: that.data.sec,
          record: '重新录音',
          sec: "00",
          minute: "01",
          isStart: false,
          isStop: true,
          isPlay: false,
          complete: false,
          isWave: false,
          start: 'startRecordThi',
          stop: 'stopRecordFir',
          play: 'goPlaySec',
          isPlayr:1
        })
        // 取消两个计时器
        clearInterval(myTime)
        clearInterval(Interval)
        //初始化
  passMsecer = 1000;
            passMsec = 0;
            sec = 0;
      }


    }, 1000)
    //录音开始
    wx.startRecord({
      success: function (res) {
        //                 console.log("123")
        //             var tempFilePath=res.tempFilePath
        //             console.log(tempFilePath) 
        //              wx.saveFile({
        //       tempFilePath: tempFilePath,
        //       success: function(res) {
        //         console.log(res);
        //         console.log(res.savedFilePath)
        //         that.setData({
        //          savedFilePath : res.savedFilePath
        //         })

        //            wx.getSavedFileInfo({

        //   filePath: that.data.savedFilePath,
        //   success: function(res) {
        //     console.log(that.data.savedFilePath)
        //       size =parseInt((res.size/1024).toFixed(2));
        //          console.log("文件大小"+size+"kb")

        //     console.log(res.createTime)

        //   },
        //     fail:function(res){
        //         console.log(res)
        //       }

        // })
        //       },
        //       fail:function(res){
        //         console.log(res)
        //       }

        //     }) 

      },
      fail: function (res) {
      },
      complete: function (res) {
        
        var tempFilePath = res.tempFilePath
        
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            
            
            that.setData({
              savedFilePath: res.savedFilePath
            })

            wx.getSavedFileInfo({

              filePath: that.data.savedFilePath,
              success: function (res) {
                size = parseInt((res.size / 1024).toFixed(2));


              },
              fail: function (res) {
               
              }

            })
          },
          fail: function (res) {
           
          }

        })
      }

    })
    this.setData({
      isStart: true,
      isStop: false,
      isPlay: true,
      isPlayr:1
    })

  },
  //停止录音
  stopRecord: function () {
    var that = this;
    wx.stopRecord();
    clearInterval(Interval);
    clearInterval(myTime);
      passMsecer = 1000;
      passMsec = 0;
      sec = 0;

    this.data.sec++
    this.setData({
      totalTime: (that.data.sec-1),
      record: '重新录音',
      isStart: false,
      isStop: true,
      isPlay: false,
      complete: false,
      isWave: false,
      start: 'startRecordThi',
      stop: 'stopRecordFir',
      play: 'goPlaySec',
      isPlayr:1
    })
    console.log(this.data.totalTime)
  },
  //播放录音!!
  goPlay: function () {
    that = this;
   
    var totalTimeMesc = (that.data.totalTime) * 1000;
    if (that.data.isPlayr==1) {
      
       //判断是否重播
        wx.playVoice({
      filePath: that.data.savedFilePath,

      success: function (res) {
        // success
       

      },
      fail: function (res) {
       
      }
    });
      console.log("123")
      that.setData({
        sec:"00",
        min:"00",
        minute: "00",
        percent1:0,
        isPlayr:2,
        play:'goPlayThi',
        isWave:true
      })
      IntervalSec = setInterval(function () {
          //每10毫秒进度条的增量
          that.setData({
            percent1: that.data.percent1 + 0.08333

          })
          passMsec = passMsec + 50
          
          
          if (passMsec == passMsecer) {
            passMsecer = passMsecer + 1000;

                sec =sec+1
              
            if (sec > 0 && sec < 10) {
              that.setData({
                sec: "0" + sec
              })
            } else {
              that.setData({
                sec: sec
              })

            }
       

          }
          if(passMsec == totalTimeMesc){

            clearInterval(IntervalSec);
            that.setData({
              //percent1:0,
              //sec:"00",
              //min:"00",
              play:'goPlaySec',
              isWave:false,
              isPlayr:1

            })
            passMsecer = 1000;
            passMsec = 0;
            sec = 0;
          }
          
        }, 50)


    } else {
     if (that.data.isPlayr == 2) {  //暂停
        wx.pauseVoice({
      
        }) 
        that.setData({
          isPlayr:3,
          play:'goPlaySec',
          isWave:false,               
        })
       
       clearInterval(IntervalSec);




      } else if (that.data.isPlayr == 3) { //点过暂停过的播放
        that.setData({
          isPlayr: 2,
          play:'goPlayThi' ,
          isWave:true,
              
        })
        //音频播放
                  wx.playVoice({
      filePath: that.data.savedFilePath,

      success: function (res) {
        // success
      

      },
      fail: function (res) {
        
      }
    })
           IntervalSec = setInterval(function () {
          //每10毫秒进度条的增量
          that.setData({
            percent1: that.data.percent1 + 0.08333

          })
          passMsec = passMsec + 50
          
         
          if (passMsec == passMsecer) {
            passMsecer = passMsecer + 1000;

                sec =sec+1
               
            if (sec > 0 && sec < 10) {
              that.setData({
                sec: "0" + sec
              })
            } else {
              that.setData({
                sec: sec
              })

            }
         

          }
          if(passMsec == totalTimeMesc){
            console.log("@")
            clearInterval(IntervalSec);
            that.setData({
              //percent1:0,
              //sec:"00",
              //min:"00",
              play:'goPlaySec',
              isWave:false,
              isPlayr:1
            })
            passMsec=0
            passMsecer = 1000;
            sec = 0;
            
          }
        }, 50)
        //播放录音
 

      }


    }



 },


   
    
 

  //上传
  uploadPic: function () {
    var contentStr = JSON.stringify(that.data.content);
    

    //记录是否被上传上去 如果被上传成功  此值变为2
    that.setData({
      uploadOk: 1
    })

    //上传
    wx.uploadFile({
      url: requestUrl+'a/u/img/audio?token=' + that.data.value,
      filePath: that.data.savedFilePath,
      name: 'file',

      success: function (res) {
        //记录是否被上传上去 如果被上传成功  此值变为2
        that.setData({
          uploadOk: 2
        })





        //服务器返回的地址
        var data = JSON.parse(res.data)

        wx.request({
          url: requestUrl+'a/u/user/lesson?token=' + that.data.value,
          data: {
            url: data.data.url,
            name: that.data.title,
            seconds: that.data.totalTime,
            size: size,
            content: contentStr
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT

          success: function (res) {
            if (res.data.code == 0) {
              //上传成功提示
              wx.showToast({
                title: "打卡成功",
                icon: "success",
                mask: true
              })

              setTimeout(function(){
                wx.navigateBack({
                  url: '../card/card',
                  success:function(){
                  }
                })
              },1000)


            }
            else {
              wx.showModal({
                title: "",
                content: res.data.message,
                showCancel: false
              })
            }



          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })

        //do something
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {

      }
    })
    //发送请求



  }
})

