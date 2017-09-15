

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