

function PluginSdk(){}

//PluginSdk.prototype.ws=null;
//PluginSdk.prototype.msg ='';
PluginSdk.prototype.controller =null;
PluginSdk.prototype.Init = function (controller) {   

    this.controller = controller;
    if (typeof anysdk === 'undefined' || !cc.sys.isMobile)
    {
        //this.msg.string = '-----------------no anysdk';
        console.log('-----------------no anysdk');      
    }
    else
    {              
        //this.msg.string = '-----------------has anysdk';
        console.log('----------------has anysdk');
     
        this.userPlugin = anysdk.agentManager.getUserPlugin();
        if (this.userPlugin) {
            this.userPlugin.setListener(this.onUserResult, this);
        }

        this.sharePlugin = anysdk.agentManager.getSharePlugin();
        if(this.sharePlugin){
            this.sharePlugin.setListener(this.onShareResult,this);
        }
    }
    return this;
    //global.anysdk = this;
    //cc.game.addPersistRootNode(this.node);
}

//---------------------支付类-----------------------------------------
//支付商品
PluginSdk.prototype.payForProduct=function (id,name,price,userid,usernick,vip) {
    if (!this.iapPlugin) {
        console.log('no support anysdk');
        //this.msg.string = '--------no support anysdk';
         //this.log +='--------no support anysdk\n';
        return;
    }
     //this.log +='--------start anysdk pay \n';
    var info = {
        'Product_Id': id,                    //商品唯一标示符
        'Product_Name': name,               //商品名称
        'Product_Price': price,                    //商品单价
        'Product_Count': '1',                      //商品数量
        'Product_Desc': name,            //商品描述 
        'Coin_Name': '元宝',                      //虚拟币名称
        'Coin_Rate': '1',                          //虚拟币兑换率
        'Role_Id': userid,    //角色唯一标示符
        'Role_Name': usernick,                      //角色名称
        'Role_Grade': '1',                         //角色等级
        'Role_Balance': 0,                        //虚拟币余额
        'Vip_Level': vip,                          //VIP等级
        'Party_Name': 'null',                      //工会名称
        'Server_Id': '1',                          //服务器唯一标示符
        'Server_Name': '1',                        //服务器名称
        'EXT': 'tuibing'                     //扩展字段
    };
    this.iapPlugin.payForProduct(info);
   // if(cc.isValid(this.controller))
    //    this.controller.emit('event_iap',{ type:'pay',
    //                                            goods_id:id,goods_name:name, goods_price:price,   
    //                                            user_id:userid,  user_nick:usernick,user_gold:usergold, user_vip:vip});
},
   
//获取订单号
PluginSdk.prototype.getOrderId = function () {
    if (!this.iapPlugin) {
        // console.log();
        return;
    }
    var orderId = this.iapPlugin.getOrderId();
    // console.log();
},

//支付结果
PluginSdk.prototype.onPayResult = function (code, msg) {
    cc.log(' PAY RESULT ########## code: ' + code + ',msg: ' + msg);
    switch (code) {
        case anysdk.PayResultCode.kPaySuccess:// 支付系统支付成功
            console.log(' kPaySuccess ');
           // this.log +=' kPaySuccess \n';
             if(cc.isValid(this.controller))
                this.controller.emit('event_iap',{ type:'kPaySuccess',msg:'kPaySuccess'});
            break;
        case anysdk.PayResultCode.kPayCancel:// 支付系统支付取消
            console.log(' kPayCancel ');
            // this.log +=' kPayCancel \n';
              if(cc.isValid(this.controller))
                this.controller.emit('event_iap',{ type:'kPayCancel',msg:'kPayCancel'});
            break;
        case anysdk.PayResultCode.kPayFail:// 支付系统支付失败
           // this.log +=' kPayFail1 '+ msg +' \n';
             if(cc.isValid(this.controller))
                this.controller.emit('event_iap',{ type:'kPayFail1',msg:msg});
            break;
        case anysdk.PayResultCode.kPayNetworkError:// 支付系统网络错误
           // this.log +=' kPayFail2 '+ msg +'\n';
            if(cc.isValid(this.controller))
                this.controller.emit('event_iap',{ type:'kPayFail2',msg:msg});
            break;
        case anysdk.PayResultCode.kPayProductionInforIncomplete:// 支付系统支付信息不完整
            console.log(' kPayFail ');
           // this.log +=' kPayFail3'+ msg +'\n';
             if(cc.isValid(this.controller))
                this.controller.emit('event_iap',{ type:'kPayFail3',msg:msg});
            break;
        case anysdk.PayResultCode.kPayInitSuccess:// 支付系统初始化成功
            console.log(' kPayInitSuccess ');
           // this.log +=' kPayInitSuccess \n';
             if(cc.isValid(this.controller))
                this.controller.emit('event_iap',{ type:'kPayInitSuccess',msg:'kPayInitSuccess'});
            break;
        case anysdk.PayResultCode.kPayInitFail:// 支付系统初始化失败
            console.log(' kPayInitFail ');
            // this.log +=' kPayInitFail \n';
              if(cc.isValid(this.controller))
                this.controller.emit('event_iap',{ type:'kPayInitFail',msg:'kPayInitFail'});
            break;
        case anysdk.PayResultCode.kPayNowPaying:// 支付系统正在支付中
            console.log(' kPayNowPaying ');
          //  this.log +=' kPayNowPaying \n';
            this.iapPlugin.resetPayState();
            if(cc.isValid(this.controller))
                this.controller.emit('event_iap',{ type:'kPayNowPaying',msg:'kPayNowPaying'});
            break;
        default:
            break;
    }
}

