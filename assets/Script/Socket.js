 
function gamesocket(){}
    
    //gamesocket.prototype.URL = '192.168.2.77';     //内测服
    //gamesocket.prototype.URL = '118.190.89.153';  //测试服
    gamesocket.prototype.URL = '118.190.149.221';  // 正式服
    gamesocket.prototype.ws=null;   
    gamesocket.prototype.controller =null;
    gamesocket.prototype.heartid = 0;
    gamesocket.prototype.selfclose= false;  
    
    gamesocket.prototype.block = false;
    gamesocket.prototype.ping =0;

    gamesocket.prototype.Init = function( server,code  ){
        var self =this;
        if(this.ws) this.ws = null;
        this.ws = new WebSocket('ws://'+ this.URL+'/s/'+server+'/');     
      
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = function(evt){
         
            var p = [
                105,
                1,
                Math.random() * 1000,
                new Date().getTime(),
                JSON.stringify({  code: code  }),
                null
            ];
           this.send(JSON.stringify(p)); 
         
           //开启心跳检测
           self.heartid = self.HeartTest();
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
            clearInterval( self.heartid);
            
            //self.controller.CloseSocket();

            if(!self.selfclose)//          非正常断线提示 
                 self.controller.CloseSocket();
            //else            //  非正常断的，重联
            //     self.controller.ResConnect();

             self.selfclose = false;
        };     

        this.ws.onerror = function(evt){
            cc.log('------socket error---------');            
        };

        return this;  
    }

    gamesocket.prototype.SendMsg = function(type,data,backid){
        // var p = {
        //     version: 102,
        //     method: type,
        //     seqId: Math.random() * 1000,
        //     timestamp: new Date().getTime()           
        // };
        var p = [
            104,
            type,
            Math.random() * 1000,
            new Date().getTime(),
            null,
            null           
        ];
        if(data) p[4] = data;
        //if(backid) p.backendId = backid;
        this.ws.send(JSON.stringify(p));
    }

    gamesocket.prototype.Close = function( isself){
        this.selfclose = isself;
        this.ws.close();
        //console.log('--清空消息队列--');
        //   this.msglist.splice(0,this.msglist.length);
    }    

    gamesocket.prototype.ClearMsg = function(){
            this.ws.close();
    }   
   
    gamesocket.prototype.MsgHandle = null;
    // gamesocket.prototype.MsgHandle = function(ttt,data){
    //     ttt(data);
    // }
    gamesocket.prototype.MsgToObj = function( data  ){
        var obj = {};

		for( let i =0 ;i<data.length;i++)
            obj[data[i]] = data[++i]; 
        
        return obj;
    }

    gamesocket.prototype.HeartTest = function(){

        var self = this;
        var id = setInterval(function(){
             var p = [
                104,
                666,                       
                Math.random() * 1000,
                new Date().getTime() ,
                null,
                null                    
             ];
            //  var p = {
            //     version: 102,
            //     method: 666,                       
            //     seqId: Math.random() * 1000,
            //     timestamp: new Date().getTime(),                     
            // };
            self.ws.send(JSON.stringify(p));
            //console.log(p.timestamp);     
        },5000);       
        
        return id;
    }

var gs = new gamesocket();  
module.exports =gs;
