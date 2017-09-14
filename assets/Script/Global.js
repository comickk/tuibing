var Global = function(){  

}
    Global.prototype.ver =104;
    //  玩家数据类  
    Global.prototype.selfinfo = null;
    Global.prototype.roominfo = null;
    Global.prototype.playerinfo =null;
   
    Global.prototype.socket = null;
    Global.prototype.anysdk = null;
    Global.prototype.ac = null;

    Global.prototype.wintip = null;
    //场景管理类-------------------  
    // var game=null;//游戏主控
    // var broad =null;//公告
    // var ac = null;//音频

    Global.prototype.GetRoomInfo = function(data){
      
        var room = {};
        var i=0;
        room.id = data[i++];
        room.name = data[i++];
        room.fund = data[i++];
        room.round_count = data[i++];
        room.visitor_count = data[i++];        // 游客人数
        room.banker_seat = data[i++];          // 当前庄家座位
        room.round_no_first_seat = data[i++];  // 庄家摇骰子确定第一个起牌的人
        room.round_pno = data[i++];            // 当前第n局
        room.round_no = data[i++];             // 当前第n把
        room.ready_count= data[i++];          // 举手人数
        room.act_status= data[i++];
        room.act_seat= data[i++];
        
        room.curr_fund=0;   //当前基金数

        this.roominfo = room;
    }

    Global.prototype.GetPlayerInfo = function(data){
        var player = {};
        var i=0;
        player.id = data[i++];
        player.seat = data[i++];
        player.nick = data[i++];
        player.headurl = data[i];
        player.score = 0;
        player.score_count=0;
        player.bet=0;
        return player;
    }

    //弹出窗口管理------------------
    Global.prototype.PopWinTip=function(type,msg,callback){
        if(!this.wintip)  return;
        this.wintip.active = true;
        this.wintip.emit('settip',{type:type,msg:msg,callback:callback });
    }



module.exports = new Global();
