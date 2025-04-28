// pages/voice-interaction/voice-interaction.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    questions: [], // 问题列表
    questionIndex: 0, // 当前问题索引
    currentQuestion: {}, // 当前问题
    childAnswer: '', // 孩子的回答
    aiResponse: '', // AI引导回复
    isRecording: false, // 是否正在录音
    isPlaying: false, // 是否正在播放
    recorderManager: null, // 录音管理器
    innerAudioContext: null, // 音频播放器
    tempFilePath: '', // 临时录音文件路径
    recordTimer: null, // 录音计时器
    recordDuration: 0, // 录音时长
    maxRecordDuration: 60, // 最大录音时长（秒）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面参数中的问题列表
    if (options.questions) {
      try {
        const questions = JSON.parse(options.questions);
        this.setData({
          questions: questions,
          currentQuestion: questions[0]
        });
      } catch (e) {
        wx.showToast({
          title: '加载问题失败',
          icon: 'none'
        });
      }
    }
    
    // 初始化录音管理器
    this.initRecorder();
    
    // 初始化音频播放器
    this.initAudioPlayer();
  },

  /**
   * 初始化录音管理器
   */
  initRecorder: function () {
    const recorderManager = wx.getRecorderManager();
    
    // 监听录音开始事件
    recorderManager.onStart(() => {
      console.log('录音开始');
      this.setData({
        isRecording: true,
        recordDuration: 0
      });
      
      // 开始计时
      this.startRecordTimer();
    });
    
    // 监听录音结束事件
    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this.setData({
        isRecording: false,
        tempFilePath: res.tempFilePath
      });
      
      // 停止计时
      this.stopRecordTimer();
      
      // 将录音转为文字
      this.recognizeSpeech(res.tempFilePath);
    });
    
    // 监听录音错误事件
    recorderManager.onError((res) => {
      console.error('录音错误', res);
      wx.showToast({
        title: '录音出错，请重试',
        icon: 'none'
      });
      this.setData({
        isRecording: false
      });
      
      // 停止计时
      this.stopRecordTimer();
    });
    
    this.setData({
      recorderManager: recorderManager
    });
  },

  /**
   * 初始化音频播放器
   */
  initAudioPlayer: function () {
    const innerAudioContext = wx.createInnerAudioContext();
    
    // 监听播放结束事件
    innerAudioContext.onEnded(() => {
      console.log('音频播放结束');
      this.setData({
        isPlaying: false
      });
    });
    
    // 监听播放错误事件
    innerAudioContext.onError((res) => {
      console.error('音频播放错误', res);
      wx.showToast({
        title: '播放出错，请重试',
        icon: 'none'
      });
      this.setData({
        isPlaying: false
      });
    });
    
    this.setData({
      innerAudioContext: innerAudioContext
    });
  },

  /**
   * 开始录音计时器
   */
  startRecordTimer: function () {
    this.setData({
      recordTimer: setInterval(() => {
        let duration = this.data.recordDuration + 1;
        this.setData({
          recordDuration: duration
        });
        
        // 如果超过最大录音时长，自动停止录音
        if (duration >= this.data.maxRecordDuration) {
          this.stopRecording();
        }
      }, 1000)
    });
  },

  /**
   * 停止录音计时器
   */
  stopRecordTimer: function () {
    if (this.data.recordTimer) {
      clearInterval(this.data.recordTimer);
      this.setData({
        recordTimer: null
      });
    }
  },

  /**
   * 开始录音
   */
  startRecording: function () {
    const options = {
      duration: this.data.maxRecordDuration * 1000, // 最大录音时长，单位ms
      sampleRate: 16000, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 48000, // 编码码率
      format: 'mp3', // 音频格式
      frameSize: 50 // 指定帧大小
    };
    
    this.data.recorderManager.start(options);
  },

  /**
   * 停止录音
   */
  stopRecording: function () {
    if (this.data.isRecording) {
      this.data.recorderManager.stop();
    }
  },

  /**
   * 语音识别
   */
  recognizeSpeech: function (filePath) {
    wx.showLoading({
      title: '正在识别...',
    });
    
    // 调用微信的语音识别接口
    // 注意：实际开发中需要替换为真实的语音识别API调用
    // 这里使用模拟数据
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟识别结果
      const recognizedText = '这是模拟的语音识别结果，实际开发中需要调用真实的语音识别API。';
      
      this.setData({
        childAnswer: recognizedText
      });
      
      // 获取AI引导回复
      this.getAIResponse(recognizedText);
    }, 1500);
  },

  /**
   * 获取AI引导回复
   */
  getAIResponse: function (childAnswer) {
    wx.showLoading({
      title: '生成回复中...',
    });
    
    // 调用AI接口获取引导回复
    // 注意：实际开发中需要替换为真实的AI接口调用
    // 这里使用模拟数据
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟AI回复
      const aiResponse = '这是模拟的AI引导回复，实际开发中需要调用真实的AI接口。你的回答很有创意，能再详细说说你的想法吗？';
      
      this.setData({
        aiResponse: aiResponse
      });
    }, 1500);
  },

  /**
   * 播放AI回复
   */
  playResponse: function () {
    if (this.data.isPlaying) {
      // 如果正在播放，则暂停
      this.data.innerAudioContext.pause();
      this.setData({
        isPlaying: false
      });
    } else {
      // 如果未播放，则开始播放
      // 注意：实际开发中需要调用文字转语音API生成音频
      // 这里仅模拟播放过程
      wx.showToast({
        title: '开始播放',
        icon: 'none'
      });
      
      this.setData({
        isPlaying: true
      });
      
      // 模拟5秒后播放结束
      setTimeout(() => {
        this.setData({
          isPlaying: false
        });
      }, 5000);
    }
  },

  /**
   * 复制AI回复
   */
  copyResponse: function () {
    wx.setClipboardData({
      data: this.data.aiResponse,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 切换到上一个问题
   */
  prevQuestion: function () {
    if (this.data.questionIndex > 0) {
      const newIndex = this.data.questionIndex - 1;
      this.setData({
        questionIndex: newIndex,
        currentQuestion: this.data.questions[newIndex],
        childAnswer: '',
        aiResponse: ''
      });
    }
  },

  /**
   * 切换到下一个问题
   */
  nextQuestion: function () {
    if (this.data.questionIndex < this.data.questions.length - 1) {
      const newIndex = this.data.questionIndex + 1;
      this.setData({
        questionIndex: newIndex,
        currentQuestion: this.data.questions[newIndex],
        childAnswer: '',
        aiResponse: ''
      });
    }
  },

  /**
   * 返回问题列表
   */
  backToQuestions: function () {
    wx.navigateBack();
  },

  /**
   * 保存对话
   */
  saveInteraction: function () {
    // 构建对话记录对象
    const interaction = {
      question: this.data.currentQuestion.content,
      answer: this.data.childAnswer,
      response: this.data.aiResponse,
      timestamp: new Date().getTime()
    };
    
    // 获取本地存储的历史记录
    wx.getStorage({
      key: 'interactionHistory',
      success: (res) => {
        let history = res.data || [];
        history.unshift(interaction); // 将新记录添加到开头
        
        // 更新本地存储
        wx.setStorage({
          key: 'interactionHistory',
          data: history,
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          }
        });
      },
      fail: () => {
        // 如果没有历史记录，创建新的历史记录数组
        wx.setStorage({
          key: 'interactionHistory',
          data: [interaction],
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 停止录音计时器
    this.stopRecordTimer();
    
    // 释放音频资源
    if (this.data.innerAudioContext) {
      this.data.innerAudioContext.stop();
      this.data.innerAudioContext.destroy();
    }
  }
});