var Global = function(){  

}

    //  玩家数据类  
   
   
    Global.prototype.socket = null;
    Global.prototype.anysdk = null;

    Global.prototype.wintip = null;
    //场景管理类-------------------  
    // var game=null;//游戏主控
    // var broad =null;//公告
    // var ac = null;//音频

    //弹出窗口管理------------------
    Global.prototype.PopWinTip=function(type,msg,callback){
        if(!this.wintip)  return;
        this.wintip.active = true;
        this.wintip.emit('settip',{type:type,msg:msg,callback:callback });
    }



module.exports = new Global();
