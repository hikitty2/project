//cardRecord.js
var request =getApp()
var requestUrl=request.requestUrl
Page({
    data: {
        total: '1',
        cardRecordList: '',
        dateArr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        totalRecord: '',
        headPic: '',
        go:true,
        uid:'',
        isShare:"",
        shareName:""
    },
    //页面分享
    onShareAppMessage: function () {
        return {
            title: '我的打卡记录',
            desc: '100天培养双语儿童',
            path: '/pages/cardRecord/cardRecord?uid='+this.data.uid
        }
    },
    //页面加载 
    onShow:function(){
        var that =this;
         that.setData({
      go:true
    })    
    },
    onLoad: function (e) {
        var that = this;

        //分享uid
        var uid = e.uid;

        //获取本地存的token
        var value = wx.getStorageSync('key');

        /*canvas*/
        const ctx = wx.createCanvasContext('myCanvas')

        //设置左边的秒数字
        ctx.beginPath()
        ctx.setStrokeStyle('#e8e8e8');
        ctx.setFillStyle('#999999');
        ctx.setFontSize(12)
        ctx.fillText(60, 10, 20)
        ctx.fillText(50, 10, 40)
        ctx.fillText(40, 10, 60)
        ctx.fillText(30, 10, 80)
        ctx.fillText(20, 10, 100)
        ctx.fillText(10, 10, 120)
        ctx.fillText(0, 15, 140)

        //设置坐标轴两条线  config
        //竖线
        ctx.beginPath()
        ctx.moveTo(30, 10)
        ctx.lineTo(30, 140)
        ctx.stroke()

        //横线
        ctx.beginPath()
        ctx.moveTo(30, 140)
        ctx.lineTo(350, 140)
        ctx.stroke()
        // ctx.setStrokeStyle('red')

        // //设置y轴的日期

        // 根据数据画出主体线 并画出x轴的日期
        /*canvas*/

  
        var createLine = function (res){
          
                var list = JSON.parse(JSON.stringify(res.data.data)).reverse() //这个是倒序的
                var cardRecordList = res.data.data;//这个是正序的，
            cardRecordList=list.slice(0,7).reverse();
            console.log(cardRecordList);
                cardRecordList.forEach(function (data, index) {
                         ctx.setStrokeStyle('#999999')
                        ctx.setFillStyle('#999999')
                    if (index == 6 || (cardRecordList.length != index && index < 6)) {
                        console.log(data);


                        var month = that.data.dateArr[new Date(parseInt(data.updateAt)).getMonth()]
                        var day = new Date(parseInt(data.updateAt)).getDate()
                        //x轴日期 取出时间戳 并进行转换
                        if (day < 10) {
                            day = '0' + day;
                        }
                        var xWord = month + ' ' + day;
                         ctx.beginPath()
                         ctx.setFillStyle('#999999')
                        ctx.fillText(xWord, (index) * 45+13, 160)
                        ctx.fill()
                        ctx.closePath()


                        //小原点
                        ctx.beginPath()
                        ctx.setFillStyle('#4fb3fd')
                        ctx.arc(index * 45 + 30, 140 - data.recordSeconds * 2, 2.5, 0, 2 * Math.PI)
                        ctx.fill()
                        ctx.closePath()

                 
                    }



                    //画出主体线段
                        
                    if (cardRecordList.length - 1 != index && index < 6) {
                        ctx.beginPath()
                        ctx.moveTo(index * 45 + 30, 140 - data.recordSeconds * 2)
                        ctx.lineTo((index + 1) * 45 + 30, 140 - cardRecordList[index + 1].recordSeconds * 2)
                        ctx.setStrokeStyle('#4fb3fd')
                        ctx.stroke()
                        ctx.closePath()

                    }

                })
                ctx.draw()

                /*canvas结束*/

                for (var i = 0; i < list.length; i++) {
                    var title = list[i].recordName;
                    var omTitle;
                    if (title.length > 35) {     //标题超过25字，加‘..’
                        omTitle = title.substring(0, 35) + "...";
                        list[i].recordName = omTitle
                    };
                    var updateAt = list[i].updateAt;
                    var addZero = function (x) {
                        return x < 10 ? '0' + x : x;
                    }
                    var updateAt = new Date(updateAt)//这一步一定不能少，将时间戳转化为时间格式，才能进一步转化。
                    var year = updateAt.getFullYear();
                    var month = updateAt.getMonth() + 1;
                    var date = updateAt.getDate();
                    var hours = updateAt.getHours();
                    var min = updateAt.getMinutes();
                    list[i].updateAt = year + '.' + addZero(month) + '.' + addZero(date) + ' ' + addZero(hours) + ':' + addZero(min)

                };
                that.setData({
                    list: list,
                    total: res.data.total
                })
        }
        if(!uid){
           
            // //请求个人信息
            wx.request({
                url: requestUrl+'a/u/user?token=' + value,
                data: {},
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (res) {
                    that.setData({
                        totalRecord: res.data.user.totalRecord,
                        headPic: res.data.user.imgUrl,
                        uid: res.data.user.id
                    })
                    //非分享
                    wx.request({
                        url: requestUrl+'a/u/user/lesson/list?token=' + value,
                        data: {
                            size: 1000,
                        },
                        method: 'GET',
                        header: {
                            'content-Type': 'application/json'
                        },
                        success: function (res) {
                            createLine(res)

                        }
                    })
                },
            })

        }else{
             that.setData({
                isShare:true
            })
            //请求分享者信息
            wx.request({
                url: requestUrl+'a/user/'+uid,
                data: {},
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (res) {
                    that.setData({
                        totalRecord: res.data.user.totalRecord,
                        headPic: res.data.user.imgUrl,
                        uid: res.data.user.id,
                        shareName:res.data.user.name
                    })
                },
            })


            //分享
            wx.request({
                url: requestUrl+'a/user/'+uid+'/lesson/list',
                data: {
                    size: 1000
                },
                method: 'GET',
                header: {
                    'content-Type': 'application/json'
                },
                success: function (res) {
                    createLine(res)

                }
            })
        }


    },
   

    //点击进入详情页
    toCardInfo: function (e) {
        var index = e.target.dataset.id
        var that = this;
        var go = that.data.go
        if (go == true) {
            that.setData({
                go: false
            })
            wx.navigateTo({
                url: '/pages/cardInfo/cardInfo?index=' + index
            })
        }
    },
})
