var global = require('Global'); 
cc.Class({
    extends: require("Controller"),

    properties: {
        img_load:cc.Node,

        //sdklog:cc.Label,
        win_login:cc.Node,

        defaluthead:cc.SpriteFrame,
       // log:cc.Label,
        //headimg:cc.Sprite,
        //----------------
        _wintip:cc.Node,

        _lastname:'',
        _lastpass:'',      
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        cc.debug.setDisplayStats( false);
        global.anysdk = require('PluginAnySdk').Init(this);    
        
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

            this._lastname = event.name;
            
            if(event.noitpsw)
                this._lastpass = event.psw;
            else
                this._lastpass = '';

            var arg ='user_name='+event.name;//this._lastnick;
            arg += '&user_pass='+event.psw;//this._lastpass;  
            this.Send(arg);  
        },this);
        //
       // cc.log(JSON.parse(cc.sys.localStorage.getItem('record')));
       //cc.sys.localStorage.removeItem('record')
        //       

        //防锁屏（未测试）
        //cc.Device.setKeepScreenOn(); 

        //模拟添加战绩数据
        //cc.sys.localStorage.removeItem('record');

      //  var record = JSON.parse(cc.sys.localStorage.getItem('record'));
      //  if(record == null)
    //    var  record = [];
        // record.push(['2017-9-21','1','1','1','1',3578]);
        // record.push(['2017-9-20','1','1','1','1',2000]);
    
        // record.push(['2017-9-17','1','1','1','1',1027]);
        // record.push(['2017-9-16','1','1','1','1',-200]);
        // record.push(['2017-9-15','1','1','1','1',-15305]);
        // cc.sys.localStorage.setItem('record', JSON.stringify(record));


        //---------------------
        // var sstr = '%5B%7B%2s啥宋德福2lastUpdateTime%22%3A%222011-10-28+9%3A39%3A41%22%2C%22smsList%22%3A%5B%7B%22liveState%22%3A%221啥h打饭';
        // //sstr = decodeURIComponent(encodeURIComponent(sstr));
        // console.log(sstr.length);
        // var cpredString = pako.deflate(sstr,{to:'string'});
        
        // console.log(cpredString.length);
        
        // console.log(pako.inflate(cpredString, { to: 'string' }));   

        //this.node.on('canvas-resize',function(event){cc.log('11111111111');});

        cc.view.resizeWithBrowserSize(true);
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE); 
    },

    
    Btn_Login:function(event,customEventData)
    {   
        // var arg ='user_name='+customEventData;//this._lastnick;
        // arg += '&user_pass='+'123456';//this._lastpass;  
        // this.Send(arg);  
      
        //this.WXLogin('oGYue1LK1U5DPUyslPSSl_JpIGvE');

        //global.anysdk.Share(10000);//分亨链接，在链接的网页中打开APP

        //this.captureScreen();
        global.anysdk.login();
    },

    //账号登录按钮
    Btn_IDLogin:function(){
       
        this.win_login.active = true;
    },

    Btn_Exit:function(){
        global.PopWinTip(1,'确定要退出吗？',function(){  cc.game.end();   });       
    },

    Event_Back:function(){
         global.PopWinTip(1,'确定要退出吗？',function(){  cc.game.end();   }); 
    },
    
    WXLogin:function(id)
    {
        var arg ='user_name='+id;
        arg += '&user_pass=123456';  

        var self = this;
        
        var url ='http://'+global.socket.URL +'/client/user/loginWX?';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {            
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;               
                var s = JSON.parse(response);  
               
                if(cc.isValid(s.error)){
                    //错误信息
                    //cc.log('login error!');
                    cc.log(s);                   
                }else{                    
                    cc.log('login success!');                   
                                        
                    self.node.emit('getauthcode',{  code:s.data[0],server:s.data[1]});                                                  
                }
            }                            
        };        
        xhr.open("POST", url+arg, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.send(arg); 
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
                    cc.log(s);
                }else{                    
                    cc.log('login success!');
                    //cc.log(s.data);
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
      
        global.socket.Init(event.server,event.code);         
        
    },   

    MsgHandle:function(data){               
        //cc.log(data);   
        switch(data[0]){            
            case 1:      
                //比较版本
                if(data[1] > global.ver )
                    global.PopWinTip(2,'有新版本可更新！',function(){  cc.game.end();   });
                else{
                    this.img_load.active = true;
                    global.socket.SendMsg(1001);  
                }               
            break;
            case 1002:
                if(data[1]==null){
                    cc.log('self info error!');
                }else{
                   // cc.log(data);
                   // global.selfinfo = data[3]; 
                    global.selfinfo = data[1]; 
                    //cc.log(global);
                    //if(  cc.isValid( global.selfinfo.headimg)) 
                    if(global.selfinfo.id.length >= 28)
                        this.GetHeadImg(global.selfinfo.id);      
                   // else
                   //     global.selfinfo.headimg =null;              

                    cc.director.loadScene('room');    
                }              
            break;
        
            default:           
            break;          
        }
    },

    setlog:function(msg){
        this.log.string += msg;
    },

    CloseSocket:function(){		
		cc.log('socket close');
    },    

    GetHeadImg:function(id){
        
         var self = this;
        //var remoteUrl = "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoDA8HqHL3ZNz3jcQhf6aAryIdZ1j8Bh75TPTpoScMpODMsBa3mVBbQGDFxoajZiaF2JV9p8JHQXBQ/0.jpg";
        
        //var remoteUrl ="http://118.190.149.221/client/user/avatar?id="+id;
         var remoteUrl ="http://"+global.socket.URL+"/client/user/avatar?id="+id;
        var frame= null;
        cc.loader.load({url: remoteUrl, type: 'jpg'}, function (err,tex) {          
            if(!err){                
                global.selfinfo.headimg = new cc.SpriteFrame(tex);                
            }else
                global.selfinfo.headimg = null;
        });        
    },    


    // test1:function(){
    //     this.btn[2].setSiblingIndex(this.btn[2].getSiblingIndex()+1); 
    //同级索引，值大的在上层
    // },
    
});
