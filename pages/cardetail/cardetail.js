// pages/cardetail/cardetail.js
// pages/carMonitor/carMonitor.js
const app = getApp()
var map={};
var jsSensorList=[];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carId: 68,

    "realValueList": [],
    "sensorList": [],
    "sensorAndrealValue": [],
    "sensorAndrealValueList": [],
    "sensorRealValueMap":{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /* this.setData({
       carId: options.carId//获取从上一个页面的carid
     })*/

    console.log('onLoad')
    var that = this
    /**
     * 获取传感器和监控
     */
    wx.request({
      url: "http://iot.hnu.edu.cn/monitor/queryVideoAndSensorByCarIdfoForWX",
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
        setInterval(function () {
          that.getRealValue();
        }, 10000);
        //that.getRealValue();
      },
      fail: function (err) {
        console.log(err)
      }
    })
    //console.log(that.data.realValueList)
    //console.log(that.data.value1)
  },

  /*根据sensorID获取传感器实时数据*/
  getRealValue: function () {
    var that=this;
    console.log("getRealValueBySensorId")
    /*根据sensorID获取传感器实时数据*/
    for (var index = 0; index < jsSensorList.length; index++) {
      var sensorId = jsSensorList[index].id
      var sensorSerialNum = jsSensorList[index].serialNumber;
      that.getRealValueBySensorId(sensorId, sensorSerialNum);
    }

  },

  getRealValueBySensorId: function (sensorId, sensorSerialNum){
    var that=this;
    console.log("getRealValueBySensorId");
    wx.request({
      url: "http://iot.hnu.edu.cn/sensor/queryRealTimeValue",
      data: { sensorId: sensorId },
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res.data)
        map[sensorId] = {};
        map[sensorId].value1 = res.data.value1;
        if(res.data.value2!=0){ //说明是双值传感器     
          map[sensorId].value1=res.data.value1;
          map[sensorId].value2=res.data.value2;
        }
        console.log(map)
        that.setData({
          sensorRealValueMap:map
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
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

