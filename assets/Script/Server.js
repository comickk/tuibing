cc.Class({
    extends: cc.Component,

    properties: {
        _CARD:[],
    },

    // use this for initialization
    onLoad: function () {
       
    },

    //生成一幅随机牌
    CreateCards:function(){//num =36  不带白板 40带白板     
        //----------
        var num =36;
        //----------
        var cards=[];
        var p =1;
        for(let i = 0;i<num;i+=4)
            cards[i]= cards[i+1] = cards[i+2] =cards[i+3] =p++;
        

        var max = num-1;
        for(let i = 0;i<num;i++){
            let r  = Math.round(Math.random()*max);            
            p = cards[r];
            cards[r] = cards[max]; 
            cards[max--] =p;
        }
        cc.log(cards);
        return cards;
    },

    //取得牌的点数
    GetPoint:function(c1,c2){
        var p = 0;
        if(c1 != c2) p = (c1+c2)%10;
        else  p = 10+c1;

        return p;
    },
    //比大小
    CompareCard:function(cards){//这一次比较的牌（8张）//  第一个和庄家比的人的位置  
        var playerpoint=[];
        var seat =1;

        for(let i =0;i<cards.length;i+=2){
            playerpoint[seat-1] = this.GetPoint(cards[i],cards[i+1]);

            //顺时针
            if( ++seat  > 4)    seat =1;
            //逆时针
            //if( --seat < 0 )    seat =4;
        }
        
        return playerpoint;//返回每个座位的点数大小
    },
     
    //VIP 千术 
                   //此次的牌[8] //点数结果[4], //玩家下注数[4]  //庄家位置  //VIP位置 //赢的分 //输的分  // 设定的比率  //出千模式 （0-无出千  1-秒赢模式  2-概率模式）   
    VIPCheat:function(cards,    playerpoint,   playerbet,      anker,     vip,      win,      lose ,   rate,         mode){
       
        if(mode ==0 ) return cards;

        if(mode ==1){
            //预计算本次输赢
            var bill=0;
            if(banker != vip){
                if(playerpoint[banker-1] > playerpoint[vip-1])
                    bill -= playerbet[vip-1];
            }else{
                for(let i = 0;i<playerpoint.length;i++){
                    if(i == vip-1 ) continue;
                    if(playerpoint[i] > playerpoint[vip-1])
                        bill -= playerbet[i];
                }
            }

            //计算此局赔付后 VIP的盈亏率是否超出设定值 
            if( (win+ bill)/lose > rate ) return cards;
        }
        
         var maxseat =0;
        if(banker == vip){//VIP为庄家时 与 所有人中最大的牌交换
             // //取最大值           
            for(let i = 1;i<playerpoint.length;i++)
                if(playerpoint[maxseat] < playerpoint[i]) 
                    maxseat = i;   
        }else{//不为庄时仅交换庄家的牌
           maxseat = banker;
        }
        
        var c1 =  cards[(maxseat-1)*2];
        var c2 =  cards[(maxseat-1)*2+1];
        cards[(maxseat-1)*2] = cards[(vip-1)*2];
        cards[(maxseat-1)*2+1] = cards[(vip-1)*2+1];
        cards[(vip-1)*2] = bc1;
        cards[(vip-1)*2+1] = bc2;

        return cards;//返回调换后的牌
    },

    //结算结果 (仅某闲家和庄家单独比较)
    Checkout:function(playerpoint,playerbet,playergold,banker,playerseat){ //点数结果, //玩家下注数 //玩家元宝数 //庄家位置 //比较的闲家位置
        var result={};
        
        if(playerpoint[ playerseat-1 ] > playerpoint[banker-1]){//玩家点数大于庄家
            
            if(playerpoint[ playerseat-1 ]>10){ //是否为对
                if( playergold[ playerseat-1 ] <1 )  //是否有元宝
                    result.score =0;              
                else{
                    result.score =  playerbet[ playerseat-1 ];
                    result.goldseat = playerseat;
                }
            }else
                 result.score =  playerbet[ playerseat-1 ];
            
        }else{
             if(playerpoint[ banker-1 ]>10){
                 if( playergold[ banker-1 ] <1 )  //是否有元宝
                    result.score =0;              
                else{
                    result.score =  -playerbet[ playerseat-1 ];
                    result.goldseat = banker;
                }
             }else
                result.score = -playerbet[ playerseat-1 ];             
        }      
            
        return result; 
        //----result 返回值 说明-------
        //result.score 两人输赢分 ，庄家分   -= result.score    闲家分 += result.score 
        //result.goldseat 若存在，表示要扣除元宝的人的座位，数量为 1
    },  

});
