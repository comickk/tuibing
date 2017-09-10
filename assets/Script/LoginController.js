var global = require('Global'); 
cc.Class({
    extends: require("Controller"),

    properties: {
        img_load:cc.Node,

        sdklog:cc.Label,
        win_login:cc.Node,


       // headimg:cc.Sprite,
        //----------------
        _wintip:cc.Node,

        _lastname:'',
        _lastpass:'',
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        cc.director.setDisplayStats( false);
        global.anysdk = require('PluginAnySdk').Init();       

       //获取socket
       global.socket = require('Socket');
       global.socket.controller = this;

        var poplayer = cc.find('PopWinLayer');
        if(cc.isValid(poplayer)){            
            cc.game.addPersistRootNode(poplayer);
            var popbg = cc.find('PopWinLayer/popwinbg');
            popbg.on('touchend',function(){event.stopPropagation();});  
            global.wintip =  cc.find('PopWinLayer/Win_Tip');
        }

        this.node.on('getauthcode',this.GetAuthCode,this);        

        this.node.on('idlogin',function(event){

            this._lastname = event.detail.name;
            
            if(event.detail.noitpsw)
                this._lastpass = event.detail.psw;
            else
                this._lastpass = '';

            var arg ='user_name='+event.detail.name;//this._lastnick;
            arg += '&user_pass='+event.detail.psw;//this._lastpass;  
            this.Send(arg);  
        },this);



        // var self = this;
        // var remoteUrl = "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoDA8HqHL3ZNz3jcQhf6aAryIdZ1j8Bh75TPTpoScMpODMsBa3mVBbQGDFxoajZiaF2JV9p8JHQXBQ/0.jpg";
        // cc.loader.load({url: remoteUrl, type: 'jpg'}, function (err,tex) {
        //     //self.headimg.spriteFrame = tex ;
        //     cc.log(tex)
        // });
        
    },

    
    Btn_Login:function(event,customEventData)
    {   
        // var arg ='user_name='+customEventData;//this._lastnick;
        // arg += '&user_pass='+'123456';//this._lastpass;  
        // this.Send(arg);  
        
        global.anysdk.login();
    },

    Btn_IDLogin:function(){
        this.win_login.active = true;

    },

    Btn_Exit:function(){
        global.PopWinTip(1,'确定要退出吗？',function(){  cc.game.end();   });       
    },

    Event_Back:function(){
         global.PopWinTip(1,'确定要退出吗？',function(){  cc.game.end();   }); 
    },

    Send:function(arg){
        
        var self = this;
        
        var url ='http://'+global.socket.URL +'/client/user/login?';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;               
                var s = JSON.parse(response);  

                if(cc.isValid(s.error)){
                    //错误信息
                    cc.log('login error!');
                }else{                    
                    cc.log('login success!');
                    cc.log(s.data);
                    //存储本次登录账号
                    cc.sys.localStorage.setItem('loginname', self._lastname);
                    cc.sys.localStorage.setItem('loginpass', self._lastpass);
                    self.node.emit('getauthcode',{  code:s.data[0],server:s.data[1]});
                                                  //  nick:self._loginnick,
                                                  //  pass:self._loginpass});
                }
            }
        };        
        xhr.open("POST", url+arg, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.send(arg);
    },

    GetAuthCode:function(event){
      
        global.socket.Init(event.detail.server,event.detail.code);         
        
    },   

    MsgHandle:function(data){               
        cc.log(data);   
        switch(data[0]){            
            case 1:      
                this.img_load.active = true;
                global.socket.SendMsg(1001);                 
            break;
            case 1002:
                if(data[1]==null){
                    cc.log('self info error!');
                }else{
                    global.selfinfo = data[1];
                    cc.director.loadScene('room');    
                }              
            break;
        
            default:           
            break;          
        }
    },

    CloseSocket:function(){		
		cc.log('socket close');
    },    
});