//--------------登录类----------------------------------------------
PluginSdk.prototype.login = function () {
    if (!this.userPlugin) {
       // SuspensionTips.init.showTips(' this.userPlugin is null  ');
        return;
    }
    this.userPlugin.login();
}

PluginSdk.prototype.isLogined= function () {
    if (!this.userPlugin) {
        //SuspensionTips.init.showTips(' this.userPlugin is null  ');
        return;
    }
    var flag = this.userPlugin.isLogined();
    //SuspensionTips.init.showTips(' isLogined ' + flag);
}

PluginSdk.prototype.logout= function () {
    if (!this.userPlugin || !this.userPlugin.logout) {
        //SuspensionTips.init.showTips(' this.userPlugin is null or logout is not supported ');
        return;
    }
    this.userPlugin.logout();
}

PluginSdk.prototype.enterPlatform=function () {
    if (!this.userPlugin || !this.userPlugin.enterPlatform) {
        //SuspensionTips.init.showTips(' this.userPlugin is null or enterPlatform is not supported ');
        return;
    }
    this.userPlugin.enterPlatform();
}

PluginSdk.prototype.showToolBar=function () {
    if (!this.userPlugin || !this.userPlugin.showToolBar) {
       // SuspensionTips.init.showTips(' this.userPlugin is null or showToolBar is not supported ');
        return;
    }
    this.userPlugin.showToolBar(anysdk.ToolBarPlace.kToolBarTopLeft);
},

PluginSdk.prototype.hideToolBar= function () {
    if (!this.userPlugin || !this.userPlugin.hideToolBar) {
        //SuspensionTips.init.showTips(' this.userPlugin is null or hideToolBar is not supported ');
        return;
    }
    this.userPlugin.hideToolBar();
}

PluginSdk.prototype.accountSwitch= function () {
    if (!this.userPlugin || !this.userPlugin.accountSwitch) {
        //SuspensionTips.init.showTips(' this.userPlugin is null or accountSwitch is not supported ');
        return;
    }
    this.userPlugin.accountSwitch();
}

PluginSdk.prototype. realNameRegister= function () {
    if (!this.userPlugin || !this.userPlugin.realNameRegister) {
       // SuspensionTips.init.showTips(' this.userPlugin is null or realNameRegister is not supported ');
        return;
    }
    this.userPlugin.realNameRegister();
}

PluginSdk.prototype.antiAddictionQuery= function () {
    if (!this.userPlugin || !this.userPlugin.antiAddictionQuery) {
        //SuspensionTips.init.showTips(' this.userPlugin is null or antiAddictionQuery is not supported ');
        return;
    }
    this.userPlugin.antiAddictionQuery();
}

PluginSdk.prototype. submitLoginGameRole=function () {
    if (!this.userPlugin || !this.userPlugin.submitLoginGameRole) {
       // SuspensionTips.init.showTips(' this.userPlugin is null or submitLoginGameRole is not supported ');
        return;
    }
    var data = {
        'roleId': '123456',
        'roleName': 'test',
        'roleLevel': '10',
        'zoneId': '123',
        'zoneName': 'test',
        'dataType': '1',
        'ext': 'login'
    };
    this.userPlugin.submitLoginGameRole(data);
}

