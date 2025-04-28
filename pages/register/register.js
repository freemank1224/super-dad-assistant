// pages/register/register.js
Page({
  data: {
    nickname: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    agreed: false
  },

  // 输入昵称
  inputNickname: function(e) {
    this.setData({
      nickname: e.detail.value
    });
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
  
  // 输入确认密码
  inputConfirmPassword: function(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },
  
  // 输入邮箱
  inputEmail: function(e) {
    this.setData({
      email: e.detail.value
    });
  },
  
  // 切换协议同意状态
  toggleAgreement: function() {
    this.setData({
      agreed: !this.data.agreed
    });
  },
  
  // 注册
  register: function() {
    const { nickname, username, password, confirmPassword, email, agreed } = this.data;
    
    // 表单验证
    if (!nickname || !username || !password || !confirmPassword) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }
    
    if (!agreed) {
      wx.showToast({
        title: '请同意用户协议和隐私政策',
        icon: 'none'
      });
      return;
    }
    
    // 邮箱格式验证（如果填写了邮箱）
    if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      });
      return;
    }
    
    // 这里应该调用后端注册接口
    // 为了演示，这里模拟注册成功
    wx.showLoading({
      title: '注册中...'
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          // 跳转到登录页
          wx.navigateTo({
            url: '/pages/login/login'
          });
        }
      });
    }, 1500);
  }
})