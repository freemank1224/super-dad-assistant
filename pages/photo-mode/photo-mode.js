// pages/photo-mode/photo-mode.js
Page({
  data: {
    tempImagePath: '',
    recognizedText: '',
    voiceText: '',
    isRecording: false,
    showTextResult: false,
    showQuestions: false,
    questions: []
  },

  onLoad: function() {
    // 检查是否已登录
    const app = getApp();
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
  },
  
  // 相机错误处理
  cameraError: function(e) {
    console.error('相机错误：', e.detail);
    wx.showToast({
      title: '相机启动失败，请检查权限设置',
      icon: 'none'
    });
  },
  
  // 拍照
  takePhoto: function() {
    const camera = wx.createCameraContext();
    camera.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          tempImagePath: res.tempImagePath
        });
      },
      fail: (err) => {
        console.error('拍照失败：', err);
        wx.showToast({
          title: '拍照失败，请重试',
          icon: 'none'
        });
      }
    });
  },
  
  // 从相册选择
  chooseFromAlbum: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        this.setData({
          tempImagePath: res.tempFilePaths[0]
        });
      }
    });
  },
  
  // 取消照片
  cancelPhoto: function() {
    this.setData({
      tempImagePath: ''
    });
  },
  
  // 确认照片并进行文字识别
  confirmPhoto: function() {
    wx.showLoading({
      title: '识别中...'
    });
    
    // 这里应该调用后端OCR接口进行文字识别
    // 为了演示，这里模拟识别结果
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟识别结果
      const sampleText = '从前有一只小兔子，它住在森林里的一个小洞穴里。每天早上，小兔子都会出门寻找胡萝卜和新鲜的草。有一天，小兔子遇到了一只迷路的小狐狸。小狐狸看起来又饿又累。小兔子决定帮助小狐狸，它带小狐狸回家，给它吃的，还让它在自己的洞穴里休息。从那以后，小兔子和小狐狸成了好朋友，它们一起在森林里玩耍，一起寻找食物，一起度过了许多快乐的时光。';
      
      this.setData({
        recognizedText: sampleText,
        showTextResult: true
      });
      
      // 保存到全局数据
      const app = getApp();
      app.globalData.recognizedText = sampleText;
    }, 2000);
  },
  
  // 文本输入更新
  textInput: function(e) {
    this.setData({
      recognizedText: e.detail.value
    });
    
    // 更新全局数据
    const app = getApp();
    app.globalData.recognizedText = e.detail.value;
  },
  
  // 开始语音输入
  startVoiceInput: function() {
    this.setData({
      isRecording: true
    });
    
    // 调用微信录音接口
    const recorderManager = wx.getRecorderManager();
    recorderManager.onStart(() => {
      console.log('录音开始');
    });
    
    recorderManager.start({
      duration: 60000, // 最长录音时间，单位ms
      sampleRate: 16000, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 64000, // 编码码率
      format: 'aac' // 音频格式
    });
  },
  
  // 结束语音输入
  endVoiceInput: function() {
    this.setData({
      isRecording: false
    });
    
    const recorderManager = wx.getRecorderManager();
    recorderManager.stop();
    
    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      const { tempFilePath } = res;
      
      wx.showLoading({
        title: '识别中...'
      });
      
      // 这里应该调用后端语音识别接口
      // 为了演示，这里模拟识别结果
      setTimeout(() => {
        wx.hideLoading();
        
        // 模拟语音识别结果
        const voiceText = '关于友谊和帮助他人';
        
        this.setData({
          voiceText: voiceText
        });
      }, 1000);
    });
  },
  
  // 返回相机界面
  backToCamera: function() {
    this.setData({
      showTextResult: false,
      tempImagePath: '',
      recognizedText: '',
      voiceText: ''
    });
  },
  
  // 生成问题
  generateQuestions: function() {
    const { recognizedText, voiceText } = this.data;
    
    if (!recognizedText) {
      wx.showToast({
        title: '请先识别或输入文字',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '生成问题中...'
    });
    
    // 这里应该调用后端AI接口生成问题
    // 为了演示，这里模拟生成结果
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟生成的问题
      const questions = [
        {
          content: '你觉得小兔子为什么要帮助小狐狸？',
          favorite: false
        },
        {
          content: '如果你是小兔子，你会怎么帮助迷路的小狐狸？',
          favorite: false
        },
        {
          content: '小兔子和小狐狸成为朋友后，它们可能会一起做什么有趣的事情？',
          favorite: false
        },
        {
          content: '你认为故事中的小兔子是什么性格的？为什么？',
          favorite: false
        },
        {
          content: '你有没有像小兔子一样帮助过别人？是什么情况？',
          favorite: false
        }
      ];
      
      this.setData({
        questions: questions,
        showQuestions: true
      });
      
      // 保存到全局数据
      const app = getApp();
      app.globalData.questionList = questions;
      
      // 保存到历史记录
      const now = new Date();
      const record = {
        type: 'photo',
        title: '绘本拍照提问',
        date: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`,
        time: `${now.getHours()}:${now.getMinutes()}`,
        content: recognizedText,
        topic: voiceText || '无主题',
        questions: questions,
        summary: recognizedText.substring(0, 30) + '...'
      };
      app.saveHistory(record);
    }, 2000);
  },
  
  // 返回文字结果界面
  backToTextResult: function() {
    this.setData({
      showQuestions: false
    });
  },
  
  // 收藏问题
  favoriteQuestion: function(e) {
    const index = e.currentTarget.dataset.index;
    const questions = this.data.questions;
    questions[index].favorite = !questions[index].favorite;
    
    this.setData({
      questions: questions
    });
    
    // 更新全局数据
    const app = getApp();
    app.globalData.questionList = questions;
  },
  
  // 复制问题
  copyQuestion: function(e) {
    const index = e.currentTarget.dataset.index;
    const content = this.data.questions[index].content;
    
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },
  
  // 开始语音互动
  startVoiceInteraction: function() {
    // 将当前问题列表保存到全局数据
    const app = getApp();
    app.globalData.questionList = this.data.questions;
    
    // 跳转到语音互动页面
    wx.navigateTo({
      url: '/pages/voice-interaction/voice-interaction'
    });
  }
})