Page({
  data: {
    record: null
  },

  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptHistoryRecord事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptHistoryRecord', (data) => {
      this.setData({
        record: data
      });
    });
  },

  // 返回上一页
  onBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 分享记录
  onShareAppMessage: function() {
    return {
      title: '查看我的互动记录',
      path: '/pages/index/index'
    };
  }
}); 