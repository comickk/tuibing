cc.Class({
    extends: require("PopWin"),

    properties: {
       
        view:cc.ScrollView,
        chat:cc.Label,

        input:cc.EditBox,
        
    },

    // use this for initialization
    onLoad: function () {
        this._super();

        this.node.on('chat',this.AddChatLine,this);
    },

    AddChatLine:function(event){
        var msg = event.msg;

        this.chat.string += msg+ '\r\n';

        if(this.chat.node.height > this.view.node.height)
            this.view.scrollToBottom(0.1);
    },   

    Btn_Send:function(){
        if(this.input.string.length >0){
           // cc.log(this.input.string);
            //
           // this.node.emit('chat',{msg:this.input.string});
           require('Global').socket.SendMsg(2003,this.input.string);

            this.input.string ='';

            // $('#send_all').click(function(){
            //     var p = [
            //       102,
            //       2003,
            //       Math.random() * 1000,
            //       new Date().getTime(),
            //       $('#msg_all').val(),
            //       null,
            //     ];
            //     socket.send(JSON.stringify(p));
            //   });
            
            //   var back_id;
        }
    }
});
