// pages/index/index.js
Page({
  data: {
    userInfo: {},
    isLoggedIn: false,
    recentHistory: []
  },

  onLoad: function() {
    // 获取全局数据
    const app = getApp();
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn,
      userInfo: app.globalData.userInfo || {}
    });
    
    // 如果未登录，跳转到登录页
    if (!this.data.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 获取最近历史记录（最多显示3条）
    this.loadRecentHistory();
  },
  
  onShow: function() {
    // 每次页面显示时刷新数据
    const app = getApp();
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn,
      userInfo: app.globalData.userInfo || {}
    });
    
    // 刷新历史记录
    this.loadRecentHistory();
  },
  
  // 加载最近历史记录
  loadRecentHistory: function() {
    const app = getApp();
    const historyRecords = app.globalData.historyRecords || [];
    // 只取最近3条记录
    const recentHistory = historyRecords.slice(0, 3);
    this.setData({
      recentHistory: recentHistory
    });
  },
  
  // 跳转到拍照模式
  navigateToPhotoMode: function() {
    wx.navigateTo({
      url: '/pages/photo-mode/photo-mode'
    });
  },
  
  // 跳转到自选主题模式
  navigateToTopicMode: function() {
    wx.navigateTo({
      url: '/pages/topic-mode/topic-mode'
    });
  },
  
  // 跳转到历史记录详情
  navigateToHistoryDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.recentHistory[index];
    // 将选中的记录存入全局数据
    const app = getApp();
    app.globalData.currentRecord = record;
    
    wx.navigateTo({
      url: '/pages/history/history-detail/history-detail'
    });
  }
})