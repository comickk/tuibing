var global = require('Global'); 
cc.Class({
    extends: require("Controller"),

    properties: {
       
        playernick:cc.Label,
        playergold:cc.Label,
        playerhead:cc.Sprite,

        popbg:cc.Node,
        win_create:cc.Node,
        win_enter:cc.Node,
        win_record:cc.Node,
        win_life:cc.Node,
        win_member:cc.Node,

        win_shop:cc.Node,

        win_help:cc.Node,

        loadscene:cc.Node,

        loadprog:cc.ProgressBar,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.popbg.on('touchend',function(){event.stopPropagation();});  
        this.loadscene.on('touchend',function(){event.stopPropagation();});  

        this.node.on('event_iap',this.IapEvent,this);  

        if(cc.isValid(global.anysdk))
            global.anysdk.controller = this.node;

        if(cc.isValid(global.socket))
            global.socket.controller = this;
        
        if(cc.isValid(global.selfinfo)){
            this.playernick.string = global.selfinfo.nickname;
            this.playergold.string = global.selfinfo.gold_count;
            if(global.selfinfo.headimg!= null)
                this.playerhead.spriteFrame = global.selfinfo.headimg;
        }       

        if( cc.isValid (JSON.parse(cc.sys.localStorage.getItem('showhelp'))) )
            this.win_help.active = false; 
    },

    Btn_Back:function(){
        

        // var poplayer = cc.find('PopWinLayer');
        // if(cc.isValid(poplayer))          
        //     cc.game.removePersistRootNode (poplayer);
           
        // var ac = cc.find('AudioController');
        // if(cc.isValid(ac))          
        //      cc.game.removePersistRootNode (ac);

        global.anysdk.logout();

        global.socket.Close(true);

        cc.director.loadScene('login');
    },

    Btn_Set:function(){

    },

    Btn_Record:function(){
        this.win_record.active = true;
    },

    Btn_Life:function(){
        this.win_life.active = true;
    },

    Btn_Member:function(){
        this.win_member.active = true;
    },

    Btn_Create:function(){
        this.win_create.active = true;
    },

    Btn_Enter:function(){
        this.win_enter.active = true;
    },   

    Btn_Shop:function(){
        //global.PopWinTip(2,'暂未开放，敬请期待');  
        this.win_shop.active = true;   
    },

    MsgHandle:function(data){
       // cc.log(data);
        if(data[4]!=null) {
            //错误处理
            switch(data[4]){
                case 'MUST_BE_QUIT':
                    global.socket.SendMsg(3005);
                   // cc.log('--------------');
                    break;
            }
            this.ErrorTip(data[4]);
            return;
        }
        switch(data[0]){            
            case 3002:    //创建一个房间
            if(data[1]==null ){
               // this.ErrorTip(data[4]);
            }else{
                //cc.log(data);
                global.GetRoomInfo(data[1][0]);
                //global.GetRoomInfo(data[3][0]);
                global.playerinfo =new Array();               
                global.playerinfo.push( global.GetPlayerInfo(data[1][1]));
                
                this.LoadGame();
                //cc.director.loadScene('table');    
            }
            break;
            
            case 3008:     //加入一个房间
                //cc.log(data);  
               
                // channel_id:"00163efffe05ec3f-00001da5-0000002b-7b770307ff392e9d-b325edbe"
                // group_id:"557177"
                // group_name:"房间名1503027526154"
                // group_status:0
                // offline_time:null
                // seat: 1               
                // status:0
                // user_id:"9c012a33aa8b4ecc8aaf20ea149a6f25"
                // user_name:"mega"
                if(data[1]==null ){
                    this.ErrorTip(data[4]);
                }else{
                    global.playerinfo =new Array();
                    global.GetRoomInfo(data[1][0]);
                    for(let i in data[1][1]){
                        var player =global.GetPlayerInfo(data[1][1][i]);
                        // if(player.headurl !== null)
                        //     player.headurl = "http://"+global.socket.URL+"/client/user/avatar?id="+player.id;
                        global.playerinfo.push( player);  
                    }
                        
                    this.LoadGame();
                    //cc.director.loadScene('table');    
                }
            break;

            case 3006:
            break;

            case 3010://代开模式
                this.win_create.active =false;

                if(data[1]==null ){
                    this.ErrorTip(data[4]);
                }else{
                    global.PopWinTip(2,'房间已创建,密码'+ data[1][0]);
                }
            break;
        
            default:           
            break;          
        }        
    },

    LoadGame:function(){
        this.loadscene.active = true;
        this.loadprog.progress=0;

        var self = this;
        cc.loader.onProgress = function (completedCount, totalCount, item) {            
          
           self.loadprog.progress =  ( completedCount / totalCount ).toFixed(2);           
          // cc.log(self.loadprog.progress + '%');
        }
        cc.director.preloadScene('table', function () {    
            cc.loader.onProgress = null;       
            self.loadscene.active = false; 
            cc.director.loadScene('table');
        });
    },

    CloseSocket:function(){       
        global.PopWinTip(2,'与服务器的联接已断开', function(){
            cc.director.loadScene('login');
        });         
    }, 
    
    ErrorTip:function(code){
        var msg ='';
        switch(code){
            case 'invalid_user_id'://   
                msg ='无效的账号信息';
                break;
            case 'exist_user_seat'://   
                msg ='该账号已经在另一个房间中使用';
                break;
            case 'invalid_params'://    
                msg ='无效的参数';
                break;
            case 'group_user_quit'://      
                msg ='用户已经退出，不需要在退出';     
                break;      
            case 'exists_user'://   
                msg = '用户已存在';  
            break;          
            case 'non_existent_group':// 
                msg = '房间不存在或已关闭'; 
                break;          
            case 'full_group'://  
                msg ='房间已满员'; 
                break;        
            default:
                msg =code;   
        }
       
        global.PopWinTip(2,msg);         
    },

    //购买元宝
    Btn_PayProduct:function(event,customEventData){
        if(!cc.isValid(global.anysdk)){
            global.PopWinTip(2,'目前无法使用支付系统');
            return;
        }
        
        //global.anysdk.payForProduct(customEventData+'','gold','0.01',global.selfinfo.id+'',global.selfinfo.nickname+'','0');        
        
    },  
    //支付事件
    IapEvent:function(event){
        var msg = event;
        switch(msg.type){
            case 'pay'://支付一个商品
            //this.testlabel.string = '---'+ msg.goods_id+'---'+ msg.goods_name+'---'+ msg.goods_price+'---'+ msg.user_id+'---'+ msg.user_nick+'---'+ msg.user_gold+'---'+ msg.user_vip;
            break;

            case 'kPaySuccess'://支付成功  //进入等待服务器确认支付
                this.win_shop.active = false;               
                global.PopWinTip(2,'支付成功,正在等待服务器发放商品...');
                //超时处理
            break;
             case 'kPayFail1':
                this.win_tip.active = true;
                global.PopWinTip(2,'支付失败');
            break;
            case 'kPayFail2':
                this.win_tip.active = true;
                global.PopWinTip(2,'支付系统网络异常,请稍侯再试');
            break;
            case 'kPayFail3':
                this.win_tip.active = true;
                global.PopWinTip(2,'购买的商品信息可能已下架或信息不完整,请购买其它商品');
            break;
            case  'kPayNowPaying'://支付进行中
                this.win_tip.active = true;
                global.PopWinTip(2,'一个已启用的支付订单正在处理中');
            break;
        }
    },

});
