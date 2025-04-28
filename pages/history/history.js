// pages/history/history.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadHistoryData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 每次页面显示时重新加载历史数据，确保数据最新
    this.loadHistoryData();
  },

  /**
   * 加载历史数据
   */
  loadHistoryData: function () {
    wx.getStorage({
      key: 'interactionHistory',
      success: (res) => {
        if (res.data && res.data.length > 0) {
          // 格式化时间
          const formattedList = res.data.map(item => {
            return {
              ...item,
              formattedTime: this.formatTimestamp(item.timestamp)
            };
          });
          
          this.setData({
            historyList: formattedList
          });
        } else {
          this.setData({
            historyList: []
          });
        }
      },
      fail: () => {
        this.setData({
          historyList: []
        });
      }
    });
  },

  /**
   * 格式化时间戳为可读时间
   */
  formatTimestamp: function (timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  /**
   * 删除单条历史记录
   */
  deleteHistory: function (e) {
    const index = e.currentTarget.dataset.index;
    const historyList = this.data.historyList;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          historyList.splice(index, 1);
          
          this.setData({
            historyList: historyList
          });
          
          // 更新本地存储
          wx.setStorage({
            key: 'interactionHistory',
            data: historyList,
            success: () => {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  /**
   * 清空全部历史
   */
  clearAllHistory: function () {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空全部对话历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: []
          });
          
          // 清空本地存储
          wx.removeStorage({
            key: 'interactionHistory',
            success: () => {
              wx.showToast({
                title: '已清空全部历史',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  /**
   * 复制对话内容
   */
  copyHistory: function (e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.historyList[index];
    
    // 格式化要复制的内容
    const copyContent = `问题：${item.question}\n回答：${item.answer}\n引导：${item.response}`;
    
    wx.setClipboardData({
      data: copyContent,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 分享对话记录
   */
  shareHistory: function (e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.historyList[index];
    
    // 在微信小程序中，可以使用自定义分享或转发功能
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  /**
   * 跳转到首页
   */
  goToIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});