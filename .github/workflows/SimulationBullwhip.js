// JavaScript Document





var bannerDict = [["Materials","原材料"],["Material Dealer","材料经销商"],["Component Maker","原件制造商"],["Product Maker","成品制造商"],["Dealer","批发商"],["Retailer","零售商"],["Consumers","消费者"],["",""],["",""],["",""],["Year ","第"],["   Month ","年"],["","个月"],["Min Order Qty","最小订购量"],["Daily Capacity","每天容量"],["Lead Time(day)","订单提前期（天）"],["Re-Order Level","目标库存"],["Plan Period(days)","计划周期（天）"],["Stock ","库存 "],["d","天"],["New Order","发出新订单"],["UNSTABLE","特发事件"],["out","出库"],["in","入库"],["Re-Order Point","目标库存"],["Economic Cycle:","经济周期"],["Currently GROW","现阶段：增长"],["Currently TOP","现阶段：顶峰"],["Currently DECLINE","现阶段：下滑"],["Currently BOTTOM","现阶段：低谷"],["","每"],["Effect: ","影响："],["Unpredictable Event:","特殊事件："],["Time: ","时间："],["Unexpected Event","特殊事件"],["Happening Demand Up","需求上升"],["Happening Demand Drop","需求下跌"],[" days ago","天之前开始"],["From ","由"],["In trouble: ","问题单位："],["",""],["Peak Effect/day ","最高影响/每天 "],["Ended (Period: ","结束：（历时"],["Peak Effect: ","最高影响幅度："],["",""],[" Units"," 件"],["Day: ","天数："],["Consume: ","单日消耗："],["Play Speed","模拟速度"],["Sec/yr","秒/年"],["Daily Fluctuate","每天波动幅度"],["Seasonal Effect","季节影响"],["Market Trend","需求趋势"],["/yr","每年"],["SHORTAGE","缺 货"],[" Years"," 年"],[" days)","天）"],["<< Close Window","<< 关闭模拟"],["English>>中文","中文>>English"],["+","+"],["-","-"],["Fast","加快"],["Slow","减慢"]]
var averageDemand = 10;
var traders = [bannerDict[0][thisLang],bannerDict[1][thisLang],bannerDict[2][thisLang],bannerDict[3][thisLang],bannerDict[4][thisLang],bannerDict[5][thisLang],bannerDict[6][thisLang]];
var stock = [10000000,220,200,250,120,90,averageDemand];
var preStock = [10000000,50,50,50,50,50,averageDemand];
var netStock = [0,0,0,0,0,0,0];
var qtyOrderIn = [];
var	qtyOrderOut = [];
var MOQ = [30,30,30,30,10,1,1];
var LeadTime = [30,21,18,15,8,1,1];
var dCap = [25,40,25,30,40,40,-1];
var ReOrderlvl = [30,30,30,30,80,80,-1];
var PlanPeriod = [3,16,10,7,3,1,1];
var shipQty = [];
var econCycleYr = 10;
var econEffect = 0.2;
var tmpValue = 0;
var tmpEconPhase = 0;
var accProb = .15;
var accidentStart = 0;
var accidentPeriod = 0;
var accidentState = 0;
var accidentMaxEf = 2;
var accidentCount = 0;
var accidentPeak = 0;
var chainBreakDown = -1;
var chainBreakStart = 0;	
var chainBreakPeriod = 0;
var chainBreakScale = 1;
var lastBreakScale = 0;
var orders = [];
var running = true;
var seasonalRange = 0.3;
var fluctuateRange = 0.7
var demandChange = 0;
var dayConsume = 0;
var simInterval = 20;
var framesPerDay = 16;
var shadowWidth = 3;
var stockColor = "orange"
var shadowColor = "#B0B0B0";
var simFrameNo = 0;
var shortage = false;
var myButton = [];