PluginSdk.prototype.onUserResult=function (code, msg) {
    cc.log(' USER RESULT ########## code: ' + code + ',msg: ' + msg);

    if(this.controller)
        this.controller.setlog(' USER RESULT ########## code: ' + code + ',msg: ' + msg);

    switch (code) {
        case anysdk.UserActionResultCode.kInitSuccess:
            //SuspensionTips.init.showTips(' kInitSuccess ');
            this.controller.setlog(' kInitSuccess ');
            break;
        case anysdk.UserActionResultCode.kInitFail:            
            //SuspensionTips.init.showTips(' kInitFail ');
            this.controller.setlog(' kInitFail ');
            break;
        case anysdk.UserActionResultCode.kLoginSuccess://登录成功
            //SuspensionTips.init.showTips(' kLoginSuccess ');
            this.controller.setlog(' kLoginSuccess ');

            var uid = this.userPlugin.getUserID();
            this.controller.setlog(uid);
            this.controller.setlog('\r\n');
            var info =JSON.parse(this.userPlugin.getUserInfo().toString());

            this.controller.setlog(this.userPlugin.getUserInfo().toString());
            //var data = $.getData();
            this.openid =uid;
            if(this.controller){                
                this.controller.WXLogin(this.openid);
            }           
            
            break;
        case anysdk.UserActionResultCode.kLoginNetworkError:
            //SuspensionTips.init.showTips(' kLoginNetworkError ');
            this.controller.setlog(' kLoginNetworkError ');
            break;
        case anysdk.UserActionResultCode.kLoginNoNeed:
            //SuspensionTips.init.showTips(' kLoginNoNeed ');
            this.controller.setlog(' kLoginNoNeed ');
            break;
        case anysdk.UserActionResultCode.kLoginFail:
           // SuspensionTips.init.showTips(' kLoginFail ');
            this.controller.setlog(' kLoginFail ');
            // this.userPlugin.logout();
            // this.userPlugin.login();
            break;
        case anysdk.UserActionResultCode.kLoginCancel:
            //SuspensionTips.init.showTips(' kLoginCancel ');
            this.controller.setlog(' kLoginCancel ');
            break;
        case anysdk.UserActionResultCode.kLogoutSuccess:
           //SuspensionTips.init.showTips(' kLogoutSuccess ');
            this.controller.setlog(' kLogoutSuccess ');
            break;
        case anysdk.UserActionResultCode.kLogoutFail:
            //SuspensionTips.init.showTips(' kLogoutFail ');
            this.controller.setlog(' kLogoutFail ');
            break;
        case anysdk.UserActionResultCode.kPlatformEnter:
            //SuspensionTips.init.showTips(' kPlatformEnter ');
            this.controller.setlog(' kPlatformEnter ');
            break;
        case anysdk.UserActionResultCode.kPlatformBack:
            //SuspensionTips.init.showTips(' kPlatformBack ');
            this.controller.setlog(' kPlatformBack ');
            break;
        case anysdk.UserActionResultCode.kPausePage:
            //SuspensionTips.init.showTips(' kPausePage ');
            this.controller.setlog(' kPausePage ');
            break;
        case anysdk.UserActionResultCode.kExitPage:
            //SuspensionTips.init.showTips(' kExitPage ');
            this.controller.setlog(' kExitPage ');
            break;
        case anysdk.UserActionResultCode.kAntiAddictionQuery:
            //SuspensionTips.init.showTips(' kAntiAddictionQuery ');
            this.controller.setlog(' kAntiAddictionQuery ');
            break;
        case anysdk.UserActionResultCode.kRealNameRegister:
            //SuspensionTips.init.showTips(' kRealNameRegister ');
            this.controller.setlog(' kRealNameRegister ');
            break;
        case anysdk.UserActionResultCode.kAccountSwitchSuccess:
            //SuspensionTips.init.showTips(' kAccountSwitchSuccess ');
            this.controller.setlog(' kAccountSwitchSuccess ');
            break;
        case anysdk.UserActionResultCode.kAccountSwitchFail:
            //SuspensionTips.init.showTips(' kAccountSwitchFail ');
            this.controller.setlog(' kAccountSwitchFail ');
            break;
        case anysdk.UserActionResultCode.kOpenShop:
            //SuspensionTips.init.showTips(' kOpenShop ');
            this.controller.setlog(' kOpenShop ');
            break;
        default:
            break;
    }
}
//-------------------------分享类-------------------------------
PluginSdk.prototype.onShareResult = function(code, msg){
    cc.log("share result, resultcode:"+code+", msg: "+msg);
   // this.msg = "share result, resultcode:"+code+", msg: "+msg;
   this.controller.setlog("share result, resultcode:"+code+", msg: "+msg);
    switch ( code ) {
        case anysdk.ShareResultCode.kShareSuccess:            
            //do something
            break;
        case anysdk.ShareResultCode.kShareFail:
            //do something
            break;
        case anysdk.ShareResultCode.kShareCancel:
            //do something
            break;
        case anysdk.ShareResultCode.kShareNetworkError:
            //do something
            break;
    }
}

PluginSdk.prototype.Share = function(user,roomid){

    if (!this.sharePlugin) return;
    var info = {
       title:"极速推饼好友邀请",
       text:user+"邀请您一起来玩(极速推饼),房间密码:"+roomid,
       url:"http://sharesdk.cn",
       mediaType:"0",
       shareTo:"0",

       titleUrl : "http://sharesdk.cn",
       site : "ShareSDK", 
       siteUrl : "http://sharesdk.cn",
       description:"极速推饼",
     }

    this.sharePlugin.share(info);
}

PluginSdk.prototype.ShareImg = function(img){
    
        if (!this.sharePlugin) return;
        var info = {
           title:"极速推饼结算",
           //text:user+"邀请您一起来玩(极速推饼),房间密码:"+roomid,
           url:"http://sharesdk.cn",
           mediaType:"1",
           shareTo:"0",
           imagePath:img,
    
           //titleUrl : "http://sharesdk.cn",
          // site : "ShareSDK", 
           //siteUrl : "http://sharesdk.cn",
           description:"极速推饼",
         }
    
        this.sharePlugin.share(info);
    }

//var plugin = new PluginSdk();  
//module.exports =plugin.Init();
module.exports = new PluginSdk();  