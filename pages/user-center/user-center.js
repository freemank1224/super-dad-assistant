// pages/user-center/user-center.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 尝试获取用户信息
    this.getUserProfile();
  },

  /**
   * 获取用户信息
   */
  getUserProfile: function() {
    // 由于微信政策变更，现在需要通过按钮触发获取用户信息
    // 这里仅作为示例，实际使用时需要通过按钮触发
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        
        // 存储用户信息
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: (err) => {
        console.log('获取用户信息失败', err);
      }
    });
  },

  /**
   * 跳转到对话历史页面
   */
  goToHistory: function() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  /**
   * 跳转到收藏问题页面
   */
  goToFavorites: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 跳转到设置页面
   */
  goToSettings: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 跳转到意见反馈页面
   */
  goToFeedback: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  /**
   * 跳转到关于我们页面
   */
  goToAbout: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});