function startSimulate() {
	tmpValue = Math.random();
	tmpEconPhase = tmpValue;
	tmpValue = Math.random();
	myButton.push([57,2,225,135,40,"blue","15px Aerial","white","center",15,0]);
	myButton.push([58,2,270,135,40,"blue","15px Aerial","white","center",15,0]);
	myButton.push([59,4,111,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([60,120,111,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([59,4,138,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([60,120,138,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([59,4,191,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([60,120,191,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([61,(traders.length-1)*(traderWidth+traderGap)-137,123,30,20,"blue","12px Aerial","white","center",6,0]);
	myButton.push([62,(traders.length-1)*(traderWidth+traderGap)-38,123,30,20,"blue","12px Aerial","white","center",6,0]);
	myButton.push([59,(traders.length-1)*(traderWidth+traderGap)-132,168,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([60,(traders.length-1)*(traderWidth+traderGap)-35,168,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([59,(traders.length-1)*(traderWidth+traderGap)-132,213,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([60,(traders.length-1)*(traderWidth+traderGap)-35,213,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([59,(traders.length-1)*(traderWidth+traderGap)-132,255,20,20,"blue","18px Aerial","white","center",4,0]);
	myButton.push([60,(traders.length-1)*(traderWidth+traderGap)-35,255,20,20,"blue","18px Aerial","white","center",4,0]);
	for (i=1;i<traders.length-1;i+=1){
		ReOrderlvl[i] = Math.round(averageDemand*1.2*(Math.max(LeadTime[i-1]-LeadTime[i]) + PlanPeriod[i]));
		myButton.push([59,i*(traderWidth+traderGap)-(traderWidth+traderGap)*.25-42,stockShowMax+72,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([60,i*(traderWidth+traderGap)-(traderWidth+traderGap)*.25+12,stockShowMax+72,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([59,i*(traderWidth+traderGap)-(traderWidth+traderGap)*.25-42,stockShowMax+112,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([60,i*(traderWidth+traderGap)-(traderWidth+traderGap)*.25+12,stockShowMax+112,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([59,i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25-42,stockShowMax+54,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([60,i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25+12,stockShowMax+54,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([59,i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25-42,stockShowMax+83,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([60,i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25+12,stockShowMax+83,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([59,i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25-42,stockShowMax+112,30,15,"blue","18px Aerial","white","center",0,0]);
		myButton.push([60,i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25+12,stockShowMax+112,30,15,"blue","18px Aerial","white","center",0,0]);
	}
	

    mySimulateArea.start();
}

var mySimulateArea = {
    canvas : document.createElement("canvas"),

    start : function() {
        this.canvas.width = (traders.length-1)*(traderGap+traderWidth);
        this.canvas.height = stockShowMax+130;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateSimulateArea, simInterval);
		if (isCapturing == true) {   // for capturing
			myCapturer.start();   // for capturing
		}   // for capturing
    },
	clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
}

function econCycleFactor () {
   return Math.sin(
	   (Math.min(         .4,tmpEconPhase) * .25 / 0.4 + 
		Math.max(Math.min(.2,(tmpEconPhase)-.4),0) *.5 / .2 + 
		Math.max(Math.min(.4,(tmpEconPhase)-.6),0) * .25 / .4
	   )*Math.PI*2);
}	

function chainBreak(traderCode) {
	if (chainBreakDown == traderCode) {
		return chainBreakScale;
	} else {
		return 1;
	}
	
}


    // Add event listener to canvas element
mySimulateArea.canvas.addEventListener('click', function(event) {
      // Control that click event occurred within position of button
      // NOTE: This assumes canvas is positioned at top left corner 
	for (j=0; j<myButton.length; j+=1){
      if (event.x+window.pageXOffset-10 > myButton[j][1] && event.x+window.pageXOffset-10 < myButton[j][1] + myButton[j][3] && event.y+window.pageYOffset-10 > myButton[j][2] && event.y+window.pageYOffset-10 < myButton[j][2] + myButton[j][4]) {
        // Executes if button was clicked!
		myButton[j][10] = simInterval * mySimulateArea.frameNo;
		if (j == 0) {
        	window.close();
		} else if (j == 1){
			if (thisLang == 0) {thisLang = 1;} else {thisLang = 0;}
			traders = [bannerDict[0][thisLang],bannerDict[1][thisLang],bannerDict[2][thisLang],bannerDict[3][thisLang],bannerDict[4][thisLang],bannerDict[5][thisLang],bannerDict[6][thisLang]];
		} else if (j == 2){
			econCycleYr = Math.max(econCycleYr + 1,1);
		} else if (j == 3){
			econCycleYr = Math.max(econCycleYr - 1,1);
        } else if (j == 4){
			econEffect = Math.max(econEffect + .1,0);
        } else if (j == 5){
			econEffect = Math.max(econEffect - .1,0);
        } else if (j == 6){
			accProb = Math.max(accProb + .05,0);
        } else if (j == 7){
			accProb = Math.max(accProb - .05,0);
        } else if (j == 8){
			if (framesPerDay>1){ framesPerDay /= 2; simFrameNo /= 2; simFrameNo = Math.floor(simFrameNo);}
		} else if (j == 9){
			if (framesPerDay<128){ framesPerDay *= 2; simFrameNo *= 2;}
        } else if (j == 10){
			fluctuateRange = Math.min(fluctuateRange+.1,1);
        } else if (j == 11){
			fluctuateRange = Math.max(fluctuateRange-.1,0);
        } else if (j == 12){
			seasonalRange = Math.min(seasonalRange+.1,1);
        } else if (j == 13){
			seasonalRange = Math.max(seasonalRange-.1,0);
        } else if (j == 14){
			demandChange += .1;
        } else if (j == 15){
			demandChange -= .1; if (demandChange<-.9) {demandChange = -.9;}
        } else if (j > 15){
			tmpValue = Math.floor((j-16)/10)+1;
			switch ((j-16)%10){
			  case 0:
    			ReOrderlvl[tmpValue] += 1;
				break;
			  case 1:
    			ReOrderlvl[tmpValue] -= 1;
				break;
			  case 2:
    			PlanPeriod[tmpValue] += 1;
				break;
			  case 3:
    			PlanPeriod[tmpValue] = Math.max(1,PlanPeriod[tmpValue] -1);
				break;
			  case 4:
    			MOQ[tmpValue] += 1;
				break;
			  case 5:
    			MOQ[tmpValue] = Math.max(1,MOQ[tmpValue] -1);
				break;
			  case 6:
    			dCap[tmpValue] += 1;
				break;
			  case 7:
    			dCap[tmpValue] = Math.max(1,dCap[tmpValue] -1);
				break;
			  case 8:
    			LeadTime[tmpValue] += 1;
				break;
			  case 9:
    			LeadTime[tmpValue] = Math.max(1,LeadTime[tmpValue] -1);
			
        }
		}	  
	}
	}});



function updateSimulateArea() {
	ctx = mySimulateArea.context;
	ctx.fillStyle = "#F5F5F5";
	ctx.fillRect(0,0,mySimulateArea.canvas.width,mySimulateArea.canvas.height);
	dayCount = Math.floor(simFrameNo/framesPerDay);
	if (dayCount == simFrameNo/framesPerDay) {
	   tmpEconPhase = (tmpEconPhase + 1/econCycleYr/365.25) % 1;
		
	   if (Math.random()< accProb *.0105 && chainBreakDown == -1) {
			chainBreakDown = Math.floor(Math.random() * (traders.length-1));
		    chainBreakScale = Math.random();
		    if (chainBreakScale <.9){
			  chainBreakStart = dayCount;
			  chainBreakPeriod = Math.random()*85+5;
			  lastBreakScale = chainBreakScale;
		      accidentCount  += 1;
		      } else {chainBreakScale = 1; chainBreakDown = -1}
	   		} 	
	   else {
			if (dayCount > chainBreakStart+chainBreakPeriod/3 && dayCount < chainBreakStart+chainBreakPeriod){
			    chainBreakScale = chainBreakScale + (1-chainBreakScale)*(1/Math.max(1,chainBreakStart+chainBreakPeriod-dayCount));
		        }
			if (chainBreakScale>.95 || dayCount > chainBreakStart+chainBreakPeriod){chainBreakScale = 1; chainBreakDown = -1}
		}			
		
		
		
	   if (Math.random()< accProb *.0105) {
			accidentState = (Math.random()-.5)*2*accidentMaxEf;
		    if (Math.abs(accidentState)>.1){
		      accidentPeak = 0;
			  accidentStart = dayCount;
			  accidentPeriod = Math.random()*85+5;
		      accidentPeak = accidentState;
		      accidentCount  += 1;
		      } else {accidentState=1;}
	   		} 	
	   else {
			if (dayCount > accidentStart+accidentPeriod/2 && dayCount < accidentStart+accidentPeriod){
			    accidentState = accidentState * (1 -(1/Math.max(1,accidentStart+accidentPeriod-dayCount)));
		        }
			if (Math.abs(accidentState)<.05 || dayCount > accidentStart+accidentPeriod){accidentState = 0;}
		}	
       averageDemand = averageDemand * Math.pow(1+demandChange, (1/365.25));
	   dayConsume = Math.round(Math.max(0,
			averageDemand 
			* (1 + econCycleFactor() * econEffect)
			* (1 + Math.sin((dayCount/365.25+tmpValue)*2*Math.PI)*seasonalRange) 
			* (1 + (Math.random()*2- 1)*fluctuateRange)
			+ accidentState * averageDemand
			));
		orders.sort();
		for (i=0; i<stock.length; i += 1){
          preStock[i] = stock[i];
		}
		netStock = [0,0,0,0,0,0,0];
		shipQty = [0,0,0,0,0,0,0];
		i=0;
		while (i<orders.length) {
		  netStock[orders[i][0]] -= orders[i][3];
		  netStock[orders[i][1]] += orders[i][3];
		  if (dayCount>=orders[i][2] && Math.min(preStock[orders[i][0]],dCap[orders[i][0]]*chainBreak(orders[i][0]))>shipQty[orders[i][0]]){
			ship = Math.round(Math.min(orders[i][3],preStock[orders[i][0]]-shipQty[orders[i][0]],dCap[orders[i][0]]*chainBreak(orders[i][0])-shipQty[orders[i][0]]));
			shipQty[orders[i][0]] += ship;
			stock[orders[i][0]] -= ship;
		    netStock[orders[i][0]] += ship;
			stock[orders[i][1]] += ship;
		    netStock[orders[i][1]] -= ship;
			orders[i][3] -= ship;
			if (Math.round(orders[i][3])<1){
			  orders.splice(i, 1);
			  i -= 1;
			} 
		  }
		  i += 1;
		} 
		for (i=1; i<traders.length; i += 1){
			netStock[i] += stock[i];
			if (i==traders.length-1){
				    stock[i] -= dayConsume;
				} 
			if (netStock[i]<=ReOrderlvl[i] && dayCount % PlanPeriod[i] == 0){
					orders.push([i-1,i,dayCount+LeadTime[i-1],Math.max(MOQ[i-1],ReOrderlvl[i]-netStock[i])]);
				}
			}
	    }
		
	for (i = 0; i < traders.length; i += 1) {
	  ctx.fillStyle = shadowColor;
      ctx.fillRect(i*(traderWidth+traderGap)-traderWidth/2+shadowWidth, 10+shadowWidth,traderWidth,stockShowMax+28);
	  if (chainBreakDown == i) {
	    ctx.fillStyle = "#999999";
	  } else {
	    ctx.fillStyle = "#CCCCFF";
	  }
      ctx.fillRect(i*(traderWidth+traderGap)-traderWidth/2, 10,traderWidth,stockShowMax+28);
	}
    if(((dayCount+8)/365.25 - Math.floor((dayCount+8)/365.25))*12< 1){
	    ctx.font = "120px Comic Sans MS";
	    ctx.textAlign = "right";
	    ctx.fillStyle = shadowColor;
	    ctx.fillText("SYN",Math.round(mySimulateArea.canvas.width/2-50)+shadowWidth, Math.round((100+mySimulateArea.canvas.height) * (1-((38+simFrameNo/framesPerDay)/365.25*12-Math.floor((38+simFrameNo/framesPerDay)/365.25*12))))+shadowWidth);
	    ctx.fillStyle = "#E0E0E0";
	    ctx.fillText("SYN",Math.round(mySimulateArea.canvas.width/2-50), Math.round((100+mySimulateArea.canvas.height) * (1-((38+simFrameNo/framesPerDay)/365.25*12-Math.floor((38+simFrameNo/framesPerDay)/365.25*12)))));
	    ctx.font = "120px Aerial";
	    ctx.textAlign = "left";
	    ctx.fillStyle = shadowColor;
	    ctx.fillText("ERGY",Math.round(mySimulateArea.canvas.width/2-50)+shadowWidth, Math.round((100+mySimulateArea.canvas.height) * (1-((38+simFrameNo/framesPerDay)/365.25*12-Math.floor((38+simFrameNo/framesPerDay)/365.25*12))))+shadowWidth);
	    ctx.fillStyle = "#E6E6FF";
    	ctx.fillText("ERGY",Math.round(mySimulateArea.canvas.width/2-50), Math.round((100+mySimulateArea.canvas.height) * (1-((38+simFrameNo/framesPerDay)/365.25*12-Math.floor((38+simFrameNo/framesPerDay)/365.25*12)))));
	}
	ctx.font = "90px Aerial";
	ctx.textAlign = "center";
	ctx.fillStyle = shadowColor;
	ctx.fillText(bannerDict[10][thisLang] + Math.floor(dayCount/365.25+1) + bannerDict[11][thisLang] + Math.floor((dayCount/365.25-Math.floor(dayCount/365.25))*12+1)+bannerDict[12][thisLang], Math.round(mySimulateArea.canvas.width/2-50)+shadowWidth, Math.round((100+mySimulateArea.canvas.height) * (1-(simFrameNo/framesPerDay/365.25*12-Math.floor(simFrameNo/framesPerDay/365.25*12))))+shadowWidth);	
	ctx.fillStyle = "#D6D6D6";
	ctx.fillText(bannerDict[10][thisLang] + Math.floor(dayCount/365.25+1) + bannerDict[11][thisLang] + Math.floor((dayCount/365.25-Math.floor(dayCount/365.25))*12+1)+bannerDict[12][thisLang], Math.round(mySimulateArea.canvas.width/2-50), Math.round((100+mySimulateArea.canvas.height) * (1-(simFrameNo/framesPerDay/365.25*12-Math.floor(simFrameNo/framesPerDay/365.25*12)))));	
	ctx.font = "18px Aerial";	
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText(traders[0], 2, 30);
    ctx.font = "12px Aerial";
	ctx.fillText(bannerDict[13][thisLang] , 0, stockShowMax+55);
    ctx.fillText(MOQ[0], 50, stockShowMax+69);
	ctx.fillText(bannerDict[14][thisLang] ,0, stockShowMax+85);
    ctx.fillText(dCap[0], 50, stockShowMax+99);
    ctx.fillText(bannerDict[15][thisLang] , 0, stockShowMax+115);
    ctx.fillText(LeadTime[0], 50, stockShowMax+129);
	
	for (i = 1; i < traders.length; i += 1) {
	  if (i < traders.length-1){
        ctx.fillStyle = "black";
        ctx.font = "18px Aerial";
        ctx.textAlign = "center";
        ctx.fillText(traders[i], i*(traderWidth+traderGap), 30);
        ctx.font = "12px Aerial";
        ctx.textAlign = "center";
        ctx.fillText(bannerDict[16][thisLang], i*(traderWidth+traderGap)-(traderWidth+traderGap)*.25, stockShowMax+68);
        ctx.fillText(bannerDict[17][thisLang], i*(traderWidth+traderGap)-(traderWidth+traderGap)*.25, stockShowMax+110);
        ctx.fillText(ReOrderlvl[i], i*(traderWidth+traderGap)-(traderWidth+traderGap)*.25, stockShowMax+84);
        ctx.fillText(PlanPeriod[i], i*(traderWidth+traderGap)-(traderWidth+traderGap)*.25, stockShowMax+124);
	    ctx.fillText(bannerDict[13][thisLang], i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25, stockShowMax+52);
        ctx.fillText(MOQ[i], i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25, stockShowMax+66);
	    ctx.fillText(bannerDict[14][thisLang], i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25, stockShowMax+81);
        ctx.fillText(dCap[i], i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25, stockShowMax+95);
        ctx.fillText(bannerDict[15][thisLang], i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25, stockShowMax+110);
        ctx.fillText(LeadTime[i], i*(traderWidth+traderGap)+(traderWidth+traderGap)*.25, stockShowMax+124);
	    ctx.fillStyle = shadowColor;
        ctx.fillRect(i*(traderWidth+traderGap)-traderWidth*.3+shadowWidth, stockShowMax+30-preStock[i]+shadowWidth-shipQty[i-1] ,traderWidth*.5, preStock[i]+shipQty[i-1]);
        ctx.fillStyle = stockColor;
        ctx.fillRect(i*(traderWidth+traderGap)-traderWidth*.3, stockShowMax+30-preStock[i] ,traderWidth*.5, preStock[i]-shipQty[i]);	
	  			
	  }
      if (shipQty[i-1]>0){
          ctx.fillStyle = shadowColor;					
          ctx.fillRect(
				(i-1)*(traderWidth+traderGap)-traderWidth*.3+(1+simFrameNo%framesPerDay)/(1+framesPerDay)*(traderWidth+traderGap)+shadowWidth,
				stockShowMax+30-shipQty[i-1]-(Math.sin(((1+simFrameNo%framesPerDay)/(1+framesPerDay)-.5)*Math.PI)/2+.5)*Math.max(0,preStock[i])+shadowWidth,
				traderWidth*.5, shipQty[i-1]);
          ctx.fillStyle = stockColor;					
          ctx.fillRect(
				(i-1)*(traderWidth+traderGap)-traderWidth*.3+(1+simFrameNo%framesPerDay)/(1+framesPerDay)*(traderWidth+traderGap),
				stockShowMax+30-shipQty[i-1]-(Math.sin(((1+simFrameNo%framesPerDay)/(1+framesPerDay)-.5)*Math.PI)/2+.5)*Math.max(0,preStock[i]),
				traderWidth*.5, shipQty[i-1]);
		  
	  }
        ctx.fillStyle = "black";
		if (i < traders.length-1){
          ctx.fillText(bannerDict[18][thisLang] + preStock[i], i*(traderWidth+traderGap)-traderWidth*.05, stockShowMax+35-preStock[i]);
		}
	}
	shortage = false;
	qtyOrderIn = [0,0,0,0,0,0,0];
	qtyOrderOut = [0,0,0,0,0,0,0];
	orders.sort();
	for (i=0; i<orders.length; i+=1) {
		preStock[traders.length-1] = 0;
		qtyOrderOut[orders[i][0]] += orders[i][3];
		qtyOrderOut[0] = 0;
		qtyOrderIn[orders[i][1]] += orders[i][3]; 
		ctx.beginPath();
		ctx.moveTo(orders[i][0]*(traderWidth+traderGap)+traderWidth*.2,stockShowMax+30-qtyOrderOut[orders[i][0]]-shipQty[orders[i][0]]);
		 ctx.lineTo(orders[i][0]*(traderWidth+traderGap)+traderWidth*.2+20,stockShowMax+30-qtyOrderOut[orders[i][0]]-shipQty[orders[i][0]]);
		 ctx.lineTo(orders[i][1]*(traderWidth+traderGap)-traderWidth*.3,stockShowMax+30-qtyOrderIn[orders[i][1]]-preStock[orders[i][1]]-shipQty[orders[i][0]]);
		 ctx.lineTo(orders[i][1]*(traderWidth+traderGap)-traderWidth*.3+traderWidth*.5,stockShowMax+30-qtyOrderIn[orders[i][1]]-preStock[orders[i][1]]-shipQty[orders[i][0]]);
		 ctx.lineTo(orders[i][1]*(traderWidth+traderGap)-traderWidth*.3+traderWidth*.5,stockShowMax+30-qtyOrderIn[orders[i][1]]-preStock[orders[i][1]]+orders[i][3]-shipQty[orders[i][0]]);
		 ctx.moveTo(orders[i][1]*(traderWidth+traderGap)-traderWidth*.3,stockShowMax+30-qtyOrderIn[orders[i][1]]-preStock[orders[i][1]]+orders[i][3]-shipQty[orders[i][0]]);
		 ctx.lineTo(orders[i][1]*(traderWidth+traderGap)-traderWidth*.3,stockShowMax+30-qtyOrderIn[orders[i][1]]-preStock[orders[i][1]]-shipQty[orders[i][0]]);
		 if (dayCount>=orders[i][2]){
			ctx.strokeStyle = "#DD0000";	      		
            ctx.strokeWidth = "3px";
		 }	else {
		    ctx.strokeStyle = "#222222";	      		
            ctx.strokeWidth = "1px";
		 }
		 ctx.stroke();
	     ctx.font = "12px Aerial";
		 ctx.fillStyle = "black"
		 ctx.textAlign = "right"
		 ctx.fillText((orders[i][2] - dayCount) + bannerDict[19][thisLang],orders[i][1]*(traderWidth+traderGap)-traderWidth*.3-2,stockShowMax+30-qtyOrderIn[orders[i][1]]-preStock[orders[i][1]]+orders[i][3]-3-shipQty[orders[i][0]]);
		 if ((dayCount-orders[i][2]+LeadTime[orders[i][0]])<Math.min(700/simInterval/framesPerDay,LeadTime[orders[i][0]]*.2) && orders[i][3]>15){
			 ctx.textAlign = "left";
			 ctx.fillText(bannerDict[20][thisLang],orders[i][1]*(traderWidth+traderGap)-traderWidth*.3+2,stockShowMax+30-qtyOrderIn[orders[i][1]]-preStock[orders[i][1]]+orders[i][3]-3-shipQty[orders[i][0]]);
		 }
		 if (dayCount>=orders[i][2] && orders[i][1]==traders.length-1){
			 shortage = true;
		 }

	}
	for (i=0;i<traders.length-1;i+=1){
		 if (i==0) {
			 if (chainBreakDown == 0) {
		   		ctx.font = "28px Aerial";
		   		ctx.textAlign = "left";
		   		ctx.fillStyle = shadowColor;
		   		ctx.fillText(bannerDict[21][thisLang], 2+shadowWidth, 58+shadowWidth);
		   		ctx.fillStyle = "red";
		   		ctx.fillText(bannerDict[21][thisLang], 2, 58);
		   	} 
		 } else {
		   if (shipQty[i]>0){
			 ctx.beginPath();
			 ctx.moveTo(i*(traderWidth+traderGap)+traderWidth*.2,stockShowMax+30-shipQty[i]);
			 ctx.lineTo(i*(traderWidth+traderGap)+traderWidth*.2+20,stockShowMax+30-shipQty[i]);
			 ctx.lineTo((i+1)*(traderWidth+traderGap)-traderWidth*.3,stockShowMax+30-preStock[i+1]-shipQty[i]);
			 ctx.lineTo((i+1)*(traderWidth+traderGap)-traderWidth*.3+traderWidth*.5,stockShowMax+30-preStock[i+1]-shipQty[i]);
			 if (i<orders.length-2)  {
				 ctx.lineTo((i+1)*(traderWidth+traderGap)-traderWidth*.3+traderWidth*.5,stockShowMax+30-preStock[i+1]);
				 ctx.lineTo((i+1)*(traderWidth+traderGap)-traderWidth*.3+traderWidth*.5-10,stockShowMax+30-preStock[i+1]);
				 ctx.moveTo((i+1)*(traderWidth+traderGap)-traderWidth*.3+10,stockShowMax+30-preStock[i+1]);
				 ctx.lineTo((i+1)*(traderWidth+traderGap)-traderWidth*.3,stockShowMax+30-preStock[i+1]);
				 ctx.lineTo((i+1)*(traderWidth+traderGap)-traderWidth*.3,stockShowMax+30-preStock[i+1]-shipQty[i]);
			 }  
			 ctx.strokeStyle = "black";	      		
			 ctx.strokeWidth = "5px";
			 ctx.stroke();
			 ctx.strokeStyle = "black";	  
			 ctx.font = "18px Aerial";
			 ctx.textAlign = "left";
			 if (i<traders.length-2) {
				 ctx.fillText(bannerDict[22][thisLang],i*(traderWidth+traderGap)+traderWidth*.2+2,stockShowMax+30-shipQty[i]+17); 
				 ctx.textAlign = "right";
				 ctx.fillText(bannerDict[23][thisLang],(i+1)*(traderWidth+traderGap)-traderWidth*.3-2,stockShowMax+30-preStock[i+1]+5);
		     }
		 }
		
		 ctx.beginPath();
		 ctx.moveTo(i*(traderWidth+traderGap)+traderWidth*.2,stockShowMax+30-qtyOrderOut[i]-shipQty[i]);
		 ctx.lineTo(i*(traderWidth+traderGap)+traderWidth*.2+15,stockShowMax+30-qtyOrderOut[i]-shipQty[i]);
		 ctx.lineTo(i*(traderWidth+traderGap)+traderWidth*.2+15,stockShowMax+30-qtyOrderOut[i]-ReOrderlvl[i]-shipQty[i]);
		 ctx.lineTo(i*(traderWidth+traderGap)+traderWidth*.2,stockShowMax+30-qtyOrderOut[i]-ReOrderlvl[i]-shipQty[i]);
		 ctx.strokeStyle = "#0000EE";	      		
         ctx.strokeWidth = "8px";
		 ctx.stroke();
		 ctx.fillStyle = "black";
         ctx.font = "16px Aerial";
		 ctx.textAlign = "left";
	 	 ctx.fillText(bannerDict[24][thisLang],i*(traderWidth+traderGap)+traderWidth*.2,stockShowMax+30-qtyOrderOut[i]-ReOrderlvl[i]-shipQty[i]-2);
		 if (i == chainBreakDown) {
			ctx.font = "28px Aerial";
			ctx.textAlign = "center";
			ctx.fillStyle = shadowColor;
			ctx.fillText(bannerDict[21][thisLang], i*(traderWidth+traderGap)+shadowWidth, 58+1);
			ctx.fillStyle = "red";
			ctx.fillText(bannerDict[21][thisLang], i*(traderWidth+traderGap)+shadowWidth, 58);
		} 
	  }
	}
	
    ctx.font = "18px Aerial";
    ctx.fillStyle = "black";
	ctx.textAlign = "right"
    ctx.fillText(traders[i], i*(traderWidth+traderGap), 30);
    ctx.fillStyle = shadowColor;
    ctx.fillRect(shadowWidth, 60+shadowWidth,traderWidth/2+traderGap/2+20, 160);
    ctx.fillStyle = "#DDDDDD";
    ctx.fillRect(0, 60,traderWidth/2+traderGap/2+20, 160);
    ctx.fillStyle = "black";
    ctx.font = "16px Aerial";
	ctx.textAlign = "left";
    ctx.fillText(bannerDict[25][thisLang], 5, 85);
	if (tmpEconPhase<.43) {
		if (tmpEconPhase<.27) {
		    ctx.fillText(bannerDict[26][thisLang], 5, 105);	
		} else {
		    ctx.fillText(bannerDict[27][thisLang], 5, 105);
		}
	} else {
		if (tmpEconPhase<.57) {
		    ctx.fillText(bannerDict[28][thisLang], 5, 105);	
		} else { if (tmpEconPhase<.73){
		      ctx.fillText(bannerDict[29][thisLang], 5, 105);
		  } else {
			  ctx.fillText(bannerDict[26][thisLang], 5, 105);	
			}
	    }
			   }
	ctx.fillText(bannerDict[30][thisLang] + econCycleYr + bannerDict[55][thisLang], 40, 128);
    ctx.fillText(bannerDict[31][thisLang] + Math.round(econEffect*100) + "%", 33, 155);
    ctx.fillText(bannerDict[32][thisLang], 5, 185);
    ctx.fillText(bannerDict[33][thisLang] + Math.round(accProb*100) + "%", 33, 208);
	if (Math.abs(accidentState) > .1 || chainBreakDown > -1) {
	  if(Math.abs(accidentState) > .1 && chainBreakDown > -1) {
        ctx.fillStyle = shadowColor;
        ctx.fillRect(mySimulateArea.canvas.width-traderWidth/2-traderGap/2-65+shadowWidth, 290+shadowWidth,traderWidth/2+traderGap/2+60, 110);
        ctx.fillStyle = "red";
        ctx.fillRect(mySimulateArea.canvas.width-traderWidth/2-traderGap/2-65, 290,traderWidth/2+traderGap/2+60, 110);
	  }
	  else {
        ctx.fillStyle = shadowColor;
        ctx.fillRect(mySimulateArea.canvas.width-traderWidth/2-traderGap/2-65+shadowWidth, 290+shadowWidth,traderWidth/2+traderGap/2+60, 70);
        ctx.fillStyle = "red";
        ctx.fillRect(mySimulateArea.canvas.width-traderWidth/2-traderGap/2-65, 290,traderWidth/2+traderGap/2+60, 70);
	  }
      ctx.font = "16px Aerial";	  
      ctx.fillStyle = "white";
      ctx.fillText(bannerDict[34][thisLang] + "(#" + accidentCount + ")", mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 310);
	  if (accidentState>0.1) {
        ctx.fillText(bannerDict[35][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 330);
        ctx.fillText(bannerDict[38][thisLang] + (dayCount - accidentStart + 1) + bannerDict[37][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 350);
	  }
	  if (accidentState<-0.1) {
        ctx.fillText(bannerDict[36][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 330);
        ctx.fillText(bannerDict[38][thisLang] + (dayCount - accidentStart + 1) + bannerDict[37][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 350);
	  }
	  if (chainBreakDown > -1) {
		if (Math.abs(accidentState)<0.1) {
          ctx.fillText(bannerDict[39][thisLang] + traders[chainBreakDown], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 330);
          ctx.fillText(bannerDict[38][thisLang] + (dayCount - chainBreakStart + 1) + bannerDict[37][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 350);
		}  else {
          ctx.fillText(bannerDict[39][thisLang] + traders[chainBreakDown], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 370);
          ctx.fillText(bannerDict[38][thisLang] + (dayCount - chainBreakStart + 1) + bannerDict[37][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 390);
		}
	  }

	} else { if(dayCount < Math.max(accidentStart+accidentPeriod, chainBreakStart+chainBreakPeriod)+7000/simInterval/framesPerDay && accidentCount>0){
      ctx.fillStyle = shadowColor;
      ctx.fillRect(mySimulateArea.canvas.width-traderWidth/2-traderGap/2-65+shadowWidth, 290+shadowWidth,traderWidth/2+traderGap/2+60, 70);
      ctx.fillStyle = "gray";
      ctx.fillRect(mySimulateArea.canvas.width-traderWidth/2-traderGap/2-65, 290,traderWidth/2+traderGap/2+60, 70);
      ctx.fillStyle = "white";
      ctx.font = "16px Aerial";	  
      ctx.fillText(bannerDict[34][thisLang] + "(#" + accidentCount + ")", mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 310);
	  if (accidentStart+accidentPeriod> chainBreakStart+chainBreakPeriod) {
        ctx.fillText(bannerDict[41][thisLang] + Math.round(accidentPeak*averageDemand) + bannerDict[44][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 330);
        ctx.fillText(bannerDict[42][thisLang] + Math.round(accidentPeriod-1) + bannerDict[56][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 350);
	  } else  {
        ctx.fillText(bannerDict[43][thisLang] + Math.round((1-lastBreakScale)*100) + "%", mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 330);
        ctx.fillText(bannerDict[42][thisLang] + Math.round(chainBreakPeriod-1) + bannerDict[56][thisLang], mySimulateArea.canvas.width-traderWidth/2-traderGap/2-58, 350);
	  }
	}}
	ctx.textAlign = "right";
	ctx.fillStyle = shadowColor;
    ctx.fillRect(mySimulateArea.canvas.width-traderWidth/2-traderGap/2-15+shadowWidth, 55+shadowWidth,traderWidth/2+traderGap/2+10, 225);
    ctx.fillStyle = "#DDDDDD";
    ctx.fillRect(mySimulateArea.canvas.width-traderWidth/2-traderGap/2-15, 55,traderWidth/2+traderGap/2+10, 225);
    ctx.fillStyle = "black";
    ctx.font = "15px Aerial";
    ctx.fillText(bannerDict[46][thisLang] + dayCount, mySimulateArea.canvas.width-17, 80);
    ctx.fillText(bannerDict[47][thisLang] + dayConsume, mySimulateArea.canvas.width-17, 95);
	ctx.textAlign = "center";
	ctx.fillText(bannerDict[48][thisLang], mySimulateArea.canvas.width-70, 120);
	ctx.fillText(Math.round(simInterval*framesPerDay/1000*365) + bannerDict[49][thisLang], mySimulateArea.canvas.width-70, 137);
	ctx.fillText(bannerDict[50][thisLang], mySimulateArea.canvas.width-70, 165);
	ctx.fillText(Math.round(fluctuateRange*100) + "%", mySimulateArea.canvas.width-70, 182);
	ctx.fillText(bannerDict[51][thisLang], mySimulateArea.canvas.width-70, 210);
	ctx.fillText(Math.round(seasonalRange*100) + "%", mySimulateArea.canvas.width-70, 227);
	ctx.fillText(bannerDict[52][thisLang], mySimulateArea.canvas.width-70, 252);
	ctx.fillText(Math.round(demandChange*100) + "%" + bannerDict[53][thisLang], mySimulateArea.canvas.width-70, 269);
	if (shortage){
	  ctx.fillStyle = shadowColor;
	  ctx.textAlign = "center";
	  ctx.fillRect(mySimulateArea.canvas.width-145+shadowWidth, stockShowMax+5+shadowWidth, 140,50);
	  ctx.font = "20px Aerial";
      ctx.fillText(bannerDict[54][thisLang], mySimulateArea.canvas.width-75+shadowWidth, stockShowMax+37+shadowWidth);	
	  ctx.fillStyle = "brown";
	  ctx.fillRect(mySimulateArea.canvas.width-145, stockShowMax+5, 140,50);
	  ctx.fillStyle = "white";
      ctx.fillText(bannerDict[54][thisLang], mySimulateArea.canvas.width-75, stockShowMax+37);
	}
	for (i=0; i<myButton.length; i+=1) {
		ctx.fillStyle = shadowColor;
		if (simInterval * mySimulateArea.frameNo > myButton[i][10]+100) {
		  ctx.fillRect(myButton[i][1]+shadowWidth-1,myButton[i][2]+shadowWidth-1,myButton[i][3],myButton[i][4]);
          ctx.fillStyle = myButton[i][5];
		} else {
		  ctx.fillRect(myButton[i][1]-shadowWidth+1,myButton[i][2]-shadowWidth+1,myButton[i][3],myButton[i][4]);
          ctx.fillStyle = "gray";
	    }
	    ctx.fillRect(myButton[i][1],myButton[i][2],myButton[i][3],myButton[i][4]);
		ctx.font = myButton[i][6];
		ctx.fillStyle = myButton[i][7];
		ctx.textAlign = myButton[i][8];
		ctx.fillText(bannerDict[myButton[i][0]][thisLang],myButton[i][1]+myButton[i][3]/2,myButton[i][2]+myButton[i][4]-myButton[i][9]);
	}
	if (isCapturing == true) {   // for capturing
		myCapturer.capture(document.body.childNodes[0]);    // for capturing
	}   // for capturing
	simFrameNo += 1;
	mySimulateArea.frameNo += 1;
}
