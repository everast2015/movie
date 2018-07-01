var app = getApp();
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case "Top250":
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData); //http 封装的一个请求的方法
  },
  // 回调的方法
  processDoubanData(moviesDouban) {
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
    var totalMovies = {};
    // 如果要绑定新加载的数据，需要和旧数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies); // concat 在原有数组中，追加新的数组
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20; // 每次累加20
    wx.hideNavigationBarLoading(); // 关闭加载更多提示框
    wx.stopPullDownRefresh(); // 关闭下拉刷新
  },
  onReady() {
    // 动态设置当前的导航条
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  // 加载更多
  onScrollLower(event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData); //http 封装的一个请求的方法
    wx.showNavigationBarLoading(); // 设置加载更多的提示框
  },
  // 下拉刷新
  onPullDownRefresh() {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {}; // 设置初始值
    this.data.isEmpty = true; // 设置初始值
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData); //http 封装的一个请求的方法
    wx.showNavigationBarLoading(); // 设置加载更多的提示框
  },
  // 电影详情页
  onMovieTap(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  }

})