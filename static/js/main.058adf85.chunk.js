(this.webpackJsonphexcal=this.webpackJsonphexcal||[]).push([[0],{142:function(e,t,n){e.exports=n.p+"static/media/logo.5617cd50.png"},147:function(e,t,n){e.exports=n(367)},152:function(e,t,n){},153:function(e,t,n){},170:function(e,t){},192:function(e,t){},194:function(e,t){},258:function(e,t){},367:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),p=n(141),y=n.n(p),s=(n(152),n(72)),r=n(142),u=n.n(r),l=(n(153),n(50)),d=n(145),o="0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",m=[{inputs:[],payable:!1,stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"spender",type:"address"},{indexed:!1,internalType:"uint256",name:"value",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!1,internalType:"uint256",name:"data1",type:"uint256"},{indexed:!0,internalType:"bytes20",name:"btcAddr",type:"bytes20"},{indexed:!0,internalType:"address",name:"claimToAddr",type:"address"},{indexed:!0,internalType:"address",name:"referrerAddr",type:"address"}],name:"Claim",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!1,internalType:"uint256",name:"data1",type:"uint256"},{indexed:!1,internalType:"uint256",name:"data2",type:"uint256"},{indexed:!0,internalType:"address",name:"senderAddr",type:"address"}],name:"ClaimAssist",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!0,internalType:"address",name:"updaterAddr",type:"address"}],name:"DailyDataUpdate",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!0,internalType:"uint40",name:"stakeId",type:"uint40"}],name:"ShareRateChange",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!1,internalType:"uint256",name:"data1",type:"uint256"},{indexed:!0,internalType:"address",name:"stakerAddr",type:"address"},{indexed:!0,internalType:"uint40",name:"stakeId",type:"uint40"}],name:"StakeEnd",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!1,internalType:"uint256",name:"data1",type:"uint256"},{indexed:!0,internalType:"address",name:"stakerAddr",type:"address"},{indexed:!0,internalType:"uint40",name:"stakeId",type:"uint40"},{indexed:!0,internalType:"address",name:"senderAddr",type:"address"}],name:"StakeGoodAccounting",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!0,internalType:"address",name:"stakerAddr",type:"address"},{indexed:!0,internalType:"uint40",name:"stakeId",type:"uint40"}],name:"StakeStart",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!1,internalType:"uint256",name:"value",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!0,internalType:"address",name:"memberAddr",type:"address"},{indexed:!0,internalType:"uint256",name:"entryId",type:"uint256"},{indexed:!0,internalType:"address",name:"referrerAddr",type:"address"}],name:"XfLobbyEnter",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"data0",type:"uint256"},{indexed:!0,internalType:"address",name:"memberAddr",type:"address"},{indexed:!0,internalType:"uint256",name:"entryId",type:"uint256"},{indexed:!0,internalType:"address",name:"referrerAddr",type:"address"}],name:"XfLobbyExit",type:"event"},{payable:!0,stateMutability:"payable",type:"fallback"},{constant:!0,inputs:[],name:"allocatedSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"spender",type:"address"}],name:"allowance",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"approve",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"account",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"uint256",name:"rawSatoshis",type:"uint256"},{internalType:"bytes32[]",name:"proof",type:"bytes32[]"},{internalType:"address",name:"claimToAddr",type:"address"},{internalType:"bytes32",name:"pubKeyX",type:"bytes32"},{internalType:"bytes32",name:"pubKeyY",type:"bytes32"},{internalType:"uint8",name:"claimFlags",type:"uint8"},{internalType:"uint8",name:"v",type:"uint8"},{internalType:"bytes32",name:"r",type:"bytes32"},{internalType:"bytes32",name:"s",type:"bytes32"},{internalType:"uint256",name:"autoStakeDays",type:"uint256"},{internalType:"address",name:"referrerAddr",type:"address"}],name:"btcAddressClaim",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{internalType:"bytes20",name:"",type:"bytes20"}],name:"btcAddressClaims",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{internalType:"bytes20",name:"btcAddr",type:"bytes20"},{internalType:"uint256",name:"rawSatoshis",type:"uint256"},{internalType:"bytes32[]",name:"proof",type:"bytes32[]"}],name:"btcAddressIsClaimable",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{internalType:"bytes20",name:"btcAddr",type:"bytes20"},{internalType:"uint256",name:"rawSatoshis",type:"uint256"},{internalType:"bytes32[]",name:"proof",type:"bytes32[]"}],name:"btcAddressIsValid",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"pure",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"claimToAddr",type:"address"},{internalType:"bytes32",name:"claimParamHash",type:"bytes32"},{internalType:"bytes32",name:"pubKeyX",type:"bytes32"},{internalType:"bytes32",name:"pubKeyY",type:"bytes32"},{internalType:"uint8",name:"claimFlags",type:"uint8"},{internalType:"uint8",name:"v",type:"uint8"},{internalType:"bytes32",name:"r",type:"bytes32"},{internalType:"bytes32",name:"s",type:"bytes32"}],name:"claimMessageMatchesSignature",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"pure",type:"function"},{constant:!0,inputs:[],name:"currentDay",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"dailyData",outputs:[{internalType:"uint72",name:"dayPayoutTotal",type:"uint72"},{internalType:"uint72",name:"dayStakeSharesTotal",type:"uint72"},{internalType:"uint56",name:"dayUnclaimedSatoshisTotal",type:"uint56"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{internalType:"uint256",name:"beginDay",type:"uint256"},{internalType:"uint256",name:"endDay",type:"uint256"}],name:"dailyDataRange",outputs:[{internalType:"uint256[]",name:"list",type:"uint256[]"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"uint256",name:"beforeDay",type:"uint256"}],name:"dailyDataUpdate",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"decimals",outputs:[{internalType:"uint8",name:"",type:"uint8"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"subtractedValue",type:"uint256"}],name:"decreaseAllowance",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"globalInfo",outputs:[{internalType:"uint256[13]",name:"",type:"uint256[13]"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"globals",outputs:[{internalType:"uint72",name:"lockedHeartsTotal",type:"uint72"},{internalType:"uint72",name:"nextStakeSharesTotal",type:"uint72"},{internalType:"uint40",name:"shareRate",type:"uint40"},{internalType:"uint72",name:"stakePenaltyTotal",type:"uint72"},{internalType:"uint16",name:"dailyDataCount",type:"uint16"},{internalType:"uint72",name:"stakeSharesTotal",type:"uint72"},{internalType:"uint40",name:"latestStakeId",type:"uint40"},{internalType:"uint128",name:"claimStats",type:"uint128"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"addedValue",type:"uint256"}],name:"increaseAllowance",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{internalType:"bytes32",name:"merkleLeaf",type:"bytes32"},{internalType:"bytes32[]",name:"proof",type:"bytes32[]"}],name:"merkleProofIsValid",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"pure",type:"function"},{constant:!0,inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{internalType:"bytes32",name:"pubKeyX",type:"bytes32"},{internalType:"bytes32",name:"pubKeyY",type:"bytes32"},{internalType:"uint8",name:"claimFlags",type:"uint8"}],name:"pubKeyToBtcAddress",outputs:[{internalType:"bytes20",name:"",type:"bytes20"}],payable:!1,stateMutability:"pure",type:"function"},{constant:!0,inputs:[{internalType:"bytes32",name:"pubKeyX",type:"bytes32"},{internalType:"bytes32",name:"pubKeyY",type:"bytes32"}],name:"pubKeyToEthAddress",outputs:[{internalType:"address",name:"",type:"address"}],payable:!1,stateMutability:"pure",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"stakerAddr",type:"address"}],name:"stakeCount",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"uint256",name:"stakeIndex",type:"uint256"},{internalType:"uint40",name:"stakeIdParam",type:"uint40"}],name:"stakeEnd",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"stakerAddr",type:"address"},{internalType:"uint256",name:"stakeIndex",type:"uint256"},{internalType:"uint40",name:"stakeIdParam",type:"uint40"}],name:"stakeGoodAccounting",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"",type:"address"},{internalType:"uint256",name:"",type:"uint256"}],name:"stakeLists",outputs:[{internalType:"uint40",name:"stakeId",type:"uint40"},{internalType:"uint72",name:"stakedHearts",type:"uint72"},{internalType:"uint72",name:"stakeShares",type:"uint72"},{internalType:"uint16",name:"lockedDay",type:"uint16"},{internalType:"uint16",name:"stakedDays",type:"uint16"},{internalType:"uint16",name:"unlockedDay",type:"uint16"},{internalType:"bool",name:"isAutoStake",type:"bool"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"uint256",name:"newStakedHearts",type:"uint256"},{internalType:"uint256",name:"newStakedDays",type:"uint256"}],name:"stakeStart",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[],name:"totalSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"recipient",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transfer",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"address",name:"recipient",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transferFrom",outputs:[{internalType:"bool",name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"xfLobby",outputs:[{internalType:"uint256",name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"address",name:"referrerAddr",type:"address"}],name:"xfLobbyEnter",outputs:[],payable:!0,stateMutability:"payable",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"memberAddr",type:"address"},{internalType:"uint256",name:"entryId",type:"uint256"}],name:"xfLobbyEntry",outputs:[{internalType:"uint256",name:"rawAmount",type:"uint256"},{internalType:"address",name:"referrerAddr",type:"address"}],payable:!1,stateMutability:"view",type:"function"},{constant:!1,inputs:[{internalType:"uint256",name:"enterDay",type:"uint256"},{internalType:"uint256",name:"count",type:"uint256"}],name:"xfLobbyExit",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!1,inputs:[],name:"xfLobbyFlush",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"address",name:"",type:"address"}],name:"xfLobbyMembers",outputs:[{internalType:"uint40",name:"headIndex",type:"uint40"},{internalType:"uint40",name:"tailIndex",type:"uint40"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{internalType:"address",name:"memberAddr",type:"address"}],name:"xfLobbyPendingDays",outputs:[{internalType:"uint256[2]",name:"words",type:"uint256[2]"}],payable:!1,stateMutability:"view",type:"function"},{constant:!0,inputs:[{internalType:"uint256",name:"beginDay",type:"uint256"},{internalType:"uint256",name:"endDay",type:"uint256"}],name:"xfLobbyRange",outputs:[{internalType:"uint256[]",name:"list",type:"uint256[]"}],payable:!1,stateMutability:"view",type:"function"}],c=n(38),b=n.n(c),T=n(143),f=n.n(T),k=new d.a({supportedChainIds:[1]}),h="0x0000000000000000000000000000000000000000",x=function(e){return b()("20191203","YYYYMMDD").add(e,"days")},w=function(e){var t=e.address;return i.a.createElement("span",null,t.slice(0,6)+"..."+t.slice(38))},A=function(e){var t=e.stake,n=x(t.lockedDay+t.stakedDays);return i.a.createElement("tr",{key:t.stakeId},i.a.createElement("td",null,t.stakeId),i.a.createElement("td",null,n.calendar()),i.a.createElement("td",null,n.fromNow()))},v=function(e){var t=Object(l.b)(),n=t.account,a=t.library,p=t.active,y=t.error,r=i.a.useState([]),d=Object(s.a)(r,2),c=d[0],T=d[1],v=i.a.useState(0),E=Object(s.a)(v,2),M=E[0],g=E[1];window.web3=t;i.a.useEffect((function(){a&&new a.eth.Contract(m,o).methods.stakeCount(n).call().then((function(e){return g(parseInt(e))})).catch((function(){g(0)}))}),[n,a]),i.a.useEffect((function(){if(a&&M){var e=new a.eth.Contract(m,o),t=Array.from(new Array(M).keys()).map((function(t){return e.methods.stakeLists(n,t).call()}));Promise.all(t).then((function(e){T(e.map((function(e){return{stakeId:parseInt(e.stakeId),stakedDays:parseInt(e.stakedDays),stakedHearts:parseInt(e.stakedHearts),stakeShares:parseInt(e.stakeShares),lockedDay:parseInt(e.lockedDay),unlockedDay:parseInt(e.unlockedDay),isAutoStake:e.isAutoStake}})))})).catch((function(){return T([])}))}}),[M,a,n]);var I=b()();return i.a.createElement("div",{className:"App"},i.a.createElement("header",{className:"App-header"},i.a.createElement("img",{src:u.a,className:"App-logo",alt:"logo"}),i.a.createElement("h2",null,"HEXCAL"),i.a.createElement("h4",null,"Do not miss your unlock days"),i.a.createElement("p",null,"HEXCAL allows you to store your ",i.a.createElement("a",{className:"App-link",href:"https://go.hex.win/?r="+h,target:"_blank"},"HEX")," unlock days in your calendar.",i.a.createElement("br",null),"Download an iCAL/ICS file and import it into your calendar app."),p?null:i.a.createElement("p",null,i.a.createElement("button",{className:"App-button",onClick:function(){t.activate(k)}},"Connect to Web3"),y?"error":null),p&&n?i.a.createElement(i.a.Fragment,null,i.a.createElement("h4",null,"Open HEX Stakes for ",i.a.createElement(w,{address:n})),i.a.createElement("table",null,i.a.createElement("thead",null,i.a.createElement("tr",null,i.a.createElement("th",null,"ID"),i.a.createElement("th",null,"Unlock day"),i.a.createElement("th",null,"Interval"))),i.a.createElement("tbody",null,c.map((function(e){return i.a.createElement(A,{stake:e,currentDay:I})})))),i.a.createElement("p",null,i.a.createElement("button",{className:"App-button",onClick:function(){return function(){var e=f()({domain:"github.com",prodId:"//superman-industries.com//ical-generator//EN",events:c.map((function(e){var t=x(e.lockedDay+e.stakedDays);return{start:t,end:t.add(1,"hour"),timestamp:t,summary:"HEX unlock day for #"+e.stakeId,organizer:"Richard Heart <mail@example.com>"}}))});window.open("data:text/calendar;charset=utf8,"+escape(e.toString()))}()}},"Download as iCal/ICS"))):null,i.a.createElement("p",null,"Made with"," ",i.a.createElement("a",{className:"App-link",href:"https://reactjs.org",target:"_blank",rel:"noopener noreferrer"},"HEX")," ","by"," ",i.a.createElement("a",{className:"App-link",href:"https://twitter.com/coinyon"},"@coinyon")," ","|"," ",i.a.createElement("a",{className:"App-link",href:"https://github.com/coinyon"},"Github")," ","|"," ",i.a.createElement("a",{className:"App-link",href:"https://etherscan.io/"+h},"Donate"))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var E=n(144),M=n.n(E);y.a.render(i.a.createElement(l.a,{getLibrary:function(e,t){return new M.a(e)}},i.a.createElement(v,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[147,1,2]]]);
//# sourceMappingURL=main.058adf85.chunk.js.map