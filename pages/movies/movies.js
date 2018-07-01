var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {}, // 正在热映
    comingSoon: {}, // 即将上映
    top250: {}, // Top250
    searchResult: {}, // 电影搜索页面
    containerShow: true, // 电影页面显示
    searchPanelShow: false // 搜索页面隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3"; // 正在热映
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3"; // 即将上映
    var top250 = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3"; // top50
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250, "top250", "Top250");
  },
  getMovieListData(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/xml' // 默认值
      },
      success: (res) => {
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail() {
        console.log('接口调用失败');
      }
    })
  },
  // 返回的数据进行处理
  processDoubanData(moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedKey] = {
      movies,
      categoryTitle
    };
    this.setData(readyData);
  },
  // 电影详情页
  onMoreTap(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },
  // 电影搜索的方法
  onBindFocus(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  // 关闭电影搜索页面
  onCancelImgTap() {
    this.setData({
      containerShow: true,
      searchPanelShow: false
    })
  },
  //获取搜索框输入的值
  onBindChange(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },
  // 电影详情页
  onMovieTap(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  }
})