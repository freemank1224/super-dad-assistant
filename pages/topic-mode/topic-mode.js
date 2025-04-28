// pages/topic-mode/topic-mode.js
Page({
  data: {
    topicText: '',
    isRecording: false,
    showQuestions: false,
    questions: [],
    suggestions: ['友谊', '勇气', '环保', '动物保护', '家庭', '诚实', '想象力', '科学探索', '传统文化', '情绪管理']
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
  
  // 文本输入更新
  textInput: function(e) {
    this.setData({
      topicText: e.detail.value
    });
  },
  
  // 选择推荐主题
  selectSuggestion: function(e) {
    const topic = e.currentTarget.dataset.topic;
    this.setData({
      topicText: topic
    });
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
        const voiceText = '环保与可持续发展';
        
        this.setData({
          topicText: voiceText
        });
      }, 1000);
    });
  },
  
  // 生成问题
  generateQuestions: function() {
    const { topicText } = this.data;
    
    if (!topicText) {
      wx.showToast({
        title: '请先输入或选择主题',
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
      
      // 根据不同主题生成不同的问题
      let questions = [];
      
      if (topicText.includes('环保') || topicText.includes('可持续')) {
        questions = [
          {
            content: '你认为保护环境为什么很重要？',
            favorite: false
          },
          {
            content: '我们日常生活中可以做哪些事情来减少污染？',
            favorite: false
          },
          {
            content: '如果你看到有人乱扔垃圾，你会怎么做？',
            favorite: false
          },
          {
            content: '你觉得未来的地球会变成什么样子？我们应该如何保护它？',
            favorite: false
          },
          {
            content: '动物和植物为什么会受到环境污染的影响？',
            favorite: false
          }
        ];
      } else if (topicText.includes('友谊')) {
        questions = [
          {
            content: '你认为什么是真正的友谊？',
            favorite: false
          },
          {
            content: '如果你的朋友遇到困难，你会怎么帮助他/她？',
            favorite: false
          },
          {
            content: '你和好朋友之间发生过矛盾吗？你们是怎么解决的？',
            favorite: false
          },
          {
            content: '你觉得朋友之间最重要的是什么？',
            favorite: false
          },
          {
            content: '如果你的朋友做了一件你认为不对的事情，你会怎么办？',
            favorite: false
          }
        ];
      } else {
        // 默认通用问题
        questions = [
          {
            content: `关于${topicText}，你最感兴趣的是什么？`,
            favorite: false
          },
          {
            content: `你认为${topicText}对我们的生活有什么影响？`,
            favorite: false
          },
          {
            content: `如果你可以向专家提一个关于${topicText}的问题，你会问什么？`,
            favorite: false
          },
          {
            content: `你觉得${topicText}在未来会有什么变化？`,
            favorite: false
          },
          {
            content: `关于${topicText}，你有什么想和别人分享的经历或想法吗？`,
            favorite: false
          }
        ];
      }
      
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
        type: 'topic',
        title: `主题：${topicText}`,
        date: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`,
        time: `${now.getHours()}:${now.getMinutes()}`,
        content: '',
        topic: topicText,
        questions: questions,
        summary: `关于${topicText}的问题集`
      };
      
      // 获取历史记录
      let history = wx.getStorageSync('history') || [];
      // 添加新记录
      history.unshift(record);
      // 最多保存50条记录
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      // 保存更新后的历史记录
      wx.setStorageSync('history', history);
    }, 1500);
  },
  
  // 收藏问题
  toggleFavorite: function(e) {
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
  
  // 返回首页
  goBack: function() {
    wx.navigateBack();
  },
  
  // 复制问题到剪贴板
  copyQuestion: function(e) {
    const index = e.currentTarget.dataset.index;
    const question = this.data.questions[index].content;
    
    wx.setClipboardData({
      data: question,
      success: function() {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },
  
  // 返回编辑主题
  backToTopicInput: function() {
    this.setData({
      showQuestions: false
    });
  },
  
  // 开始语音互动
  startVoiceInteraction: function() {
    // 保存当前问题到全局数据
    const app = getApp();
    app.globalData.currentTopic = this.data.topicText;
    
    // 跳转到语音互动页面
    wx.navigateTo({
      url: '/pages/voice-interaction/voice-interaction'
    });
  }
})