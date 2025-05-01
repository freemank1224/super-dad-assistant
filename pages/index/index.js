// pages/index/index.js
const storage = require('../../utils/storage');

Page({
  data: {
    userInfo: {},
    isLoggedIn: false,
    recentHistory: [],
    pageSize: 3,
    currentPage: 1,
    hasMore: false
  },

  onLoad: function() {
    // 获取用户信息
    const userInfo = storage.getUserInfo();
    this.setData({
      isLoggedIn: !!userInfo,
      userInfo: userInfo || {}
    });
    
    // 如果未登录，跳转到登录页
    if (!this.data.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 加载历史记录
    this.loadHistoryWithPagination();
  },
  
  onShow: function() {
    // 每次页面显示时刷新用户数据
    const userInfo = storage.getUserInfo();
    this.setData({
      isLoggedIn: !!userInfo,
      userInfo: userInfo || {}
    });
    
    // 刷新历史记录
    this.loadHistoryWithPagination(true);
  },
  
  // 分页加载历史记录
  loadHistoryWithPagination: function(reset = false) {
    if (reset) {
      this.setData({
        currentPage: 1,
        recentHistory: []
      });
    }
    
    const historyRecords = storage.getHistory();
    const start = (this.data.currentPage - 1) * this.data.pageSize;
    const end = start + this.data.pageSize;
    const newRecords = historyRecords.slice(start, end);
    
    this.setData({
      recentHistory: [...this.data.recentHistory, ...newRecords],
      hasMore: end < historyRecords.length
    });
  },
  
  // 加载更多历史记录
  loadMore: function() {
    if (this.data.hasMore) {
      this.setData({
        currentPage: this.data.currentPage + 1
      }, () => {
        this.loadHistoryWithPagination();
      });
    }
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
    
    wx.navigateTo({
      url: '/pages/history/history-detail/history-detail',
      success: function(res) {
        // 将数据传递给详情页
        res.eventChannel.emit('acceptHistoryRecord', record);
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadHistoryWithPagination(true);
    wx.stopPullDownRefresh();
  },

  // 触底加载更多
  onReachBottom: function() {
    this.loadMore();
  }
});