// window-utils.js
const getAppWindow = () => {
  try {
    // 优先使用标准的小程序窗口获取方法
    if (typeof wx !== 'undefined' && wx.getWindowInfo) {
      return wx.getWindowInfo();
    }
    
    // 兼容处理，返回基本的窗口信息
    return {
      pixelRatio: wx.getSystemInfoSync().pixelRatio,
      screenWidth: wx.getSystemInfoSync().screenWidth,
      screenHeight: wx.getSystemInfoSync().screenHeight,
      windowWidth: wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight,
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    };
  } catch (error) {
    console.error('获取窗口信息失败:', error);
    return null;
  }
};

module.exports = {
  getAppWindow
};