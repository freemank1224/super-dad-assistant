const HISTORY_KEY = 'history_records';
const USER_INFO_KEY = 'user_info';

const storage = {
  // 保存历史记录
  saveHistory: function(records) {
    try {
      wx.setStorageSync(HISTORY_KEY, records);
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  },

  // 获取历史记录
  getHistory: function() {
    try {
      return wx.getStorageSync(HISTORY_KEY) || [];
    } catch (e) {
      console.error('获取历史记录失败:', e);
      return [];
    }
  },

  // 保存用户信息
  saveUserInfo: function(userInfo) {
    try {
      wx.setStorageSync(USER_INFO_KEY, userInfo);
    } catch (e) {
      console.error('保存用户信息失败:', e);
    }
  },

  // 获取用户信息
  getUserInfo: function() {
    try {
      return wx.getStorageSync(USER_INFO_KEY) || null;
    } catch (e) {
      console.error('获取用户信息失败:', e);
      return null;
    }
  },

  // 清除所有数据
  clearAll: function() {
    try {
      wx.clearStorageSync();
    } catch (e) {
      console.error('清除数据失败:', e);
    }
  }
};

module.exports = storage; 