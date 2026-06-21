export default defineAppConfig({
  pages: [
    'pages/pool/index',
    'pages/filter/index',
    'pages/content/index',
    'pages/campaign/index',
    'pages/result/index',
    'pages/customer-detail/index',
    'pages/label-manage/index',
    'pages/campaign-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B5CF6',
    navigationBarTitleText: '医美私域运营',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#8B85A8',
    selectedColor: '#8B5CF6',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/pool/index',
        text: '客户池'
      },
      {
        pagePath: 'pages/filter/index',
        text: '标签筛选'
      },
      {
        pagePath: 'pages/content/index',
        text: '内容匹配'
      },
      {
        pagePath: 'pages/campaign/index',
        text: '群发计划'
      },
      {
        pagePath: 'pages/result/index',
        text: '效果回收'
      }
    ]
  }
})
