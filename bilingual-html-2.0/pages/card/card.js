var that;
var request = getApp()
var requestUrl = request.requestUrl
Page({
    data: {
        pass: "",
        hour: new Date().getHours(),
        sayhello: "",
        setting: "",
        eightyBelow: "",
        todayStatus: "",
        daytime: new Date(),
        thumbNum: '',
        rank: "",
        //登陆者信息
        userInfo: {},

        //课程信息
        lessonInfo: {},
        go: true,
    },

    onLoad: function (res) {
        that = this;
//   //获取课程详情
        wx.request({
            url: requestUrl + 'a/lesson/detail',
            data: {},
            method: 'GET',
            // header: {}, // 设置请求的 header
            success: function (res) {
                that.setData({
                    lessonInfo: res.data.data
                });

            },
            fail: function () {
                console.log(res)
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },

    //onload一个页面只能触发一次
    onShow: function () {

        that = this;
        that.setData({
            go: true
        });

        var getInfo =function(res){
            var userInfo = res.data;
            var rate = parseInt(res.data.rate);
            var todayStatus = res.data.todayStatus;
            var thumbNum=2
            that.setData({
                userInfo: userInfo,
                rate: rate,
                todayStatus: res.data.todayStatus

            });
            //问候语设置
            if (that.data.hour >= 0 && that.data.hour < 9) {
                that.setData({
                    sayhello: "清晨好"
                })
            } else if (that.data.hour < 12) {
                that.setData({
                    sayhello: "上午好"
                })
            } else if (that.data.hour >= 12 && that.data.hour < 15) {
                that.setData({
                    sayhello: "中午好"
                })
            } else if (that.data.hour >= 15 && that.data.hour < 18) {
                that.setData({
                    sayhello: "下午好"
                })
            } else if (that.data.hour >= 18 && that.data.hour <= 23) {
                that.setData({
                    sayhello: "傍晚好"
                })
            }
            //大拇指
            if (rate >= 60) {
                thumbNum += 1;
                if (rate >= 80) {
                    thumbNum += 1;
                    if (that.data.userInfo.rank <= 10) {
                        thumbNum = 5
                    }
                }
            }
            that.setData({
                thumbNum: thumbNum

            });
        }

        //登录
        var value = wx.getStorageSync('key')
        if (value == '') {
            wx.login({
                success: function (res) {
                    var code = res.code
                    wx.request({
                        dataType: 'json',
                        url: requestUrl + 'a/login',
                        data: {
                            wxcode: code
                        },
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            var thumbNum = 2;
                            var key = res.data.data.token;
                            wx.setStorageSync('key', key)
//获取登陆者信息
                            wx.request({
                                url: requestUrl + 'a/u/user?token=' + key,
                                method: 'GET',
                                data: {},
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: function (res) {
                                    getInfo(res)
                                },
                                complete: function () {
                                }
                            })
                        },
                        fail: function () {
                            // fail
                        },
                        complete: function () {

                        }
                    })
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })


        }

        else {
//获取登陆者信息
            wx.request({
                url: requestUrl + 'a/u/user?token=' + value,
                method: 'GET',
                data: {},
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    if (res.data.code == 0) {
                        getInfo(res)
                    }


                    else if (res.data.code == -2 || res.data.code == -2018) {
                        wx.login({
                            success: function (res) {
                                var code = res.code
                                wx.request({
                                    dataType: 'json',
                                    url: requestUrl + 'a/login',
                                    data: {
                                        wxcode: code
                                    },
                                    method: 'POST',
                                    header: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    success: function (res) {

                                        var key = res.data.data.token;
                                        wx.setStorageSync('key', key);
//获取登陆者信息
                                        wx.request({
                                            url: requestUrl + 'a/u/user?token=' + key,
                                            method: 'GET',
                                            data: {},
                                            header: {
                                                'content-type': 'application/json'
                                            },
                                            success: function (res) {
                                            getInfo(res)


                                            },
                                            complete: function () {
                                            }
                                        })
                                    },
                                    fail: function () {
                                        // fail
                                    },
                                    complete: function () {

                                    }
                                })
                            },
                            fail: function () {
                                // fail
                            },
                            complete: function () {

                                // complete


                            }
                        })


                    }
                }
            })
        }


    },

    qqqqq: function () {
        that = this;
        var go = that.data.go
        if (go == true) {
            that.setData({
                go: false
            })
            wx.navigateTo({
                url: '../record/record'
            })
        }
    },
    recard: function () {
        wx.navigateTo({
            url: '../record/record'
        })
    },


    //去完善资料
    goToInfo: function () {
        wx.navigateTo({
            url: '../babyInfo/babyInfo'
        })
    },
    toCardRecord: function () {
        that = this;
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


})