// pages/allcardetail/allcardetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询车辆信息
      var that = this;
      var carList;
      wx.request({
        url: app.globalData.QUERY_MapCar_BySiteIdAndCarTypeAndStatus_URL,
        data: { siteId:-1 , carType:- 1 , status:- 1 },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            carList: res.data
          })
          return
        }
      })
  },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showdetailoftreatmentcar: function (event) {
    var id = event.currentTarget.dataset.carid
    console.log(id)
    wx.navigateTo({
      url: '../cardetail/cardetail?carId=' + event.currentTarget.dataset.carid+'&siteId=' + event.currentTarget.dataset.siteid,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.showManageTabBar();
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

  }
})