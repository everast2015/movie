// pages/posts/post.js
var postsData = require("../../data/posts-data.js");
Page({
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.setData({
      'postList': postsData.postList
    })
  },
  /*
   * 列表进入-详情页
   */
  onPostItem(event) {
    // 获取自定义事件的值
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },
  onSwiperTap(event) {
    // target 和currentTarget
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})