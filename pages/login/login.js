// pages/login/login.js
Page({
  data: {
    username: '',
    password: ''
  },

  onLoad: function() {
    // 检查是否已登录
    const app = getApp();
    if (app.globalData.isLoggedIn) {
      // 已登录则跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },
  
  // 输入用户名
  inputUsername: function(e) {
    this.setData({
      username: e.detail.value
    });
  },
  
  // 输入密码
  inputPassword: function(e) {
    this.setData({
      password: e.detail.value
    });
  },
  
  // 账号密码登录
  login: function() {
    const { username, password } = this.data;
    
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }
    
    // 这里应该调用后端登录接口
    // 为了演示，这里模拟登录成功
    wx.showLoading({
      title: '登录中...'
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟登录成功
      const userInfo = {
        nickName: username,
        avatarUrl: '../../images/default-avatar.png'
      };
      
      // 保存用户信息到全局数据
      const app = getApp();
      app.login(userInfo);
      
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          // 跳转到首页
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    }, 1500);
  },
  
  // 微信一键登录
  wechatLogin: function(e) {
    if (e.detail.userInfo) {
      // 用户同意授权
      const userInfo = e.detail.userInfo;
      
      wx.showLoading({
        title: '登录中...'
      });
      
      setTimeout(() => {
        wx.hideLoading();
        
        // 保存用户信息到全局数据
        const app = getApp();
        app.login(userInfo);
        
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            // 跳转到首页
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        });
      }, 1000);
    } else {
      // 用户拒绝授权
      wx.showToast({
        title: '您拒绝了授权',
        icon: 'none'
      });
    }
  },
  
  // 体验模式（无需登录）
  guestLogin: function() {
    // 创建游客身份
    const guestInfo = {
      nickName: '体验用户',
      avatarUrl: '../../images/default-avatar.png',
      isGuest: true
    };
    
    // 保存用户信息到全局数据
    const app = getApp();
    app.login(guestInfo);
    
    wx.showToast({
      title: '已进入体验模式',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    });
  }
})