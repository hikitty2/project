/**personal.js**/
var seconds;
var timer;
var value;
var url;
var that;
var headPicSrc = "../../images/BbInfoHeadPic.png";
var request =getApp()
var requestUrl=request.requestUrl
Page({
    data: {
        headPicSrc: '',
        birth: "未设置",//视图层数据
        hidden: true,
        bath: false,  //是否禁用宝宝生日跟手机号
        sex: '未设置',//视图层数据
        name: '',  //后端数据
        reName: '',//判断名字是否合法
        birthday: 1231632000000,//后端数据
        birthClass: 'birthPlaceholder',
        genderClass: 'genderPlaceholder',
        nameLength: '6',
        gender: '',//后端数据
        mobile: '',//后端数据
        phoneNumber: '',
        imageUrl: '',//后端数据
        address: '客户未授权',//后端数据
        isCode: true,//验证码是否渲染。根据infoStatus
        code: '',//传给后台
        // countDown:"重获(59s)",
        messageCode: '短信验证',
        timeOut: false,//验证码按钮是否可点
        voiceCode: '语音验证',
        messageCodeCss: '',
        reEnName: true,
        reChName: true,
        userInfo: {},
        user: {},
        isSendCode: true,
        isVerity: '',
        endDate: '',
        go: true,
        requestUrl:'',
        dateValue:'2011-01-01'
      
    },
    //获取地址
    onShow: function () {    
        that.setData({
            go: true,
        })
    },
    onLoad: function () {
        that = this;
        var addZero = function (x) {
            return x < 10 ? '0' + x : x
        };
        var endDate = new Date()
        var year = endDate.getFullYear();
        var month = endDate.getMonth() + 1;
        var day = endDate.getDate();
        endDate = year + '-' + addZero(month) + '-' + addZero(day)
        that.setData({
            endDate: endDate
        })


        //获取token
        value = wx.getStorageSync('key');
        wx.request({
            url: requestUrl+'a/u/user/?token=' + value,
            data: {},
            header: {
                'content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res)
                var user = res.data.user;
                if (user.infoStatus == 0) {
                    that.setData({
                        headPicSrc: headPicSrc
                    })
                } else {
                    that.setData({
                        headPicSrc: user.imgUrl,
                        imageUrl: user.imgUrl,
                        gender: user.gender,
                        birthday: user.birthday,
                        mobile: user.mobile,
                        name: user.name,
                        birthClass: 'birthValue',
                        genderClass: 'genderValue',
                        bath: true,
                        isCode: false,
                        address: user.address
                    })
                    var start = user.mobile.substring(0, 3)
                    var end = user.mobile.substring(7, 11)
                    var mobile = start + '****' + end
                    // 将时间戳转化成时间
                    var time = new Date(user.birthday);
                    var year = time.getFullYear();
                    var month = time.getMonth() + 1;
                    var day = time.getDate();

                    var birthday = year + '.' + addZero(month) + '.' + addZero(day)
                    //将性别转化成男女
                    if (user.gender == 0) {
                        user.gender = '男'
                    }
                    else {
                        user.gender = '女'
                    }
                    that.setData({
                        sex: user.gender,
                        birth: birthday,
                        phoneNumber: mobile,
                        reName: true
                    })
                }
                //
            },
            fail: function () {
            }
        })
        //获取地址
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                wx.request({
                    url: 'https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=1&ak=BWlUcywANnPLtIRqG0wYizt7uDFfyPc8',
                    data: {},
                    dataType: 'json',
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: { 'Content-Type': 'application/json' },
                    // 设置请求的 header
                    success: function (ops) {
                        var MhLocation = ops.data.match(/\(.*\)/g)
                        var locationStr = function () {
                            var t = MhLocation[0].substring(1, MhLocation[0].length - 1)
                            return t
                        } ()
                        var location = JSON.parse(locationStr)
                        var city = location.result.addressComponent.city;
                        var district = location.result.addressComponent.district
                        if (city != '') {
                            that.setData({
                                address: city + district
                            })
                        }

                    },
                    fail: function (res) {
                        console.log(res)
                    }
                })
            }
        })
    },

    //头像选择
    changePic: function () {
        var that = this;
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: requestUrl+'a/u/img/babyPic?token=' + value,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    // header: {}, // 设置请求的 header
                    // formData: {}, // HTTP 请求中其他额外的 form data
                    success: function (res) {
                        
                        // success
                        url = JSON.parse(res.data).data.url
                        console.log(url)
                        that.setData({
                            headPicSrc: tempFilePaths,  //获取临时地址
                            imageUrl: url,
                        })
                    },
                })
                // that.setData({
                //     headPicSrc: tempFilePaths,  //获取临时地址
                //     imageUrl: url,
                // })
            },
        })
    },
    //获取宝宝名字
    // bbNameInput: function (e) {
    //     var that = this
    //     var name = e.detail.value
    //     console.log(name)
    //     var chName = /^[\u4e00-\u9fa5]/;  //判断名字是否是中文
    //     var reChName = chName.test(name);
    //     console.log(reChName)
    //     var enName = /^[a-zA-Z]/; //判断名字是否是英文
    //     var reEnName = enName.test(name)
    //     console.log(reEnName)
    //     if (reChName == true) {
    //         that.setData({
    //             nameLength: '6',
    //             reName: true,
    //         })
    //     }
    //     else if (reEnName == true) {
    //         that.setData({
    //             nameLength: '14',
    //             reName: true,
    //         })

    //     }
    //     else if (reEnName == false && reChName == false) {
    //         that.setData({
    //             reName: false
    //         })
    //     }
    //     that.setData({
    //         name:name
    //     })

    // },
    getName: function (e) {   //获取名字
        var name = e.detail.value
        that.setData({
            name: name
        })


        var chName = /^[\u4e00-\u9fa5]{2,6}$/;  //判断名字是否是中文
        var reChName = chName.test(name);
        var enName = /^[a-zA-Z]{2,14}$/; //判断名字是否是英文
        var reEnName = enName.test(name)
        that.setData({
            reChName: reChName,
            reEnName: reEnName,
        })
        //     if (reChName == true) {
        //         that.setData({
        //             nameLength: '6',
        //             reName: true,
        //         })
        //     }
        //     else if (reEnName == true) {
        //         that.setData({
        //             nameLength: '14',
        //             reName: true,
        //         })

        //     }




    },
    //选择男女
    selectSex: function () {
        var that = this
        wx.showActionSheet({
            itemList: ['男', '女',],
            success: function (res) {
                if (!res.cancel) {
                    var sexIndex = res.tapIndex;
                    that.setData({
                        genderClass: 'genderValue',
                        gender: sexIndex,
                    })
                    if (sexIndex == 0) {
                        that.setData({
                            sex: "男"
                        })
                    }
                    else {
                        that.setData({
                            sex: "女"
                        })
                    }
                }
            }
        })
    },
    //设置生日
    datePickerBindchange: function (e) {
        var that = this;
        var dateValue = e.detail.value;
        // hidden:false

        wx.showModal({
            title: "提示",
            content: "生日提交后不能修改哦",
            cancelColor: "#999999",
            confirmColor: "#e44b46",
            success: function (res) {
                if (res.confirm) {
                    //将生日转化成时间戳
                    var birthday = Date.parse(dateValue)
                    that.setData({
                        birthday: birthday  //要上传的数据
                    })
                    var addZero = function (x) {
                        return x < 10 ? '0' + x : x
                    };
                    var wxmlBrith = new Date(birthday);
                    var year = wxmlBrith.getFullYear();
                    var month = wxmlBrith.getMonth() + 1;
                    var date = wxmlBrith.getDate();
                    var wxmlBrith = year + '.' + addZero(month) + '.' + addZero(date)
                    that.setData({
                        birth: wxmlBrith,  //视图层数据
                        birthClass: 'birthValue'
                    })
                }
            }
        })
    },
    confirm: function () {  //宝宝生日选择确定
        this.setData({
            hidden: true,
            bath: true
        })
    },
    cancel: function () {  //宝宝生日选择确定
        this.setData({
            hidden: true,
            dateValue: "2011-1-1"
        })
    },



    mobile: function (e) {  //手机号码赋值
        var mobile = e.detail.value;
        that.setData({
            mobile: mobile,

        })
    },
    messageCode: function () {
        var that = this;
        if (that.data.mobile.length != 11) {
            wx.showModal({
                title: "",
                content: '请输入正确的手机号',
                showCancel: false
            })
        } else {
            //判断是否注册，
            wx.request({
                url: requestUrl+'a/code/send?token=' + value,
                data: {
                    mobile: that.data.mobile
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header
                success: function (res) {
                    // success
                    console.log(res)
                    if (res.data.code !=0) {
                        wx.showModal({
                            title: "",
                            content: res.data.message,
                            showCancel: false
                        });
                        console.log("123")


                    } else {

                        that.setData({
                            messageCodeCss: "messageCodeCss",
                        })
                        seconds = 60;
                        that.setData({
                            messageCode: '重获(' + (seconds) + 's)',
                            timeOut: true,
                            isSendCode: false,
                        })
                        timer = setInterval(function () {
                            if (seconds == 0) {
                                that.setData({
                                    messageCode: '短信验证',
                                    timeOut: false
                                })
                                clearInterval(timer);
                            } else {
                                 if(seconds==60){
                                    seconds--
                                }
                                that.setData({
                                    messageCode: '重获(' + (seconds) + 's)',

                                })
                                seconds--
                            }
                        }, 1000)
                    }


                    //这里没有测试过
                },
            })



        }


    },
    voiceCode: function () {
        var that = this;
        if (that.data.mobile.length != 11) {
            wx.showModal({
                title: "",
                content: '请输入正确的手机号',
                showCancel: false
            })
        } else {
            wx.request({
                url: requestUrl+'a/code/voice?token=' + value,
                data: {
                    mobile: that.data.mobile
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header
                success: function (res) {
                    // success
                    if (res.data.code != 0) {
                        wx.showModal({
                            title: "",
                            content: res.data.message,
                            showCancel: false
                        });


                    }  else {
                        seconds = 60;
                        that.setData({
                            voiceCode: '重获(' + (seconds) + 's)',
                            timeOut: true,
                            isSendCode: false,

                        })
                        timer = setInterval(function () {
                            if (seconds == 0) {
                                that.setData({
                                    voiceCode: '语音验证',
                                    timeOut: false
                                })
                                clearInterval(timer);
                            } else {
                                if(seconds==60){
                                    seconds--
                                }
                                that.setData({
                                    voiceCode: '重获(' + (seconds) + 's)',
                                })
                                seconds--
                            }
                        }, 1000)
                    }
                },
            })
        }


    },
    getCode: function (e) {
        var that = this;
        that.setData({
            code: e.detail.value
        })
    },



    submit: function () {  //这里还需要一个判定，判定内容是否填写。
        that = this
        var go = that.data.go
        var isCode;
        var isVerity;
        if (that.data.isCode) {  //验证需要短信验证开始
            wx.request({
                url: requestUrl+'a/u/captcha/verification?token=' + value,
                data: {
                    mobile: that.data.mobile,
                    verify: that.data.code,
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                    // if (res.data.code == 0) {
                    // success
                    that.setData({
                        isVerity: res.data.message
                    })
                    //如果验证码正确的话 就开始校验填写
                    if (that.data.imageUrl == '') {
                        wx.showModal({
                            title: "",
                            content: "请选择头像",
                            showCancel: false
                        })
                    }
                    else if (that.data.name.length == 0) {
                        wx.showModal({
                            title: "",
                            content: "请输入宝宝名字",
                            showCancel: false
                        })
                    } else if (that.data.reChName == false && that.data.reEnName == false) {
                        wx.showModal({
                            title: "",
                            content: "宝宝姓名格式错误",
                            showCancel: false
                        })
                    }

                    else if (that.data.sex == '未设置') {
                        wx.showModal({
                            title: "",
                            content: "请选择性别",
                            showCancel: false
                        })
                    }
                    else if (that.data.birthday == '') {
                        wx.showModal({
                            title: "",
                            content: "请选择生日",
                            showCancel: false
                        })
                    }
                    else if (that.data.mobile.length != 11) {
                        wx.showModal({
                            title: "",
                            content: "请输入正确的手机格式",
                            showCancel: false
                        })
                    } else if (res.data.code != 0) {
                        wx.showModal({
                            title: "",
                            content: res.data.message,
                            showCancel: false
                        })
                    }

                    else {
                        wx.request({
                            url: requestUrl+'a/u/user?token=' + value,
                            data: {
                                img: that.data.imageUrl,
                                gender: that.data.gender,
                                birthday: that.data.birthday,
                                mobile: that.data.mobile,
                                address: that.data.address,
                                name: that.data.name,
                                code: that.data.code
                            },
                            method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header
                            success: function (res) {
                              if(res.data.code==0){
                                var go = that.data.go
                                if (go == true) {
                                    that.setData({
                                        go: false
                                    })
                                    wx.showToast({
                                        title: '保存成功'
                                    })
                                    setTimeout(function () {
                                        wx.navigateBack({
                                            url: '../personal/personal',
                                        })
                                    }, 2000)
                                }
                              }else{
                                  wx.showModal({
                                title: "",
                                content: res.data.message,
                                showCancel: false
                            })
                              }
                              



                            },
                        })
                    }
                    // }
                    //验证码不正确的情况
                    // else {
                    //     wx.showModal({
                    //         title: "",
                    //         content: res.data.message,
                    //         showCancel: false
                    //     })
                    // }

                },

            })
        }//验证是否需要短信验证结束
        else {

            //如果验证码正确的话 就开始校验填写
            if (that.data.name.length == 0) {
                wx.showModal({
                    title: "",
                    content: "名字不能为空",
                    showCancel: false
                })
            }
            else if (that.data.reEnName == false && that.data.reChName == false) {
                wx.showModal({
                    title: "",
                    content: "宝宝姓名格式错误",
                    showCancel: false
                })
            }
            else {
                wx.request({
                    url: requestUrl+'a/u/user?token=' + value,
                    data: {
                        img: that.data.imageUrl,
                        gender: that.data.gender,
                        birthday: that.data.birthday,
                        mobile: that.data.mobile,
                        address: that.data.address,
                        name: that.data.name,
                        code: that.data.code
                    },
                    method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header
                    success: function (res) {
                        console.log(that.data.imageUrl)
                        if(res.data.code==0){
                            if (go == true) {
                            that.setData({
                                go: false
                            })
                            wx.showToast({
                                title: '保存成功'
                            })
                            setTimeout(function () {
                                wx.navigateBack({
                                    url: '../personal/personal',
                                })
                            }, 2000)
                        }
                        }
                        else{
                         wx.showModal({
                            title: "",
                            content: res.data.message,
                            showCancel: false
                         })
                        }



                    }
                })
            }
        }
    }
})