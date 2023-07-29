/*
// 抖音搜索：大舅哥科技
// 微信搜索公众号「大舅哥科技」
// 获取更多精美实用 iOS 桌面组件！
// 更多精选快捷指令、壁纸，等你！
// ***************************
// 环境框架   ：@ DmYY  
// author 	 ：原作者「2Ya & 脑瓜」, 由DJG修改
*/

const { DJG, Runing } = importModule(
  FileManager.local().joinPath(
    FileManager.local().libraryDirectory(),
    "/DJG.js"
  )
);

// @组件代码开始
class Widget extends DJG {
  constructor(arg) {
    super(arg);
    this.name = '中国电信'
    this.widget_ID = "DJG-113"
    this.version = "V1.2"
    this.logo = 'https://s1.ax1x.com/2022/07/10/jypcod.png';
    this.verticalLogo = 'https://s1.ax1x.com/2022/07/10/jypDsO.png';
    
    this.Run(module.filename, args);
  }
  
  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    if(!this.settings.cookie){
      const error = "需要输入电信cookie或登录账号"
      return this.ERROR = [{error:error}];
    }
    let widget = this.getWidget();
    await this.getWidgetBackgroundImage(widget);
    try{
      await this.getData();
      this.saveSettings(false);
      switch (this.widgetFamily) {
        case 'small':
        	await this.renderSmall(widget);
        	break;
        case 'medium':
        	await this.renderMedium(widget);
        	break;
        default:
        	return await this.renderAlert();
      }
    }catch(e){
      this.ERROR.push({error:e.toString()});
    }
    return widget;
  }
  
  fee = {
    title: '剩余话费',
    number: '0',
    unit: '元',
    en: '¥',
    LinearColor: ['d7000f', 'EED5D7']
  }
  
  flow = {
    icon: 'antenna.radiowaves.left.and.right',
    iconColor: '1ab6f8',
    FGColor: '12A6E4',
    BGColor: 'F86527',
    LinearColor: ['12A6E4', 'B9E4F6']
  };
  
  voice = {
    title: '剩余语音',
    unit: '分钟',
    en: 'MIN',
    icon: 'phone.fill',
    iconColor: '30d15b',
    FGColor: 'F86527',
    BGColor: 'F86527',
    LinearColor: ['F86527', 'F0DED6']
  };
  
  point = {
    title: '更新时间',
    number: `${this.getDateStr('HH:mm')}`,
    unit: '',
    icon: 'tag.fill',
    iconColor: 'fc6d6d',
  }
  
  fetchUrl = {
    detail: 'https://e.189.cn/store/user/package_detail.do',
    balance: 'https://e.189.cn/store/user/balance_new.do',
  };
  
  // 小组件
  // 中组件
  
  getFlow(){
    let flow = {
      total: 0,
      used: 0,
      balance: 0
    }
    const flows = this.settings.flows || [flow];
    if(flows.length == 1) return flows[0];
    
    const letters = 'abcdefghijklmn';
    let choice = this.settings.optionStatus || [true];
    if(choice[0]) {
      flows.forEach((item) => {
        if(item.itemName != '无限流量'){
          flow.total = (flow.total || 0) + item.total;
          flow.used = (flow.used || 0) + item.used;
          flow.balance = (flow.balance || 0) + item.balance;
        }
      })
    } else {
      const letterArr = choice.split('');
      letterArr.forEach((value) => {
        let idx = letters.indexOf(value);
        flow.total = (flow.total || 0) + flows[idx].total;
        flow.used = (flow.used || 0) + flows[idx].used;
        flow.balance = (flow.balance || 0) + flows[idx].balance;
      })
    }
    return flow;
  }
  
  getFlowInfo() {
    let flowInfo = this.getFlow();
    let flow = {};
    let _flow = null;
    if(this.settings.button[0]){
      flow.title = '已用流量';
      _flow = this.formatFlow(flowInfo.used, flowInfo.total);
    } else {
      flow.title = '剩余流量';
      _flow = this.formatFlow(flowInfo.balance, flowInfo.total);
    }
    flow.percent = _flow.percent;
    flow.number = _flow.count;
    flow.unit = _flow.unit;
    flow.en = _flow.unit;
    return flow;
  }
  
  formatFlow(number, total) {
    const percent = ((number / (total || 1)) * 100).toFixed(2);
    const n = number / 1024;
    if (n < 1024) {
      return {count: n.toFixed(2), unit: 'MB', percent: percent};
    } else if (n < 1024*1024) {
      return {count: (n / 1024).toFixed(2), unit: 'GB', percent: percent};
    } else {
      return {count: (n / (1024*1024)).toFixed(2), unit: 'TB', percent: percent};
    }
  }
  
  formatVoice(number, total) {
    let voice = {};
    const percent = ((number / (total || 1)) * 100).toFixed(2);
    const n = number;
    if (n < 10000) {
      voice = {number: n.toString(), percent: percent};
    } else {
      voice = {number: (n / 10000).toFixed(0) + 'w', percent: percent};
    }
    this.settings.voice = voice;
  }
  
  async getData () {
    const opts = {
      headers: {'cookie': this.settings.cookie}
    };
    let url = this.fetchUrl.detail;
    const detail = await this.httpGet(url, true, true, opts, 'POST');
    url = this.fetchUrl.balance;
    const balance = await this.httpGet(url, true, true, opts, 'POST');
    
    try{
      if (detail.result === 0) {
        // 套餐分钟数
        if (detail.voiceBalance && detail.voiceAmount) {
          this.formatVoice(Number(detail.voiceBalance), Number(detail.voiceAmount));
        } else {
          detail.items.forEach((data) => {
            if (data.offerType == 21) {
              data.items.forEach((item) => {
                if (item.unitTypeId === '1') {
                  if (item.ratableAmount !== '0' && item.balanceAmount !== '0') {
                    this.formatVoice(Number(item.voiceBalance), Number(item.voiceAmount));
                  }
                }
              })
            }
          })
        }
        // 流量套餐
        let flows = [];
        let flowName = [];
        let index = 0;
        detail.items.forEach((data) => {
          data.items.forEach((item) => {
            if (item.unitTypeId === '3') {
              let flow = {};
              let itemName = item.ratableAmount.length > 8 ? "无限流量" : item.ratableResourcename;
              let idx = flowName.indexOf(itemName);
              if(idx == -1){
                flowName.push(itemName);
                flow.itemName = itemName;
                flow.total = Number(item.ratableAmount);
                flow.used = Number(item.usageAmount);
                flow.balance = Number(item.balanceAmount);
                flows.push(flow);
              } else {
                flows[idx].total = flows[idx].total + Number(item.ratableAmount);
                flows[idx].used = flows[idx].used + Number(item.usageAmount);
                flows[idx].balance = flows[idx].balance + Number(item.balanceAmount);
              }
            }
          })
        })
        this.settings.flows = flows;
        
        if (balance.result === 0) {
      	  // 余额
      	  this.fee.number = parseFloat(parseInt(balance.totalBalanceAvailable) / 100).toFixed(2);
    	};
      } else {
        this.flow.FGColor = 'C4C4C4';
        this.voice.FGColor = 'C4C4C4';
        this.notify(this.name, '用户登录失败，cookie失效');
      }
    }catch(e){
      this.ERROR.push({error:e.toString()});
    }
  };
  
  async renderTables() {
    const actions = [
      {
        title: "流量套餐",
        onClick: async () => {
          await this.setFeeDetails();
        }
      },
      {
        title: '已用流量',
        but: 0,
      },
      {
        explain: '显示已用流量，不限量或伪不限量用户可开启'
      },
      {
        title: '组件样式',
        but: 1,
      },
      {
        explain: '开启后，小号组件以列表方式加载'
      }
    ];
    const table = new UITable();
    table.showSeparators = true;
    await this.dynamicMenu(table, actions, "样式设置");
    await table.present();
  }
  
  async setFeeDetails () {
    const flows = this.settings.flows || [];
    let opts = flows.map((item) => {
      return item.itemName;
    });
    await this.setChoiceAction(
      "流量显示(可多选)",
      "选择需要加载的流量套餐\n如无内容，请先预览！",
      opts,
      false
    );
  }
  
  async renderWebView () {
    const webView = new WebView();
    const url = 'https://e.dlife.cn/index.do';
    await webView.loadURL(url);
    await webView.present(false);

    const request = new Request(this.fetchUrl.detail);
    request.method = 'POST';
    const response = await request.loadJSON();
    if (response.result === -10001) {
      const index = await this.generateAlert('未获取到用户信息', [
        '取消',
        '重试',
      ]);
      if (index === 0) return;
      await this.renderWebView();
    } else {
      const cookies = request.response.cookies;
      let cookie = [];
      cookie = cookies.map((item) => `${item.name}=${item.value}`);
      cookie = cookie.join('; ');
      this.settings.cookie = cookie;
      this.saveSettings();
    }
  };
  
  // 添加设置信息
  Run(filename, args) {
    if (config.runsInApp) {
      this.registerAction("基础设置", this.setWidgetConfig);
      this.registerAction("账号设置", async () => {
        const index = await this.generateAlert("设置账号信息", [
          "网站登录",
          "手动输入",
        ]);
        if (index === 0) {
          await this.renderWebView();
        } else {
          await this.setCustomAction("账号设置", "- 输入中国电信 cookie\n- 可前往公众号翻阅教程", {
            cookie: 'SSON=0f994c8800f3ac611c0d48a68b9c301cb76f4c45d4de2b81834523bdb9538d66e9f7d0fc87fff6e3608d567e5862b950ec033230de0617d156df191ce492b207573d62752000e437091577c54439ab52c5f66640f0e6160f5a0fc3ff7f029f4071698d4630f65091d7303a436c16589bc66b3374e3792ec7f5ae45d16c542ed06bf80847374ce02f6bbc17094c568cf67aac3736679ec8710121e40095162d5de9430b5d655e9e7522b49fd153358a266ae857aceccaef2849eb296083658fdb8c18be0aa842d5e102576a955935e9b0; JSESSIONID=aaa90IxqKFUmz8kDQDqLy',
          });
        }
      }, { name: 'person.crop.circle', color: '#66CD00' });  
      this.registerAction("设置样式", async () => {
        await this.renderTables()
      }, { name: 'antenna.radiowaves.left.and.right', color: '#CD6600' });
    }
  }
}
// @组件代码结束
await Runing(Widget)
