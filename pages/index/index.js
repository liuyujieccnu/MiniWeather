const weatherCHN ={
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColor={
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    weaterBg: '',
    forecast: [],
    todayTemp: "",
    todayData: "",
    locality: "武汉市",
    locationAuth: UNPROMPTED,
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.locality,
      },
      success: res => {
        console.log(res.data);
        let result = res.data.result;
        this.setNow(result);
        this.setForecast(result);
        this.setToday(result);
      },
      complete:()=>{
        callback && callback();
      }
    })
  },
  onPullDownRefresh: function(){
    this.getNow(()=>{
      wx.stopPullDownRefresh();
    });
  },
  onLoad(){
    console.log('onLoad');
    this.qqmapsdk = new QQMapWX({
      key:'T6EBZ-XNX3I-5EDGI-5YIOZ-QXKKO-NBFN7'
    });
    wx.getSetting({
      success:res=>{
        let auth=res.authSetting['scope.userLocation'];
        this.setData({
          locationAuthType: auth ? AUTHORIZED
            : (auth === false) ? UNAUTHORIZED : UNPROMPTED
        });
        if (auth)
          this.getCityAndWeather();
        else
          this.getNow(); //使用默认城市广州
      },
      fail:()=>{
        this.getNow();
      }
    });
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload');
  },
  onShow(){
    console.log('onShow');
  },
  setNow(result){
    let temp = result.now.temp;
    let weather = result.now.weather;
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherCHN[weather],
      weatherBg: '/pages/images/' + weather + '-bg.png',
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: weatherColor[weather]
    });
  },
  setForecast(result){
    let nowTime = new Date().getHours();
    let forecastData = result.forecast.map(item => {
      return {
        time: item.id === 0 ? '现在' : (item.id * 3 + nowTime) % 24 + '时',
        iconPath: '/pages/images/' + item.weather + '-icon.png',
        temp: item.temp + '°'
      };
    });
    this.setData({
      forecastWeather: forecastData
    });
  },
  setToday(result){
    let date = new Date();
    this.setData({
      todayDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`,
      todayTemp:`${result.today.minTemp}°~${result.today.maxTemp}°`,
    });
  },
  onTapDayWeather(){
    wx.navigateTo({
      url: `/pages/list/list?locality=${this.data.locality}`,
    })
  },
  onTapLocation(){
      this.getCityAndWeather();
  },
  getCityAndWeather(){
    wx.getLocation({
      success: res => {
        //console.log(res);
        this.setData({
          locationAuthType: AUTHORIZED,
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            console.log(res);
            let nowCity = res.result.address_component.locality;
            console.log(nowCity);
            this.setData({
              locality: nowCity,
              locationAuth: AUTHORIZED
            });
            this.getNow();
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
      fail: res => {
        //console.log(res);
        //console.log(this.data.locationAuth);
        if (res.errMsg === "getLocation:fail auth deny") {
          this.setData({
            locationAuth: UNAUTHORIZED
          });
          //console.log(this.data.locationAuth);
        }
      }
    });
  }
});