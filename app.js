// app.js
App({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    // 用于存储临时识别的文本内容
    recognizedText: '',
    // 用于存储生成的问题列表
    questionList: [],
    // 用于存储历史记录
    historyRecords: []
  },
  onLaunch: function() {
    // 检查用户登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLoggedIn = true;
    }
    
    // 获取历史记录
    const historyRecords = wx.getStorageSync('historyRecords');
    if (historyRecords) {
      this.globalData.historyRecords = historyRecords;
    }
  },
  
  // 用户登录方法
  login: function(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.isLoggedIn = true;
    wx.setStorageSync('userInfo', userInfo);
  },
  
  // 用户登出方法
  logout: function() {
    this.globalData.userInfo = null;
    this.globalData.isLoggedIn = false;
    wx.removeStorageSync('userInfo');
  },
  
  // 保存历史记录
  saveHistory: function(record) {
    const historyRecords = this.globalData.historyRecords;
    // 添加时间戳
    record.timestamp = new Date().getTime();
    // 添加到历史记录开头
    historyRecords.unshift(record);
    // 最多保存50条记录
    if (historyRecords.length > 50) {
      historyRecords.pop();
    }
    this.globalData.historyRecords = historyRecords;
    wx.setStorageSync('historyRecords', historyRecords);
  }
})