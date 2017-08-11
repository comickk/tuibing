function gamesocket(){
    //extends: cc.Component,


}
   //gamesocket.prototype.URL = '192.168.2.77';//'118.190.89.153';

    gamesocket.prototype.URL = '118.190.89.153';
    gamesocket.prototype.ws=null;
    gamesocket.prototype.controller =null;
    gamesocket.prototype.testid = 0;
    gamesocket.prototype.MsgHandle = null;
    
    gamesocket.prototype.block = false;
    gamesocket.prototype.ping =0;

    gamesocket.prototype.Init = function( server,code  ){
        var self =this;
        this.ws = new WebSocket('ws://'+ this.URL+'/s/'+server+'/');     
      
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = function(evt){
         
            var p = {
                version: 102,
                seqId: Math.random() * 1000,
                timestamp: new Date().getTime(),
                data: JSON.stringify({
                    code: code
                })
            };
           this.send(JSON.stringify(p));

           //this.Test();心跳测试
           var that = this;
           this.testid = setInterval(function(){
                var p = {
                    version: 102,
                    method: 666,                       
                    seqId: Math.random() * 1000,
                    timestamp: new Date().getTime(),                     
                };
                that.send(JSON.stringify(p));
                //console.log(p.timestamp);      
            },9000);   

           // console.log(this.ws);
        };

        this.ws.onmessage = function(evt)
        {
            var data = evt.data;
            var type = typeof data;

            data = JSON.parse(data);
          
            if(self.ping == 0 )
                self.ping = new Date().getTime()-data.timestamp;
            else{
                var now_ping =new Date().getTime()-data.timestamp;

              
                if(self.ping < now_ping)
                    self.ping = now_ping;
                // else{
                //      console.log('ping = '+ (self.ping - now_ping));
                //     if(self.ping - now_ping > 300)
                //         self.ws.close();
                // }
            }

            if( self.controller != null && !self.block)
                self.controller.MsgHandle(data);  
        };

        this.ws.onclose = function(evt){
            console.log('client notified socket has closed.', evt);
              clearInterval( this.testid);
            self.controller.CloseSocket();
        };     

        return this;  
    }

    gamesocket.prototype.SendMsg = function(type,data,backid){
        var p = {
            version: 102,
            method: type,
            seqId: Math.random() * 1000,
            timestamp: new Date().getTime()           
        };
        if(data) p.data = data;
        if(backid) p.backendId = backid;
        this.ws.send(JSON.stringify(p));
    }

    gamesocket.prototype.Close = function(){
         this.ws.close();      
    }
  
    gamesocket.prototype.MsgToObj = function( data  ){
        var obj = {};

		for( let i =0 ;i<data.length;i++)
            obj[data[i]] = data[++i]; 
        
        return obj;
    }

    gamesocket.prototype.Test = function(){

        setInterval(function(){
             var p = {
                version: 102,
                method: 666,                       
                seqId: Math.random() * 1000,
                timestamp: new Date().getTime(),                     
            };
            this.ws.send(JSON.stringify(p));
            console.log(p.timestamp);      

        },5000);           
    }

var gs = new gamesocket();  
module.exports =gs;
//module.exports =gs.Init();
