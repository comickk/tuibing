cc.Class({
    extends: cc.Component,

    properties: {
      win_chat:cc.Node,

      chat_tip:[cc.Node],

      game:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        this.node.on('chat',function(event){
            var msg ='';
            var nick ='';
            var seat =1;

            msg =event.msg;
            nick = event.nick;
            seat = event.seat;

            this.win_chat.emit('chat',{msg:nick+':'+msg});

            if(seat == null) seat =0;
            this.chat_tip[seat].opacity =255;
            this.chat_tip[seat].children[0].getComponent(cc.Label).string = msg;
            this.scheduleOnce(function(){
                this.chat_tip[seat].opacity = 0;
            },5)

        },this);
    },

    Btn_Chat:function(){
        this.win_chat.active= true;
    },
});
