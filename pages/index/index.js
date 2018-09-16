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

Page({
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '武汉市',
      },
      success: res => {
        console.log(res.data);
        let result = res.data.result;
        let temp = result.now.temp;
        let weather = result.now.weather;
        this.setData({
          nowTemp: temp + '°',
          nowWeather: weatherCHN[weather],
          weatherBg: '/pages/images/' + weather + '-bg.png'
        });
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: weatherColor[weather]
        })
        console.log(temp, weather);
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
  data:{
    nowTemp:'',
    nowWeather:'',
    weaterBg:'',
    forecast: [1,2,3,4,5,6,7,8,9]
  },
  onLoad(){
    this.getNow();
  }
});