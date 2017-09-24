var Global = function(){  

}
    Global.prototype.ver =105;
    //  玩家数据类  
    Global.prototype.selfinfo = null;
    Global.prototype.roominfo = null;
    Global.prototype.playerinfo =null;
   
    Global.prototype.socket = null;
    Global.prototype.anysdk = null;
    Global.prototype.ac = null;

    Global.prototype.bgmid=0;
    Global.prototype.vol_music=0.7;
    Global.prototype.vol_sound=1;

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
        player.bet=[0,0,0,0,0];

        player.headimg = null;

        //cc.log(player.headurl);
        if(player.headurl !== null)
            this.GetPlayerHeadImg(player); 
        
        return player;
    }

    Global.prototype.GetPlayerByID = function(id){

        for(let i in this.playerinfo){
            if(this.playerinfo[i].id == id)
                return this.playerinfo[i];
        }
        return null;
    }

    Global.prototype.GetPlayerBySeat = function(seat){
        for(let i in this.playerinfo){
            if(this.playerinfo[i].seat == seat)
                return this.playerinfo[i];
        }
        return null;
    }

    Global.prototype.GetPlayerHeadImg = function(player){

        var id = player.id;
        var self = this;
        //var remoteUrl ="http://118.190.149.221/client/user/avatar?id="+id;
        var remoteUrl ="http://"+self.socket.URL+"/client/user/avatar?id="+id;

        //var frame= null;
        // cc.loader.onProgress = function (completedCount, totalCount, item) { 
        //      var progress =0;
        //      progress =  ( (completedCount+1) / (totalCount+1) ).toFixed(2);
        //      cc.log(progress + '%');
        //  }
        //cc.log(remoteUrl);
        cc.loader.load({url: remoteUrl, type: 'jpg'}, function (err,tex) {          
            if(!err){                
               player.headimg = new cc.SpriteFrame(tex);   
               //cc.log('---头像加载完了');             
               //return frame;
            }else{
                //cc.log(err);
                player.headimg= null;
               // return null;
            }
        });   
       // return frame;
    }

    //弹出窗口管理------------------
    Global.prototype.PopWinTip=function(type,msg,callback){
        
        if(!this.wintip)  return;
        this.wintip.active = true;
        this.wintip.emit('settip',{type:type,msg:msg,callback:callback });
    }



module.exports = new Global();
