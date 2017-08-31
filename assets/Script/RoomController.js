var global = require('Global'); 
cc.Class({
    extends: require("Controller"),

    properties: {
       
        playernick:cc.Label,
        playergold:cc.Label,

        popbg:cc.Node,
        win_create:cc.Node,
        win_enter:cc.Node,
        win_record:cc.Node,
        win_life:cc.Node,
        win_member:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.popbg.on('touchend',function(){event.stopPropagation();});  

        global.socket.controller = this;
        
        this.playernick.string = global.selfinfo.nickname;
        this.playergold.string ='0';
    },

    Btn_Back:function(){
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

    MsgHandle:function(data){
        cc.log(data);
        switch(data[0]){            
            case 3002:    //创建一个房间
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
                if(data[3]==null ){
                    this.ErrorTip(data[4]);
                }else{
                    global.playerinfo = data[3][0];
                    global.roominfo = data[3][1];
                    cc.director.loadScene('table');    
                }
            break;

            case 3006:
            break;
        
            default:           
            break;          
        }        
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

    CloseSocket:function(){
        cc.log('socket close');
    },
});
