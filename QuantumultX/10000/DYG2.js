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
  /*
  // 小组件
  async renderSmall(widget){
    widget.setPadding(10, 10, 10, 10);
    const headerStack = widget.addStack();
    headerStack.addSpacer();
    let image = await this.getImageByUrl(this.logo);
    this.addImage(headerStack, image, {w:415 * 0.24, h:125 * 0.24});
    headerStack.addSpacer();
    widget.addSpacer();

    const feeStack = widget.addStack();
    feeStack.addSpacer();
    this.addText(feeStack, `${this.fee.number}`, 21, {font:"mediumRounded"});
    feeStack.addSpacer();
    widget.addSpacer();
    const bodyStack = widget.addStack();
    bodyStack.layoutVertically();
    const flow = this.getFlowInfo();
    let voice = this.settings.voice || {"number":"0","percent":"0.00"};
    if (this.settings.button[1]){
      this.textLayout(bodyStack, {...flow, ...this.flow});
      bodyStack.addSpacer(7);
      this.textLayout(bodyStack, {...voice, ...this.voice});
      bodyStack.addSpacer(7);
      this.textLayout(bodyStack, {...this.settings.point, ...this.point});
    } else {
      const canvas = this.makeCanvas(178, 178);
      const ringStack = bodyStack.addStack();
      this.imageCell(canvas, ringStack, {...flow, ...this.flow});
      ringStack.addSpacer();
      this.imageCell(canvas, ringStack, {...voice, ...this.voice});
    }
  }
  
  textLayout(stack, data) {
    const rowStack = stack.addStack();
    rowStack.centerAlignContent();
    const icon = SFSymbol.named(data.icon);
    icon.applyHeavyWeight();
    this.addImage(rowStack, icon.image, {w:13, h:13}, {color:data.iconColor});
    rowStack.addSpacer(4);
    this.addText(rowStack, data.title, 13);
    rowStack.addSpacer();
    this.addText(rowStack, data.number.substring(0,5) + data.unit, 13);
  }
  
  async imageCell(canvas, stack, data, fee, percent) {
    const canvaStack = stack.addStack();
    canvaStack.layoutVertically();
    if (!fee) {
      const opts = {size:178, radius:80, width:18, percent:data.percent};
      this.drawArc(canvas, opts, data.FGColor, data.BGColor);
      canvaStack.size = new Size(61, 61);
      canvaStack.backgroundImage = canvas.getImage();
      this.ringContent(canvaStack, data, percent);
    } else {
      canvaStack.addSpacer(10);
      const smallLogo = await this.getImageByUrl(this.verticalLogo);
      const logoStack = canvaStack.addStack();
      logoStack.size = new Size(40, 40);
      logoStack.backgroundImage = smallLogo;
    }
  }
  
  ringContent(stack, data, percent = false) {
    const rowIcon = stack.addStack();
    rowIcon.addSpacer();
    const icon = SFSymbol.named(data.icon);
    icon.applyHeavyWeight();
    const iconElement = rowIcon.addImage(icon.image);
    iconElement.tintColor = new Color(data.FGColor);
    iconElement.imageSize = new Size(12, 12);
    iconElement.imageOpacity = 0.7;
    rowIcon.addSpacer();

    stack.addSpacer(1);

    const rowNumber = stack.addStack();
    rowNumber.addSpacer();
    let title = percent ? `${data.percent}` : `${data.number}`;
    this.addText(rowNumber, title, 12, {font:'medium'});
    rowNumber.addSpacer();

    const rowUnit = stack.addStack();
    rowUnit.addSpacer();
    title = percent ? '%' : data.unit;
    this.addText(rowUnit, title, 8, {font:'bold', opacity:0.5});
    rowUnit.addSpacer();
  }
  
  // 中组件
  async renderMedium(widget){
    widget.setPadding(10, 10, 10, 10);
    const canvas = this.makeCanvas(178, 178);
    const bodyStack = widget.addStack();
    await this.mediumCell(canvas, bodyStack, {...this.fee}, true);
    bodyStack.addSpacer(10);
    const flow = this.getFlowInfo();
    await this.mediumCell(canvas, bodyStack, {...flow, ...this.flow}, false, true);
    bodyStack.addSpacer(10);
    let voice = this.settings.voice || {"number":"0","percent":"0.00"};
    await this.mediumCell(canvas, bodyStack, {...voice, ...this.voice}, false, true);
  }
  
  async mediumCell(canvas, stack, data, fee = false, percent) {
    let color = data.LinearColor[0];
    const bg = new LinearGradient();
    bg.locations = [0, 1];
    bg.colors = [
      Color.dynamic(
        new Color(data.LinearColor[0], 0.03),
        new Color(data.LinearColor[1], 0.03)
      ),
      Color.dynamic(
        new Color(data.LinearColor[0], 0.1),
        new Color(data.LinearColor[1], 0.1)
      ),
    ];
    const dataStack = stack.addStack();
    dataStack.backgroundGradient = bg;
    dataStack.cornerRadius = 20;
    dataStack.layoutVertically();
    dataStack.addSpacer();

    const topStack = dataStack.addStack();
    topStack.addSpacer();
    await this.imageCell(canvas, topStack, data, fee, percent);
    topStack.addSpacer();
    
    if (fee) {
      dataStack.addSpacer(5);
      const updateStack = dataStack.addStack();
      updateStack.addSpacer();
      updateStack.centerAlignContent();
      const updataIcon = SFSymbol.named('arrow.2.circlepath');
      updataIcon.applyHeavyWeight();
      const updateImg = updateStack.addImage(updataIcon.image);
      updateImg.tintColor = new Color(color, 0.6);
      updateImg.imageSize = new Size(10, 10);
      updateStack.addSpacer(3);
      const updateTime = this.getDateStr('HH:mm');
      this.addText(updateStack, `${updateTime}`, 10, {font:'medium', color:color, opacity:0.6});
      updateStack.addSpacer();
    }
    
    dataStack.addSpacer();

    const numberStack = dataStack.addStack();
    numberStack.addSpacer();
    this.addText(numberStack, `${data.number} ${data.unit}`, 15, {font:'semibold', color:color});
    numberStack.addSpacer();

    dataStack.addSpacer(3);

    const titleStack = dataStack.addStack();
    titleStack.addSpacer();
    this.addText(titleStack, data.title, 11, {font:'medium', color:color, opacity:0.7});
    titleStack.addSpacer();

    dataStack.addSpacer(15);
  }
  */
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
            cookie: 'cookie',
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
