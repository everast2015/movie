var postsData = require("../../../data/posts-data.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   * 如果在 onLoad方法中，不是异步的去获取数据，
   * 则不需要使用this.setData进行数据的绑定
   * 只需要使用this.data进行数据绑定即可
   */
  onLoad: function(option) {
    var postId = option.id;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData,
      currentPostId: postId
    });
  },
  // 点击分享事件
  onShareTap(event) {
    var itemList = [
      '分享给微信好友',
      '分享给朋友圈',
      '分享到QQ',
      '分享到微博'
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消?' + res.cancel + '现在无法实现分享的功能',
        })
      }
    })
  }
})