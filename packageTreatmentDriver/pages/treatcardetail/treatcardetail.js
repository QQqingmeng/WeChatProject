// pages/cardetail/cardetail.js
const app = getApp()
var map = {};
var jsSensorList = [];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    "sensorList": [],
    "sensorRealValueMap": {},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    console.log(JSON.stringify(options))
    if(options.carId!=null){
      that.setData({
        carId: options.carId,//获取从上一个页面的carid
      })
    }
    else{
      that.setData({
        carId: app.globalData.userData[0].carId,
      })
    }

    console.log(that.data.siteName)

    /**
     * 获取传感器和监控
     */
    wx.request({
      url: app.globalData.QUERY_VideoAndSensorByCarIdfoForWX_URL,
      data: { carId: that.data.carId },
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        jsSensorList = res.data.sensorList
        that.setData({
          sensorList: res.data.sensorList,
          videoData: res.data.video,
        });
        that.getRealValue();
        that.setData({
          timer: setInterval(function () {
            that.getRealValue();
          }, 2000)
        })
        //that.getRealValue();

      },
      fail: function (err) {
        console.log(err)
      }
    })
  },


  /**
  * 查询站点信息
  */
  queryAllSite: function () {
    var that = this;
    console.log("queryAllSite")
    wx.request({
      url: app.globalData.QUERY_AllSite_URL,
      data: {},
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res.data)
        that.setData({
          siteData: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  /*根据sensorID获取传感器实时数据*/
  getRealValue: function () {
    var that = this;
    console.log("getRealValueBySensorId")
    /*根据sensorID获取传感器实时数据*/
    for (var index = 0; index < jsSensorList.length; index++) {
      var sensorId = jsSensorList[index].id
      var sensorSerialNum = jsSensorList[index].serialNumber
      var sensorType = jsSensorList[index].sensorType.type
      that.getRealValueBySensorId(sensorId, sensorSerialNum);
    }

  },

  getRealValueBySensorId: function (sensorId, sensorSerialNum) {
    var that = this;
    console.log("getRealValueBySensorId");
    wx.request({
      url: app.globalData.QUERY_RealTimeValue_URL,
      data: { sensorId: sensorId },
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res.data)
        map[sensorId] = {};
        map[sensorId].value1 = res.data.value1;
        if (res.data.value2 != 0) { //说明是双值传感器     
          map[sensorId].value1 = res.data.value1;
          map[sensorId].value2 = res.data.value2;
        }
        console.log(map)
        that.setData({
          sensorRealValueMap: map
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  //跳转到查看传感器历史数据页面事件
  showHistoryData: function (event) {
    // var sensorid = event.currentTarget.dataset.sensorid

    //  console.log(sensorid)
    //  console.log(event.currentTarget.dataset.sensortype)
    wx.navigateTo({
      url: '/packageManager/pages/sensorhistorydata/sensorhistorydata?sensorId=' + event.currentTarget.dataset.sensorid + '&sensorType=' + event.currentTarget.dataset.sensortype,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.showTreatDriverTabBar();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //松开按钮停止控制监控
  stopPtz: function (e) {
    var direction = e.currentTarget.dataset.direction
    var deviceSerial = e.currentTarget.dataset.deviceserial

    var paramsString = 'direction=' + direction + '&deviceSerial=' + deviceSerial + '&accessToken=' + app.globalData.ACCESS_TOKEN + '&channelNo=' + app.globalData.CHANNEL_NO
    wx.request({
      url: app.globalData.STOP_PTZ_URL + '?' + paramsString,
      data: {},
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
      },

      fail: function (err) {
        console.log(err)
      }
    })
  },
  //点击按钮开始控制监控
  startPtz: function (e) {
    var direction = e.currentTarget.dataset.direction
    var deviceSerial = e.currentTarget.dataset.deviceserial
    var speed = e.currentTarget.dataset.speed

    this.stopPtz(e)

    var paramsString = 'direction=' + direction + '&speed=' + speed + '&deviceSerial=' + deviceSerial + '&accessToken=' + app.globalData.ACCESS_TOKEN + '&channelNo=' + app.globalData.CHANNEL_NO
    console.log(paramsString)
    wx.request({
      url: app.globalData.START_PTZ_URL + '?' + paramsString,
      data: {},
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
      },

      fail: function (err) {
        console.log(err)
      }
    })

  },



})

