// pages/list/list.js
const weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五','星期六']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayWeather:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDayWeather();
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

  /**
   * 程序获取数据函数
   */
  getDayWeather(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: '武汉市',
        time: new Date().getTime(),
      },
      success: res=>{
        let result=res.data.result;
        console.log(result);
        this.setDayWeather(result);
      },
      complete: () => {
        callback && callback();
      }
    })
  },

  setDayWeather(result){
    let nowDay = new Date();
    let nowDayWeather=result.map((item,index)=>{
      let nowDate = new Date();
      nowDate.setDate(nowDay.getDate()+index);
      return {
        day: index === 0 ? `今 天` :weekDay[nowDate.getDay()%7],
        date: `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()}`,
        temp:`${item.minTemp}°~${item.maxTemp}°`,
        weather:`/pages/images/${item.weather}-icon.png`
      }
    });
    this.setData({
      dayWeather:nowDayWeather,
    });
  },

  onPullDownRefresh:function(){
    this.getDayWeather(()=>{
      wx.stopPullDownRefresh();
    });
  }
})