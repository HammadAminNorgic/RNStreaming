// // @ts-nocheck

// import {NativeModules} from 'react-native'
// import Logger from './Logger';
// import mediaDevices from './MediaDevices';
// import MediaStream from './MediaStream';
// import MediaStreamTrack from './MediaStreamTrack';
// import MediaStreamTrackEvent from './MediaStreamTrackEvent';
// import permissions from './Permissions';
// import RTCErrorEvent from './RTCErrorEvent';
// import RTCIceCandidate from './RTCIceCandidate';
// import RTCPeerConnection from './RTCPeerConnection';
// import RTCRtpReceiver from './RTCRtpReceiver';
// import RTCRtpSender from './RTCRtpSender';
// import RTCRtpTransceiver from './RTCRtpTransceiver';
// import RTCSessionDescription from './RTCSessionDescription';
// import RTCView from './RTCView';
// import ScreenCapturePickerView from './ScreenCapturePickerView';
// import EventEmitter from 'events';
// const NatManager = NativeModules.NatManager  ? NativeModules.NatManager  : new Proxy(
//   {},
//   {
//     get() {
//       throw new Error(LINKING_ERROR);
//     },
//   }
// );

// export class PeerClient extends EventEmitter {

//     public ws: any;
//     public project_id: any;
//     public auth_token: any;
//     public ref_id: any;
//     public mc_token: any;
//     public session_uuid: any;
//     public peer_connection: any;
//     public call_from: any;
//     public local_stream: any;
//     public remote_stream: any;
//     public audio_paused: any = false;
//     public stream_paused: any = false;
//     public speakerOn: any = false;
//     public Init_Credentials: any = {};
//     public NATBehaviour: any = 'not detected';
//     public NATFiltering: any = 'not detected';
//     public publicIps: any = [];
//     public callParamsData: any = {}
//     public stunHost: any;
//     public stunPort: any;
//     public localCandidatesArray: any = [];
//     public incommingCallResponse: any = {};
//     public sessionConstraints: any = {
//         mandatory: {
//             OfferToReceiveAudio: true,
//             OfferToReceiveVideo: true,
//             // VoiceActivityDetection: true
//         }
//     };

//     constructor(_Credentials: any) {
//         super();
//         console.log('params in peerclient', _Credentials)
//         setTimeout(() => {

//             if (_Credentials.host && _Credentials.projectId && _Credentials.stunHost && _Credentials.stunPort) {
//               // NatManager.natTest("r-stun2.vdotok.dev",3478).then((e:any)=>{
//               //   console.log('this is nat results',e)
//               // })
//                 this.project_id = _Credentials.projectId
//                 this.Init_Credentials = _Credentials
//                 this.stunHost = _Credentials.stunHost
//                 this.stunPort = _Credentials.stunPort
//                 //   stunHost:stunCredentials.host,
//                 //   stunPort:stunCredentials.port
//                   console.log('nat module =='+Platform.OS,"==",NativeModules.NatManager)
//                   NatManager.natTest("r-stun2.vdotok.dev",3478).then((e:any)=>{

//                 // console.log("Got Nat filtering and behaviour",e)
//                     if(Platform.OS=='android'){
//                         // filtering behaviur ips
//                         let rawString:any=e
//                         console.log("it is raw string-->",rawString);

//                         let stringToArray:any=rawString.split("<->")
//                         console.log("it is stringToArray-->",stringToArray);

//                         let filtering:any=stringToArray[0]
//                         let behaviour:any=stringToArray[1]
//                         let a:string=stringToArray[2]
//                          a=a.replace("[","")
//                          a=a.replace("]","")
//                          console.log(a)
//                          a=a.split(",")
//                         let ips:any=a

//                 console.log("it is data after processing-->",filtering,behaviour,ips);

//                 // if(filtering && behaviour && ips){
//                     this.NATBehaviour=behaviour
//                     this.NATFiltering=filtering
//                     this.publicIps=ips
//                 this.Connect(_Credentials.host);
//                 }else{
//                   console.log('nat results in ios',e)
//                   this.NATBehaviour='not detected ios'
//                   this.NATFiltering='not detected ios'
//                   this.publicIps=['dummyport']
//                    this.Connect(_Credentials.host);
//                     // alert("not got NAt filteriing,behaviour or ips")
//                     // this.emit("error", { type: "NAT_DETECTION_ISSUE", message: "Issue on detecting NAT beaviour, NAT Filtering or PublicIps" });
//                 }

//                 // }

//                   })
//             } else {
//                 this.emit("error", { type: "INVALID_INITIALIZATION_ARGUMENTS", message: "Please make sure you provide projectId,host,stunHost,stunPort while initializing !" });

//             }
//         }, 500);



//     }

//     public log(...args: any) {
//         // return;
//         console.log(' ')
//         console.log('====================== VDOTOK CONSOLE START ===================')
//         console.log(args)
//         console.log('====================== VDOTOK CONSOLE END ===================')
//         console.log(' ')
//     }


//     public sendPing() {
//         //   this.log('sending ping req:')
//         let p = {
//             "requestID": new Date().getTime().toString(),
//             "requestType": "ping",
//             "mcToken": this.mc_token
//         }
//         this.ws.send(JSON.stringify(p));
//     }



//     /**
// * incomingCall
// */
//     public incomingCall(messageData: any) {
//         this.emit("call", { type: "CALL_RECEIVED", message: "Received a call", from: this.call_from, call_type: messageData.media_type });

//     }
//     public async AcceptCall() {
//         let uUID=new Date().getTime().toString();
//       //   const configuration = {"iceServers": [{"url": "stun:r-stun2.vdotok.dev:3478"}]};
//         let pc :any;
        
//         // let isFront = true;
              
//               //   { call_type: 'one_to_one',
//               //   callerSDP: 'sdp',
//               //   data: {},
//               //   from: 'fe6e77e01044c54861483098cd8d795a',
//               //   isPeer: 1,
//               //   media_type: 'video',
//               //   requestID: '1668064736786',
//               //   requestType: 'incomingCall',
//               //   sessionUUID: '1668064736786',
//               //   session_type: 'call',
//               //   turn_credentials: 
//               //    { credential: 'XspIFqtUqHfOPG9UIirCPGjpbEo=',
//               //      url: [ 'turn:r-stun1.vdotok.dev:3478' ],
//               //      username: '1668151136:0f348b66a7b87ab542a9277d2783c825' },
//               //   type: 'request' }
//           // @ts-ignore:next-line
//           mediaDevices.getUserMedia({
//             audio: true,
//             video: true,
//           })
//           .then(async (stream) => {
//             this.log('GOT local STREAM-->',stream);
//             this.local_stream=stream
//             this.emit("local_stream", { type: "GOT_LOCAL_STREAM", message: "this is your local stream", stream: stream });
//           // const configuration = { "iceServers": [{ "url": "stun:r-stun2.vdotok.dev:3478" }] };
//           const configuration = { "iceServers": [{ "urls": `stun:${this.stunHost}:${this.stunPort}`},
//           //    data.turn_credentials
//             {
//                       "urls":  this.incommingCallResponse.turn_credentials.url,
//                       "username":  this.incommingCallResponse.turn_credentials.username,
//                       "credential": this.incommingCallResponse.turn_credentials.credential
//                     }
//           ],
//                  sdpSemantics:'plan-b',
//                  iceTransportPolicy: 'all',
//                  bundlePolicy: 'max-bundle',
//                  rtcpMuxPolicy: 'require'
//       };
//           //   const configuration = { "iceServers": [{ "url": "stun:r-stun2.vdotok.dev:3478" }] };
//           console.log('this is peer connection init',configuration)
//              pc = new RTCPeerConnection(configuration);
           
//            this.peer_connection=pc
//             this.log('adding stream in pc-->',pc);
//           //   let trackss=   stream._tracks
//           //   console.log("tracksssss mm",trackss)
//           //      trackss.forEach((track: any) =>
//           //    {
//           //      console.log('i am in this loop')
//           //      pc.addTrack(track)}
//           //    );
//           let s2=new MediaStream(stream)
  
//           s2.getTracks().forEach((track) => {
//           pc.addTrack(track)
//           })
//           //   pc.addStream(stream)
//             this.log('adding stream in pc-->',pc);
//             let des:any=
//               {
//                   // @ts-ignore:next-line
//                   type: "offer",
//                   // @ts-ignore:next-line
//                   sdp: this.incommingCallResponse.callerSDP
//                 }
            
//             const offerDescription = new RTCSessionDescription(des);
//             this.log("this is offer desc->",offerDescription)
//               await pc.setRemoteDescription( offerDescription );
//            this.log("remote desc set")
//           // const answerDescription = await peerConnection.createAnswer();
//          // await peerConnection.setLocalDescription( answerDescription );
//             // @ts-ignore:next-line
//             pc.createAnswer(this.sessionConstraints).then(desc => {
//               this.log('desccccc after answer',desc);
//               let description: any = new RTCSessionDescription(
//                 {
//                   // @ts-ignore:next-line
//                   type: desc.type,
//                   // @ts-ignore:next-line
//                   sdp: desc.sdp
//                 }
//               )
//               pc.setLocalDescription(description).then(() => {
//                 this.log('setLocalDescription');
//                 // Send pc.localDescription to peer
//               //   return
//               //   {
//               //     "from": "5d877b6cc3bc516a3486b0435df8781a",
//               //     "to": [
//               //         "775437e8715b89f2e9f388363a8bcd83"
//               //     ],
//               //     "sdpOffer": "sdp",
//               //     "requestType": "session_invite",
//               //     "call_type": "one_to_one",
//               //     "session_type": "call",
//               //     "media_type": "video",
//               //     "requestID": "N5HGEOOQ3H1RBLADS2UVN1XW3EBV81QS",
//               //     "sessionUUID": "W3UFRWDIPLFAAL27RVLKB9C4RQTYJWAL",
//               //     "mcToken": "7c37959cbcc2fa7d43546c644b6c0ae9",
//               //     "isRecord": 1,
//               //     "isPeer": 1,
//               //     "data": "refdskdesdweoosdomw",
//               //     "responseCode": "200",
//               //     "responseMessage": "accepted"
//               // }
//                 let response ={
//                     "type":"request",
//                     "requestType":"session_invite",
//                     "sdpOffer":description.sdp,
//                     "requestID":uUID,
//                     mcToken:this.mc_token,
//                     isPeer:1,
//                     "media_type":"video",
//                     "sessionUUID":this.incommingCallResponse.sessionUUID,
//                     "responseCode":200,
//                     session_type:"call",
//                     "responseMessage":"accepted"
//                 };
              
//                   let reqMessage=JSON.stringify(response);
//                   this.log("===OnOffering Answer",reqMessage);
    
//           this.ws.send(reqMessage);
//               });
//             });
//             // @ts-ignore:next-line
//             pc.onicecandidate = (event)=> {
//               this.log('on receiver ice_candidate-->',event);
    
//               // {
//               //     "requestType": "onIceCandidate",
//               //     "candidate": {
//               //         "candidate": "candidate:829852397 1 udp 2122260223 192.168.1.31 50201 typ host generation 0 ufrag qgoA network-id 1 network-cost 10",
//               //         "sdpMid": "0",
//               //         "sdpMLineIndex": 0
//               //     },
//               //     "type": "request",
//               //     "sessionUUID": "W3UFRWDIPLFAAL27RVLKB9C4RQTYJWAL",
//               //     "referenceID": "5d877b6cc3bc516a3486b0435df8781a",
//               //     "to": [
//               //         "775437e8715b89f2e9f388363a8bcd83"
//               //     ]
//               // }
//               // return
//               var message = {
//                   id : 'onIceCandidate',
//                   requestType : 'onIceCandidate',
//                   type:"request",
//                   candidate : {
//                       candidate:(event as any).candidate
//                   },
//                   // referenceID:this.incommingCallResponse.from,//(offerSDP user ICE Candidate)
//                   sessionUUID : this.incommingCallResponse.sessionUUID,
//                    referenceID: this.ref_id,
//                   to: [
//                       this.incommingCallResponse.from
//                   ]
//               };
//               this.log('*****sending ice candidate--->',message);
              
//               var jsonMessage = JSON.stringify(message);
//               this.ws.send(jsonMessage)
      
            
//             //   send event.candidate to peer
//             };
//             // @ts-ignore:next-line
//             pc.onaddstream=(event)=>{
//               alert("got remote stream")
//             // @ts-ignore:next-line
//             // if((event as any).streams[0]._tracks.length==2){
//               // this.setState({ remoteStream: event.stream })
//               this.log('remote streammm o--->', (event as any).stream);
     
//                //   alert('got remote stream')
//                this.remote_stream=(event as any).streams
//                this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).stream });
       
//               //  }
  
//             // // alert('remote')
//             // if(event.streams.length<2){
//             //   return;
//             //   }
//             //     console.log('remote streammm--->',event.streams);
//             //     this.remote_stream=(event as any).streams
//             // this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).streams });
               
//             //   //   alert('got remote stream')
      
//             }
//             pc.ontrack=(event)=>
//             {
//                 console.log("p2 track",event)
//                 console.log("p2 track :D ->",(event.streams))
//                 if(event.receiver._track.kind=='video'){
//                   let st=new MediaStream()
//                   st.addTrack(new MediaStreamTrack(event.receiver._track))
//                   console.log('p2 stream-->',st);
//                  this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: st});
  
//                 //   setpc2RemoteStream(st)
//                 }
                
                
//                 }
//             // Got stream!
//           })
//           .catch(error => {
//             console.log('error-->',error);
        
//             // Log error
//           });
    
        
        
//       }

//     /**
//      * DeclineCall
//      */
//      public DeclineCall() {
//       // console.error("are you sure to decline call")
//       let messageStop={
//         "type":"request",
//         "requestType":"session_cancel",
//         "requestID":new Date().getTime().toString(),
//         "sessionUUID":this.session_uuid,
//         "mcToken":this.mc_token
//     };	
//     this.log('declining call',JSON.stringify(messageStop))
//     this.ws.send(JSON.stringify(messageStop));

//     // removeStream

//     // Vdotok1.destroySession();
//     this.endForegroundService()
  
//   //   this.peerCon

//     }

//  /**
//    * Disconnect
//    */
//   public Disconnect() {
  
  
//     //   this.peerCon
//     if(this.peer_connection){
//     // this.peer_connection.close()
//     }
//     this.endForegroundService()
//   }

//    /**
//    * PauseStream
//    */
//     public PauseStream() {
//       if(this.local_stream && !this.stream_paused){
//       this.log('PauseStream')
    
//         this.local_stream.getVideoTracks().forEach((track:any) => {
//         track.enabled =false
//       }) 
//       this.stream_paused=true
//       this.emit("stream_state_info", { type: "STREAM_STATE_CHANGED", message: "Stream state is changed", paused:true });
    
//       }
//     }


//     public ResumeStream() {
//       if(this.local_stream && this.stream_paused){
//       this.log('ResumeStream')
    
//         this.local_stream.getVideoTracks().forEach((track:any) => {
//         track.enabled =true
//       }) 
//       this.stream_paused=false
//       this.emit("stream_state_info", { type: "STREAM_STATE_CHANGED", message: "Stream state is changed", paused:false });
//       }
//     }

//     public SwitchCamera() {
   
//       if(this.local_stream){
//        this.log('switchCamera')
     
//        this.local_stream.getVideoTracks().forEach((track:any) => {
//          track._switchCamera();
//      })
//       }
//      }

//        /**
//    * MuteMic
//    */
//   public MuteMic() {
//     if(this.local_stream && !this.audio_paused){
//     this.log('MuteMic')
      
//       this.local_stream.getAudioTracks().forEach((track:any) => {
//       track.enabled =false
//     }) 
//     this.audio_paused=true
//     this.emit("audio_state_info", { type: "AUDIO_STATE_CHANGED", message: "Audio state is changed", muted:true });
  
//     }
//   }


//   /**
//    * UnmuteMic
//    */
//    public UnmuteMic() {
//     if(this.local_stream && this.audio_paused){
//     this.log('UnmuteMic')
  
//       this.local_stream.getAudioTracks().forEach((track:any) => {
//       track.enabled =true
//     }) 
//     this.audio_paused=false
//     this.emit("audio_state_info", { type: "AUDIO_STATE_CHANGED", message: "Audio state is changed", muted:false });
  
//     }
//   }

//   public async GetStream(params:any) {
//     let stream=null
   
//     if (params.type && params.type === 'screen') {
//       try {
//         // const channelId = await notifee.createChannel({
//         //   id: 'screen_capture',
//         //   name: 'Screen Capture',
//         //   lights: false,
//         //   vibration: false,
//         //   importance: AndroidImportance.DEFAULT
//         // });
    
//         // await notifee.displayNotification({
//         //   title: params.type === 'screen'?'Screen Capture':'Camera Capture',
//         //   body: 'This notification will be here until you stop capturing.',
//         //   android: {
//         //     channelId,
//         //     asForegroundService: true,
   
            
//         //      actions: [
//         //       {
//         //         title: 'Stop',
//         //         pressAction: {
//         //           id: 'stop',
//         //         },
//         //       },
//         //     ],
            
//         //   }
//         // })
//         stream = await mediaDevices.getDisplayMedia();
//       this.log('got stream in separate funct',stream)
  
      
//       }
//        catch (err) {
//         this.log("err", err)
//         // Handle Error
//       };
//     } else {
       
//       stream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: true
//       }
//       )
//       this.log('got stream in separate funct',stream)
//     }
//     return stream
    
//   }

//   public async endForegroundService() {
//     if(this.peer_connection){
        
      
//       if(this.local_stream){
//       // this.local_stream.release

//         // this.peer_connection.removeStream(this.local_stream)
//       }
//       this.peer_connection.close()

//       this.local_stream=null
//       this.peer_connection=null
//       this.audio_paused=false;
//       this.stream_paused=false;
//       this.local_stream=null
//       this.remote_stream=null
//       this.incommingCallResponse={}
//       }

    
//     // await notifee.stopForegroundService()
//   }

//   public async OneToOneCall(params: any) {
//           this.callParamsData=params
//           let uUID = new Date().getTime().toString();
//           this.session_uuid = uUID
//           let initReq= {
//                 "from": this.ref_id,
//                 "to": params.to,
//                 "type": "request",
//                 "requestType": "session_init",
//                 "call_type": "one_to_one",
//                 "session_type": "call",
//                 "media_type": "video",
//                 "requestID": this.session_uuid ,
//                 "mcToken": this.mc_token
//             }
//           let reqMessage = JSON.stringify(initReq);
//           this.log("sending session initReq", reqMessage);
//           this.ws.send(reqMessage);
//         }


//   /**
//      * OnSessionCancel
//      */
//    public OnSessionCancel(data:any) {
//     this.emit("call", { type: "CALL_ENDED", message: "call is ended", data:data });
//     // if(this.peer_connection){
//     //   this.peer_connection.close()
//     // }
//     this.endForegroundService()
//   }


//   public async handleSessionInitResponse(data) {
//     //   {"mcToken": "b4300461c50cec5799b347905a74b393", 
// //   "referenceIDs": [{"natBehavior": null, "natFiltering": null, "referenceID": "0f348b66a7b87ab542a9277d2783c825", "status": 0}],
// //    "requestID": "1668023171605",
// //     "requestType": "session_init", 
// //     "responseCode": 200, "responseMessage": "accepted",
// //      "turn_credentials": {"credential": "80j0MvugVou4Epgfb/yEJJ7G+6Y=", 
// //      "url": ["turn:r-stun1.vdotok.dev:3478"],
// //       "username": "1668109571:fe6e77e01044c54861483098cd8d795a"},
// //        "type": "response"}
// let params:any=this.callParamsData
// if(data.requestID===this.session_uuid){


// this.log('one to one call params', params)

// let stream: any = null

// stream =await this.GetStream(params)
// this.log('this is what i gottt----',stream)
// // return;
// // this.log("got stream", stream)
// if(!stream){
//     // @ts-ignore:next-line
// //   alert('No stream got');
// this.emit("error", { type: "NO_STREAM_GOT", message: "unable to get stream"});
// this.endForegroundService()
// return;
// }

// // this.log("got stream", stream)
// this.local_stream=stream

// this.emit("local_stream", { type: "GOT_LOCAL_STREAM", message: "this is your local stream", stream: stream });


// // const str2 = await mediaDevices.getUserMedia({
// // audio: true,
// // video: false}
// // )
// // console.error("2nd stream",str2)
// // let  yomo = new MediaStream([stream._tracks[0], str2._tracks[0]]);
// // console.error('third stream-->',yomo)
// // setStream(stream)


// // iceServers: [
// //     {
// //         urls: [ 'stun:domain:port']
// //     },
// //     {
// //         urls: [ 'turn:domain:port'],
// //         username: "long lived username",
// //         credential: "long lived password"
// //       }
// // ]

// const configuration = { "iceServers": [{ "urls": `stun:${this.stunHost}:${this.stunPort}`},
// //    data.turn_credentials
// {
//       "urls":  data.turn_credentials.url,
//       "username":  data.turn_credentials.username,
//       "credential": data.turn_credentials.credential
//     }
// ]
// ,
// sdpSemantics:'plan-b',
// iceTransportPolicy: 'all',
// bundlePolicy: 'max-bundle',
// rtcpMuxPolicy: 'require' };
// console.log('i am here',configuration)
// let peerConstraints = {
// 	iceServers: [
// 		{
// 			urls: 'stun:stun.l.google.com:19302'
// 		}
// 	]
// };
// const pc = new RTCPeerConnection(configuration);
// // return;

// this.peer_connection = pc

// // pc.addEventListener( 'connectionstatechange', event => {
// //     console.log(event)

// //     switch( pc.connectionState ) {
// //         case 'closed':
// //             // You can handle the call being disconnected here.

// //             break;
// //     };
// // } );

// // pc.addEventListener( 'icecandidate', event => {
// //     console.log(event)

// //     // When you find a null candidate then there are no more candidates.
// //     // Gathering of candidates has finished.
// //     if ( !event.candidate ) { return; };

// //     // Send the event.candidate onto the person you're calling.
// //     // Keeping to Trickle ICE Standards, you should send the candidates immediately.
// // } );

// // pc.addEventListener( 'icecandidateerror', event => {
// //     console.log(event)

// //     // You can ignore some candidate errors.
// //     // Connections can still be made even when errors occur.
// // } );

// // pc.addEventListener( 'iceconnectionstatechange', event => {
// //     console.log(event)

// //     switch( pc.iceConnectionState ) {
// //         case 'connected':
// //         case 'completed':
// //             // You can handle the call being connected here.
// //             // Like setting the video streams to visible.

// //             break;
// //     };
// // } );

// // pc.addEventListener( 'negotiationneeded', event => {
// //     console.log(event)

// //     // You can start the offer stages here.
// //     // Be careful as this event can be called multiple times.
// // } );

// // pc.addEventListener( 'signalingstatechange', event => {
// //     console.log(event)

// //     switch( pc.signalingState ) {
// //         case 'closed':
// //             // You can handle the call being disconnected here.

// //             break;
// //     };
// // } );

// // pc.addEventListener( 'addstream', event => {
// //     console.log(event)
// //     // Grab the remote stream from the connected participant.
// //     // remoteMediaStream = event.stream;
// // } );
// this.log('going to add stream in pc loop-->', pc);
// let s2=new MediaStream(stream)

// s2.getTracks().forEach((track) => {
// pc.addTrack(track)
// })
// // setpc2(p2)
// //  pc.addStream(stream)
// this.log('going to create offer');

// pc.createOffer(this.sessionConstraints).then(desc => {
// this.log('got description :', desc);

// let description: any = new RTCSessionDescription(
//   {
//     // @ts-ignore:next-line
//     type: desc.type,
//     // @ts-ignore:next-line
//     sdp: desc.sdp
//   }
// )
// this.log('goint to get local description');

// pc.setLocalDescription(description).then(() => {
//   this.log('local description set succesfully');
//   // Send pc.localDescription to peer

//   // return
//   // {
//   //     "from": "775437e8715b89f2e9f388363a8bcd83",
//   //     "to": [
//   //         "5d877b6cc3bc516a3486b0435df8781a"
//   //     ],
//   //     "sdpOffer": "v=0\r\no=- 61805455483770538 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1 2\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111 63 103 104 9 0 8 106 105 13 110 112 113 126\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:iofx\r\na=ice-pwd:EgnjNjFBmlY2TfTlETQhBRmZ\r\na=ice-options:trickle\r\na=fingerprint:sha-256 06:8E:31:79:A2:42:7A:35:D3:E7:5E:8D:9D:FD:8C:1A:FB:78:5D:39:4E:9C:8B:9E:02:D5:5E:92:23:8D:62:DB\r\na=setup:actpass\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=sendrecv\r\na=msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv e516068d-0bdf-42a9-ba75-f0dda121db8d\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=rtcp-fb:111 transport-cc\r\na=fmtp:111 minptime=10;useinbandfec=1\r\na=rtpmap:63 red/48000/2\r\na=fmtp:63 111/111\r\na=rtpmap:103 ISAC/16000\r\na=rtpmap:104 ISAC/32000\r\na=rtpmap:9 G722/8000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:106 CN/32000\r\na=rtpmap:105 CN/16000\r\na=rtpmap:13 CN/8000\r\na=rtpmap:110 telephone-event/48000\r\na=rtpmap:112 telephone-event/32000\r\na=rtpmap:113 telephone-event/16000\r\na=rtpmap:126 telephone-event/8000\r\na=ssrc:3076525376 cname:RvfGWXU5Y82EmW8b\r\na=ssrc:3076525376 msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv e516068d-0bdf-42a9-ba75-f0dda121db8d\r\nm=video 9 UDP/TLS/RTP/SAVPF 96 97 102 122 127 121 125 107 108 109 124 120 39 40 45 46 98 99 100 101 123 119 114 115 116\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:iofx\r\na=ice-pwd:EgnjNjFBmlY2TfTlETQhBRmZ\r\na=ice-options:trickle\r\na=fingerprint:sha-256 06:8E:31:79:A2:42:7A:35:D3:E7:5E:8D:9D:FD:8C:1A:FB:78:5D:39:4E:9C:8B:9E:02:D5:5E:92:23:8D:62:DB\r\na=setup:actpass\r\na=mid:1\r\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:13 urn:3gpp:video-orientation\r\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\r\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv 95f4d91a-e713-497a-8cd0-6c030ca3676f\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:102 H264/90000\r\na=rtcp-fb:102 goog-remb\r\na=rtcp-fb:102 transport-cc\r\na=rtcp-fb:102 ccm fir\r\na=rtcp-fb:102 nack\r\na=rtcp-fb:102 nack pli\r\na=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\na=rtpmap:122 rtx/90000\r\na=fmtp:122 apt=102\r\na=rtpmap:127 H264/90000\r\na=rtcp-fb:127 goog-remb\r\na=rtcp-fb:127 transport-cc\r\na=rtcp-fb:127 ccm fir\r\na=rtcp-fb:127 nack\r\na=rtcp-fb:127 nack pli\r\na=fmtp:127 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\na=rtpmap:121 rtx/90000\r\na=fmtp:121 apt=127\r\na=rtpmap:125 H264/90000\r\na=rtcp-fb:125 goog-remb\r\na=rtcp-fb:125 transport-cc\r\na=rtcp-fb:125 ccm fir\r\na=rtcp-fb:125 nack\r\na=rtcp-fb:125 nack pli\r\na=fmtp:125 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:107 rtx/90000\r\na=fmtp:107 apt=125\r\na=rtpmap:108 H264/90000\r\na=rtcp-fb:108 goog-remb\r\na=rtcp-fb:108 transport-cc\r\na=rtcp-fb:108 ccm fir\r\na=rtcp-fb:108 nack\r\na=rtcp-fb:108 nack pli\r\na=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\na=rtpmap:109 rtx/90000\r\na=fmtp:109 apt=108\r\na=rtpmap:124 H264/90000\r\na=rtcp-fb:124 goog-remb\r\na=rtcp-fb:124 transport-cc\r\na=rtcp-fb:124 ccm fir\r\na=rtcp-fb:124 nack\r\na=rtcp-fb:124 nack pli\r\na=fmtp:124 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f\r\na=rtpmap:120 rtx/90000\r\na=fmtp:120 apt=124\r\na=rtpmap:39 H264/90000\r\na=rtcp-fb:39 goog-remb\r\na=rtcp-fb:39 transport-cc\r\na=rtcp-fb:39 ccm fir\r\na=rtcp-fb:39 nack\r\na=rtcp-fb:39 nack pli\r\na=fmtp:39 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f\r\na=rtpmap:40 rtx/90000\r\na=fmtp:40 apt=39\r\na=rtpmap:45 AV1/90000\r\na=rtcp-fb:45 goog-remb\r\na=rtcp-fb:45 transport-cc\r\na=rtcp-fb:45 ccm fir\r\na=rtcp-fb:45 nack\r\na=rtcp-fb:45 nack pli\r\na=rtpmap:46 rtx/90000\r\na=fmtp:46 apt=45\r\na=rtpmap:98 VP9/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=fmtp:98 profile-id=0\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:100 VP9/90000\r\na=rtcp-fb:100 goog-remb\r\na=rtcp-fb:100 transport-cc\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=fmtp:100 profile-id=2\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100\r\na=rtpmap:123 H264/90000\r\na=rtcp-fb:123 goog-remb\r\na=rtcp-fb:123 transport-cc\r\na=rtcp-fb:123 ccm fir\r\na=rtcp-fb:123 nack\r\na=rtcp-fb:123 nack pli\r\na=fmtp:123 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=64001f\r\na=rtpmap:119 rtx/90000\r\na=fmtp:119 apt=123\r\na=rtpmap:114 red/90000\r\na=rtpmap:115 rtx/90000\r\na=fmtp:115 apt=114\r\na=rtpmap:116 ulpfec/90000\r\na=ssrc-group:FID 313879382 760964036\r\na=ssrc:313879382 cname:RvfGWXU5Y82EmW8b\r\na=ssrc:313879382 msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv 95f4d91a-e713-497a-8cd0-6c030ca3676f\r\na=ssrc:760964036 cname:RvfGWXU5Y82EmW8b\r\na=ssrc:760964036 msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv 95f4d91a-e713-497a-8cd0-6c030ca3676f\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:iofx\r\na=ice-pwd:EgnjNjFBmlY2TfTlETQhBRmZ\r\na=ice-options:trickle\r\na=fingerprint:sha-256 06:8E:31:79:A2:42:7A:35:D3:E7:5E:8D:9D:FD:8C:1A:FB:78:5D:39:4E:9C:8B:9E:02:D5:5E:92:23:8D:62:DB\r\na=setup:actpass\r\na=mid:2\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n",
//   //     "type": "request",
//   //     "requestType": "session_invite",
//   //     "call_type": "one_to_one",
//   //     "session_type": "call",
//   //     "media_type": "video",
//   //     "requestID": "VQN9CUKTR69LM4VXGEHVTBRE0LV7BEWJ",
//   //     "sessionUUID": "BXH9PB5NYUFAEW67BVH8HG27ILKRXJW9",
//   //     "mcToken": "f27d1c09a2203b55500049671ba49cea",
//   //     "isRecord": 1,
//   //     "isPeer": 1,
//   //     "data": "refdskdesdweoosdomw"
//   // }
//   let req = {
//     //"id":"call",
//     from: this.ref_id,
//     to: params.to,
//     type: "request",
//     requestType: "session_invite",
//     session_type: "call",
//     call_type: "one_to_one",
//     media_type: "video",
//     requestID: data.requestID,
//     sessionUUID: data.requestID,
//     mcToken: this.mc_token,
//     sdpOffer: description.sdp,
//     isPeer: 1,
//     data: {}
//   }

//   let reqMessage = JSON.stringify(req);
//   this.log("sending call request now", reqMessage);
//   this.ws.send(reqMessage);


// });
// }).catch(err=>{
//   console.log(err);
  
// });
// pc.onicecandidate = (event) => {
// this.log('on ie candidate-->', event);
// this.localCandidatesArray.push((event as any).candidate)

// //   var message = {
// //     id : 'onIceCandidate',
// //     requestType : 'onIceCandidate',
// //     type:"request",
// //     candidate : candidate,
// //     referenceID:messageData.from, //(offerSDP user ICE Candidate)
// //     sessionUUID : this.sessionUUID
// // };
// // this.SendPacket(message);

// // return
// // var message = {
// //   id: 'onIceCandidate',
// //   requestType: 'onIceCandidate',
// //   type: "request",
// //   candidate: {
// //     candidate: (event as any).candidate
// //   },
// //   referenceID: this.ref_id,//(offerSDP user ICE Candidate)
// //   sessionUUID: this.session_uuid
// // };
// // this.log('*****sending ice candidate--->', message);

// // var jsonMessage = JSON.stringify(message);
// // this.ws.send(jsonMessage)


// //   send event.candidate to peer
// };
// pc.onaddstream = (event) => {
// // @ts-ignore:next-line
// // alert('remote')
// // if((event as any).streams[0]._tracks.length==2){
// this.log('remote streammm o--->', (event as any).stream);

// // this.setState({ remoteStream: event.stream })
// //  this.log('remote streammm o--->', (event as any).streams);
// // alert("got remote stream")

// //   alert('got remote stream')
// this.remote_stream=(event as any).stream
// this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).stream });

// // }


// }

// pc.ontrack=(event)=>
//   {
//       console.log("p2 track",event)
//       console.log("p2 track :D ->",(event.streams))
//       if(event.receiver._track.kind=='video'){
//         let st=new MediaStream()
//         st.addTrack(new MediaStreamTrack(event.receiver._track))
//         console.log('p2 stream-->',st);
//         this.remote_stream=st
//        this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: st});

//       //   setpc2RemoteStream(st)
//       }
      
      
//       }





// }else{
// alert('request and session uuid mismatch in sessionint resp')
// }
// }

//   /**
//      * Register
//      */
//    public Register(auth_token: any, ref_id: any) {
//     this.log('in register func sdk==>', auth_token, ref_id)
//     this.ref_id = ref_id;
//     this.auth_token = auth_token;
//     let jsonbody = {
//       requestType: "register",
//       type: "request",
//       requestID: new Date().getTime().toString(),
//       tenantID: this.project_id,
//       projectID: this.project_id,
//       referenceID: ref_id,
//       authorizationToken: auth_token,
//       natFiltering: this.NATFiltering,
//       natBehavior: this.NATBehaviour,
//       publicIPs: this.publicIps,
//       socketType: 0
//     }
//     const regMessage = JSON.stringify(jsonbody);
//     console.log("Send===RegisterRequest", regMessage);
//     this.ws.send(regMessage);
//   }

//   public CallResponse(messageData: any) {
//     if(!messageData.sdpAnswer){
//         return
//     }
//   if (this.peer_connection) {
//     console.log("sdp received from server",messageData.sdpAnswer)
//     let sdpOffr = {
//       offer: {
//         type: 'answer',
//         sdp: messageData.sdpAnswer
//       }
//     }
//     this.log("##setting sdpOffr-->",  sdpOffr);
//     this.sendLocalIceToRemotePeer()
//     this.peer_connection.setRemoteDescription(new RTCSessionDescription({
//       // @ts-ignore:next-line
//       type: 'answer',
//       sdp: messageData.sdpAnswer
//     }))

   
//     // this.log('percon-->',this.peer_connection)
//   }

// }

// public sendLocalIceToRemotePeer() {
//   console.log('localicecandi arrau',this.localCandidatesArray)
//   if(this.localCandidatesArray.length>0){
//       this.localCandidatesArray.forEach(cand=>{
//           if(!cand){
//               return
//           }
//           console.log('candidate',cand)
//           var message = {
//               id : 'onIceCandidate',
//               requestType : 'onIceCandidate',
//               type:"request",
//               candidate : {
//                   candidate:cand.candidate
//               },
//               // referenceID:this.incommingCallResponse.from,//(offerSDP user ICE Candidate)
//               sessionUUID : this.session_uuid,
//                referenceID: this.ref_id,
//               to: this.callParamsData.to
              
//           };
//           this.log('*****sending ice from initiator side--->',message);
          
//           var jsonMessage = JSON.stringify(message);
//           this.ws.send(jsonMessage)
//   //   this.SendPacket(message);
//       })
//   }
  
// }

// public AddCandidate(messageData: any) {
//   if (this.peer_connection) {
//     this.log('##adding ice candidate to peer connection m init side', messageData.candidate.candidate);
//     this.peer_connection.addIceCandidate(messageData.candidate.candidate)
//   }
// }
// public Connect(mediaServer: any) {
//   this.log('in sdk connect->', mediaServer)
//   if (!mediaServer.includes('wss://')) {
//     this.emit("error", { type: "INVALID_HOST_PATTERN", message: "you entered invalid host server", mediaServer: mediaServer });
//   } else {
//     let websocketConn = new WebSocket(mediaServer)
//     websocketConn.onclose = (res: any) => {
//       this.log("OnClose socket sdk==",res);
//       this.emit("error", { type: "SOCKET_CLOSED", message: res.message ? res.message : "socket connection closed " });
//     };

//     websocketConn.onopen = () => {
//       this.ws = websocketConn
//       this.log("OnOpen socket==");
//       this.emit("connected", { type: "CONNECTION_ESTABLISHED", message: "You are connected successfully with VDOTOK server ! please register yourself now !" });
//     };

//     websocketConn.onerror = (res: any) => {

//       this.log("OnError socket==",res);
//       this.emit("error", { type: "SOCKET_CLOSED", message: res.message ? res.message : "socket connection closed " });
//     };

//     websocketConn.onmessage = (message) => {
//       var messageData = JSON.parse(message.data);

//       //ignoring pong message on console
//       if(messageData.requestType=='pong'){
//         // this.log('pong')
//       }else{
//       console.log('Received message from served: ', messageData);

//       }
//       switch (messageData.requestType) {
//         case 'register':
//           if (messageData.responseCode === 200) {
//             // {"bytes_interval": 60,
//             //  "isLoggingEnable": 1, 
//             //  "mcToken": "cef0d476e07b2a5f4dd0fc39e1e31186", 
//             //  "natBehavior": "Endpoint-Independent",
//             //   "natFiltering": "Port-Dependent", 
//             //   "ping_interval": 20,
//             //    "ping_timeout": 3,
//             //     "publicIPs": ["39.61.53.163"], 
//             //     "reConnect": 0, 
//             //     "referenceID": "fe6e77e01044c54861483098cd8d795a",
//             //      "requestID": "1668022276525", 
//             //      "requestType": "register",
//             //       "responseCode": 200,
//             //        "responseMessage": "accepted", 
//             //        "type": "response"}
            
//             this.mc_token = messageData.mcToken
//             this.log('You are registered successfully with vidtok server.', messageData)
//             this.emit("registered", { type: "REGISTER_RESPONSE", message: "You are successfully registered with VDOTOK server." });
//             setInterval(() => {
//               this.sendPing();
//             }, 3000);
            
//           } else {
//             this.log('You are not registered with vidtok server.', messageData)
//             this.emit("error", { type: "REGISTER_RESPONSE", message: "registeration failed with vdotok.", response: messageData.responseMessage });
//           }
//           // RegisterEventHandler_1.default.SetRegisterResponse(messageData, this);
//           break;
//         case 'callResponse':
//           this.log(' CallResponse: ', messageData);
//           this.CallResponse(messageData);
//           break;
//         case 'incomingCall':
//           this.session_uuid=messageData.sessionUUID;  
//           this.call_from=messageData.from;
//           this.incommingCallResponse=messageData
//           this.incomingCall(messageData);
//           break;
//         case 'startCommunication':
//           this.CallResponse(messageData);
//           break;
//         case 'stopCommunication':
//           this.log('Communication ended by remote peer', messageData);
//           //EventHandler.SessionEnd(messageData,this);
//           // this.DisposeWebrtc(true);
//           break;
//         case 'iceCandidate':
//           this.AddCandidate(messageData);
//           break;
//         case 'session_invite':
//           console.log('session invite');
//           //EventHandler.SessionInvite(messageData,this);
//           break;
      
//         case 'session_init':
//               //   {"mcToken": "b4300461c50cec5799b347905a74b393", 
//         //   "referenceIDs": [{"natBehavior": null, "natFiltering": null, "referenceID": "0f348b66a7b87ab542a9277d2783c825", "status": 0}],
//         //    "requestID": "1668023171605",
//         //     "requestType": "session_init", 
//         //     "responseCode": 200, "responseMessage": "accepted",
//         //      "turn_credentials": {"credential": "80j0MvugVou4Epgfb/yEJJ7G+6Y=", 
//         //      "url": ["turn:r-stun1.vdotok.dev:3478"],
//         //       "username": "1668109571:fe6e77e01044c54861483098cd8d795a"},
//         //        "type": "response"}
//             this.log('session init response -->',messageData)
//             if(messageData.responseCode==200){

//                 this.handleSessionInitResponse(messageData)
//             }else{
//                 this.emit("error", { type: "SESSION_INIT_ERROR", message: messageData.responseMessage});
//             }

//         break;
//         case 'session_cancel':
//           this.OnSessionCancel(messageData);
//           // console.log("===onParticipantOffer== exiting session_cancel", messageData, new Date().toLocaleTimeString());
//           //EventHandler.SessionCancel(messageData,this);
//           break;
//         /////////////////////////////////////////////
//         /////////  many to many events
//         case 'existing_participants':
//           // console.log("===onParticipantOffer== exiting", messageData, new Date().toLocaleTimeString());
//           // this.OnExistingParticipants(messageData);
//           //EventHandler.SetExistingParticipants(messageData,this);
//           break;
//         case 'new_participant_arrived':
//           // console.log("===onParticipantOffer== exiting new", messageData, new Date().toLocaleTimeString());
//           // this.OnNewParticipant(messageData);
//           break;
//         case 'participantLeft':
//           // console.log("===onParticipantOffer== exiting left", messageData, new Date().toLocaleTimeString());
//           // this.OnParticipantLeft(messageData);
//           break;
//         case 'state_information':
//           // console.log("===onParticipantOffer== exiting left", messageData, new Date().toLocaleTimeString());
//           // EventHandler_1.default.SetParticipantStatus(messageData, this);
//           break;
//         //EventHandler.SetExistingParticipants(messageData,this);
//         ////////   end many to many events
//         ////////////////////////////////////////////
//         //this.DisposeWebrtc(true);
//         case 'ping':
//           // this.SendPacket({ requestType: 'pong', "mcToken": this.McToken });
//           break;
//         default:
//         // console.error('Unrecognized message', messageData);
//       }
//     };

//   }
// }

//     public sayHellow() {
//         alert('hellow');

//     }
// }

// @ts-nocheck
import {NativeModules} from 'react-native'
import Logger from './Logger';
import mediaDevices from './MediaDevices';
import MediaStream from './MediaStream';
import MediaStreamTrack from './MediaStreamTrack';
import MediaStreamTrackEvent from './MediaStreamTrackEvent';
import permissions from './Permissions';
import RTCErrorEvent from './RTCErrorEvent';
import RTCIceCandidate from './RTCIceCandidate';
import RTCPeerConnection from './RTCPeerConnection';
import RTCRtpReceiver from './RTCRtpReceiver';
import RTCRtpSender from './RTCRtpSender';
import RTCRtpTransceiver from './RTCRtpTransceiver';
import RTCSessionDescription from './RTCSessionDescription';
import RTCView from './RTCView';
import ScreenCapturePickerView from './ScreenCapturePickerView';
import EventEmitter from 'events';
const NatManager = NativeModules.NatManager  ? NativeModules.NatManager  : new Proxy(
  {},
  {
    get() {
      throw new Error(LINKING_ERROR);
    },
  }
);
export class PeerClient extends EventEmitter {
    public ws: any;
    public project_id: any;
    public auth_token: any;
    public ref_id: any;
    public mc_token: any;
    public session_uuid: any;
    public peer_connection: any;
    public call_from: any;
    public local_stream: any;
    public remote_stream: any;
    public audio_paused: any = false;
    public stream_paused: any = false;
    public speakerOn: any = false;
    public Init_Credentials: any = {};
    public NATBehaviour: any = 'not detected';
    public NATFiltering: any = 'not detected';
    public publicIps: any = [];
    public callParamsData: any = {}
    public stunHost: any;
    public stunPort: any;
    public localCandidatesArray: any = [];
    public incommingCallResponse: any = {};
    public callType:any=null;
    public sessionConstraints: any = {
        mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
            // VoiceActivityDetection: true
        }
    };
    constructor(_Credentials: any) {
        super();
        console.log('params in peerclient', _Credentials)
        setTimeout(() => {
            if (_Credentials.host && _Credentials.projectId && _Credentials.stunHost && _Credentials.stunPort) {
              // NatManager.natTest("r-stun2.vdotok.dev",3478).then((e:any)=>{
              //   console.log('this is nat results',e)
              // })
                this.project_id = _Credentials.projectId
                this.Init_Credentials = _Credentials
                this.stunHost = _Credentials.stunHost
                this.stunPort = _Credentials.stunPort
                //   stunHost:stunCredentials.host,
                //   stunPort:stunCredentials.port
                  console.log('nat module =='+Platform.OS,"==",NativeModules.NatManager)
                  NatManager.natTest("r-stun2.vdotok.dev",3478).then((e:any)=>{
                // console.log("Got Nat filtering and behaviour",e)
                    if(Platform.OS=='android'){
                        // filtering behaviur ips
                        let rawString:any=e
                        console.log("it is raw string-->",rawString);
                        let stringToArray:any=rawString.split("<->")
                        console.log("it is stringToArray-->",stringToArray);
                        let filtering:any=stringToArray[0]
                        let behaviour:any=stringToArray[1]
                        let a:string=stringToArray[2]
                         a=a.replace("[","")
                         a=a.replace("]","")
                         console.log(a)
                         a=a.split(",")
                        let ips:any=a
                console.log("it is data after processing-->",filtering,behaviour,ips);
                // if(filtering && behaviour && ips){
                    this.NATBehaviour=behaviour
                    this.NATFiltering=filtering
                    this.publicIps=ips
                this.Connect(_Credentials.host);
                }else{
                  console.log('nat results in ios',e)
                  this.NATBehaviour='not detected ios'
                  this.NATFiltering='not detected ios'
                  this.publicIps=['dummyport']
                   this.Connect(_Credentials.host);
                    // alert("not got NAt filteriing,behaviour or ips")
                    // this.emit("error", { type: "NAT_DETECTION_ISSUE", message: "Issue on detecting NAT beaviour, NAT Filtering or PublicIps" });
                }
                // }
                  })
            } else {
                this.emit("error", { type: "INVALID_INITIALIZATION_ARGUMENTS", message: "Please make sure you provide projectId,host,stunHost,stunPort while initializing !" });
            }
        }, 500);
    }
    public log(...args: any) {
        // return;
        console.log(' ')
        console.log('====================== VDOTOK CONSOLE START ===================')
        console.log(args)
        console.log('====================== VDOTOK CONSOLE END ===================')
        console.log(' ')
    }
    public sendPing() {
        //   this.log('sending ping req:')
        let p = {
            "requestID": new Date().getTime().toString(),
            "requestType": "ping",
            "mcToken": this.mc_token
        }
        this.ws.send(JSON.stringify(p));
    }
    /**
* incomingCall
*/
    public incomingCall(messageData: any) {
        this.emit("call", { type: "CALL_RECEIVED", message: "Received a call", from: this.call_from, call_type: messageData.media_type });
    }
    public async AcceptCall() {
        let uUID=new Date().getTime().toString();
      //   const configuration = {"iceServers": [{"url": "stun:r-stun2.vdotok.dev:3478"}]};
        let pc :any;
        // let isFront = true;
              //   { call_type: 'one_to_one',
              //   callerSDP: 'sdp',
              //   data: {},
              //   from: 'fe6e77e01044c54861483098cd8d795a',
              //   isPeer: 1,
              //   media_type: 'video',
              //   requestID: '1668064736786',
              //   requestType: 'incomingCall',
              //   sessionUUID: '1668064736786',
              //   session_type: 'call',
              //   turn_credentials: 
              //    { credential: 'XspIFqtUqHfOPG9UIirCPGjpbEo=',
              //      url: [ 'turn:r-stun1.vdotok.dev:3478' ],
              //      username: '1668151136:0f348b66a7b87ab542a9277d2783c825' },
              //   type: 'request' }
          // @ts-ignore:next-line
          mediaDevices.getUserMedia({
            audio: true,
            video:this.callType=='audio'? false:true,
          })
          .then(async (stream) => {
            this.log('GOT local STREAM-->',stream);
            this.local_stream=stream
            this.emit("local_stream", { type: "GOT_LOCAL_STREAM", message: "this is your local stream", stream: stream });
          // const configuration = { "iceServers": [{ "url": "stun:r-stun2.vdotok.dev:3478" }] };
          const configuration = { "iceServers": [{ "urls": `stun:${this.stunHost}:${this.stunPort}`},
          //    data.turn_credentials
            {
                      "urls":  this.incommingCallResponse.turn_credentials.url,
                      "username":  this.incommingCallResponse.turn_credentials.username,
                      "credential": this.incommingCallResponse.turn_credentials.credential
                    }
          ],
      sdpSemantics:'plan-b',
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
      };
          //   const configuration = { "iceServers": [{ "url": "stun:r-stun2.vdotok.dev:3478" }] };
          console.log('this is peer connection init',configuration)
             pc = new RTCPeerConnection(configuration);
           this.peer_connection=pc
            this.log('adding stream in pc-->',pc);
          //   let trackss=   stream._tracks
          //   console.log("tracksssss mm",trackss)
          //      trackss.forEach((track: any) =>
          //    {
          //      console.log('i am in this loop')
          //      pc.addTrack(track)}
          //    );
          let s2=new MediaStream(stream)
          s2.getTracks().forEach((track) => {
          pc.addTrack(track)
          })
          //   pc.addStream(stream)
            this.log('adding stream in pc-->',pc);
            let des:any=
              {
                  // @ts-ignore:next-line
                  type: "offer",
                  // @ts-ignore:next-line
                  sdp: this.incommingCallResponse.callerSDP
                }
            const offerDescription = new RTCSessionDescription(des);
            this.log("this is offer desc->",offerDescription)
              await pc.setRemoteDescription( offerDescription );
           this.log("remote desc set")
          // const answerDescription = await peerConnection.createAnswer();
         // await peerConnection.setLocalDescription( answerDescription );
            // @ts-ignore:next-line
            pc.createAnswer(this.sessionConstraints).then(desc => {
              this.log('desccccc after answer',desc);
              let description: any = new RTCSessionDescription(
                {
                  // @ts-ignore:next-line
                  type: desc.type,
                  // @ts-ignore:next-line
                  sdp: desc.sdp
                }
              )
              pc.setLocalDescription(description).then(() => {
                this.log('setLocalDescription');
                // Send pc.localDescription to peer
              //   return
              //   {
              //     "from": "5d877b6cc3bc516a3486b0435df8781a",
              //     "to": [
              //         "775437e8715b89f2e9f388363a8bcd83"
              //     ],
              //     "sdpOffer": "sdp",
              //     "requestType": "session_invite",
              //     "call_type": "one_to_one",
              //     "session_type": "call",
              //     "media_type": "video",
              //     "requestID": "N5HGEOOQ3H1RBLADS2UVN1XW3EBV81QS",
              //     "sessionUUID": "W3UFRWDIPLFAAL27RVLKB9C4RQTYJWAL",
              //     "mcToken": "7c37959cbcc2fa7d43546c644b6c0ae9",
              //     "isRecord": 1,
              //     "isPeer": 1,
              //     "data": "refdskdesdweoosdomw",
              //     "responseCode": "200",
              //     "responseMessage": "accepted"
              // }
                let response ={
                    "type":"request",
                    "requestType":"session_invite",
                    "sdpOffer":description.sdp,
                    "requestID":uUID,
                    mcToken:this.mc_token,
                    isPeer:1,
                    media_type:this.callType=="audio"?"audio":"video",
                    // "media_type":"video",
                    "sessionUUID":this.incommingCallResponse.sessionUUID,
                    "responseCode":200,
                    session_type:"call",
                    "responseMessage":"accepted"
                };
                  let reqMessage=JSON.stringify(response);
                  this.log("===OnOffering Answer",reqMessage);
          this.ws.send(reqMessage);
              });
            });
            // @ts-ignore:next-line
            pc.onicecandidate = (event)=> {
              this.log('on receiver ice_candidate-->',event);
              // {
              //     "requestType": "onIceCandidate",
              //     "candidate": {
              //         "candidate": "candidate:829852397 1 udp 2122260223 192.168.1.31 50201 typ host generation 0 ufrag qgoA network-id 1 network-cost 10",
              //         "sdpMid": "0",
              //         "sdpMLineIndex": 0
              //     },
              //     "type": "request",
              //     "sessionUUID": "W3UFRWDIPLFAAL27RVLKB9C4RQTYJWAL",
              //     "referenceID": "5d877b6cc3bc516a3486b0435df8781a",
              //     "to": [
              //         "775437e8715b89f2e9f388363a8bcd83"
              //     ]
              // }
              // return
              var message = {
                  id : 'onIceCandidate',
                  requestType : 'onIceCandidate',
                  type:"request",
                  candidate : {
                      candidate:(event as any).candidate
                  },
                  // referenceID:this.incommingCallResponse.from,//(offerSDP user ICE Candidate)
                  sessionUUID : this.incommingCallResponse.sessionUUID,
                   referenceID: this.ref_id,
                  to: [
                      this.incommingCallResponse.from
                  ]
              };
              this.log('*****sending ice candidate--->',message);
              var jsonMessage = JSON.stringify(message);
              this.ws.send(jsonMessage)
            //   send event.candidate to peer
            };
            // @ts-ignore:next-line
            pc.onaddstream=(event)=>{
              alert("got remote stream")
            // @ts-ignore:next-line
            // if((event as any).streams[0]._tracks.length==2){
              // this.setState({ remoteStream: event.stream })
              this.log('remote streammm o--->', (event as any).stream);
               //   alert('got remote stream')
               this.remote_stream=(event as any).streams
               this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).stream });
              //  }
            // // alert('remote')
            // if(event.streams.length<2){
            //   return;
            //   }
            //     console.log('remote streammm--->',event.streams);
            //     this.remote_stream=(event as any).streams
            // this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).streams });
            //   //   alert('got remote stream')
            }
            pc.ontrack=(event)=>
            {
                console.log("p2 track",event)
                console.log("p2 track :D ->",(event.streams))
                if(event.receiver._track.kind=='video'){
                  let st=new MediaStream()
                  st.addTrack(new MediaStreamTrack(event.receiver._track))
                  console.log('p2 stream-->',st);
                 this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: st});
                //   setpc2RemoteStream(st)
                }
                  else{
                    let st=new MediaStream()
                    st.addTrack(new MediaStreamTrack(event.receiver._track))
                    console.log('p2 stream-->',st);
                    this.remote_stream=st
                    this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: st});
                }
                }
            // Got stream!
          })
          .catch(error => {
            console.log('error-->',error);
            // Log error
          });
      }
    /**
     * DeclineCall
     */
     public DeclineCall() {
      // console.error("are you sure to decline call")
      let messageStop={
        "type":"request",
        "requestType":"session_cancel",
        "requestID":new Date().getTime().toString(),
        "sessionUUID":this.session_uuid,
        "mcToken":this.mc_token
    };  
    this.log('declining call',JSON.stringify(messageStop))
    this.ws.send(JSON.stringify(messageStop));
    // removeStream
    // Vdotok1.destroySession();
    this.endForegroundService()
  //   this.peerCon
    }
 /**
   * Disconnect
   */
  public Disconnect() {
    //   this.peerCon
    if(this.peer_connection){
    // this.peer_connection.close()
    }
    this.endForegroundService()
  }
   /**
   * PauseStream
   */
    public PauseStream() {
      if(this.local_stream && !this.stream_paused){
      this.log('PauseStream')
        this.local_stream.getVideoTracks().forEach((track:any) => {
        track.enabled =false
      }) 
      this.stream_paused=true
      this.emit("stream_state_info", { type: "STREAM_STATE_CHANGED", message: "Stream state is changed", paused:true });
      }
    }
    public ResumeStream() {
      if(this.local_stream && this.stream_paused){
      this.log('ResumeStream')
        this.local_stream.getVideoTracks().forEach((track:any) => {
        track.enabled =true
      }) 
      this.stream_paused=false
      this.emit("stream_state_info", { type: "STREAM_STATE_CHANGED", message: "Stream state is changed", paused:false });
      }
    }
    public SwitchCamera() {
      if(this.local_stream){
       this.log('switchCamera')
       this.local_stream.getVideoTracks().forEach((track:any) => {
         track._switchCamera();
     })
      }
     }
       /**
   * MuteMic
   */
  public MuteMic() {
    if(this.local_stream && !this.audio_paused){
    this.log('MuteMic')
      this.local_stream.getAudioTracks().forEach((track:any) => {
      track.enabled =false
    }) 
    this.audio_paused=true
    this.emit("audio_state_info", { type: "AUDIO_STATE_CHANGED", message: "Audio state is changed", muted:true });
    }
  }
  /**
   * UnmuteMic
   */
   public UnmuteMic() {
    if(this.local_stream && this.audio_paused){
    this.log('UnmuteMic')
      this.local_stream.getAudioTracks().forEach((track:any) => {
      track.enabled =true
    }) 
    this.audio_paused=false
    this.emit("audio_state_info", { type: "AUDIO_STATE_CHANGED", message: "Audio state is changed", muted:false });
    }
  }
  public async GetStream(params:any) {
    let stream=null
    if (params.type && params.type === 'screen') {
      try {
        // const channelId = await notifee.createChannel({
        //   id: 'screen_capture',
        //   name: 'Screen Capture',
        //   lights: false,
        //   vibration: false,
        //   importance: AndroidImportance.DEFAULT
        // });
        // await notifee.displayNotification({
        //   title: params.type === 'screen'?'Screen Capture':'Camera Capture',
        //   body: 'This notification will be here until you stop capturing.',
        //   android: {
        //     channelId,
        //     asForegroundService: true,
        //      actions: [
        //       {
        //         title: 'Stop',
        //         pressAction: {
        //           id: 'stop',
        //         },
        //       },
        //     ],
        //   }
        // })
        stream = await mediaDevices.getDisplayMedia();
      this.log('got stream in separate funct',stream)
      }
       catch (err) {
        this.log("err", err)
        // Handle Error
      };
    }
    else if(params.type && params.type === 'audio') {
      stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false
      }
      )
      this.log('got stream in separate funct for audio',stream)
    }
    else {
      stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true
      }
      )
      this.log('got stream in separate funct',stream)
    }
    return stream
  }
  public async endForegroundService() {
    if(this.peer_connection){
      if(this.local_stream){
      // this.local_stream.release
        // this.peer_connection.removeStream(this.local_stream)
      }
      this.peer_connection.close()
      this.local_stream=null
      this.peer_connection=null
      this.audio_paused=false;
      this.stream_paused=false;
      this.local_stream=null
      this.remote_stream=null
      this.incommingCallResponse={}
      }
    // await notifee.stopForegroundService()
  }
  public async OneToOneCall(params: any) {
          this.callParamsData=params
          let uUID = new Date().getTime().toString();
          this.session_uuid = uUID
          let initReq= {
                "from": this.ref_id,
                "to": params.to,
                "type": "request",
                "requestType": "session_init",
                "call_type": "one_to_one",
                "session_type": "call",
                // "media_type": "video",
                "media_type":params.type=="audio"?"audio":"video",
                "requestID": this.session_uuid ,
                "mcToken": this.mc_token
            }
          let reqMessage = JSON.stringify(initReq);
          this.log("sending session initReq", reqMessage);
          this.ws.send(reqMessage);
        }
  /**
     * OnSessionCancel
     */
   public OnSessionCancel(data:any) {
    this.emit("call", { type: "CALL_ENDED", message: "call is ended", data:data });
    // if(this.peer_connection){
    //   this.peer_connection.close()
    // }
    this.endForegroundService()
  }
  public async handleSessionInitResponse(data) {
    //   {"mcToken": "b4300461c50cec5799b347905a74b393", 
//   "referenceIDs": [{"natBehavior": null, "natFiltering": null, "referenceID": "0f348b66a7b87ab542a9277d2783c825", "status": 0}],
//    "requestID": "1668023171605",
//     "requestType": "session_init", 
//     "responseCode": 200, "responseMessage": "accepted",
//      "turn_credentials": {"credential": "80j0MvugVou4Epgfb/yEJJ7G+6Y=", 
//      "url": ["turn:r-stun1.vdotok.dev:3478"],
//       "username": "1668109571:fe6e77e01044c54861483098cd8d795a"},
//        "type": "response"}
let params:any=this.callParamsData
if(data.requestID===this.session_uuid){
this.log('one to one call params', params)
let stream: any = null
stream =await this.GetStream(params)
this.log('this is what i gottt----',stream)
// return;
// this.log("got stream", stream)
if(!stream){
    // @ts-ignore:next-line
//   alert('No stream got');
this.emit("error", { type: "NO_STREAM_GOT", message: "unable to get stream"});
this.endForegroundService()
return;
}
// this.log("got stream", stream)
this.local_stream=stream
this.emit("local_stream", { type: "GOT_LOCAL_STREAM", message: "this is your local stream", stream: stream });
// const str2 = await mediaDevices.getUserMedia({
// audio: true,
// video: false}
// )
// console.error("2nd stream",str2)
// let  yomo = new MediaStream([stream._tracks[0], str2._tracks[0]]);
// console.error('third stream-->',yomo)
// setStream(stream)
// iceServers: [
//     {
//         urls: [ 'stun:domain:port']
//     },
//     {
//         urls: [ 'turn:domain:port'],
//         username: "long lived username",
//         credential: "long lived password"
//       }
// ]
const configuration = { "iceServers": [{ "urls": `stun:${this.stunHost}:${this.stunPort}`},
//    data.turn_credentials
{
      "urls":  data.turn_credentials.url,
      "username":  data.turn_credentials.username,
      "credential": data.turn_credentials.credential
    }
]
,
sdpSemantics:'plan-b',
iceTransportPolicy: 'all',
bundlePolicy: 'max-bundle',
rtcpMuxPolicy: 'require' };
console.log('i am here',configuration)
let peerConstraints = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};
const pc = new RTCPeerConnection(configuration);
// return;
this.peer_connection = pc
// pc.addEventListener( 'connectionstatechange', event => {
//     console.log(event)
//     switch( pc.connectionState ) {
//         case 'closed':
//             // You can handle the call being disconnected here.
//             break;
//     };
// } );
// pc.addEventListener( 'icecandidate', event => {
//     console.log(event)
//     // When you find a null candidate then there are no more candidates.
//     // Gathering of candidates has finished.
//     if ( !event.candidate ) { return; };
//     // Send the event.candidate onto the person you're calling.
//     // Keeping to Trickle ICE Standards, you should send the candidates immediately.
// } );
// pc.addEventListener( 'icecandidateerror', event => {
//     console.log(event)
//     // You can ignore some candidate errors.
//     // Connections can still be made even when errors occur.
// } );
// pc.addEventListener( 'iceconnectionstatechange', event => {
//     console.log(event)
//     switch( pc.iceConnectionState ) {
//         case 'connected':
//         case 'completed':
//             // You can handle the call being connected here.
//             // Like setting the video streams to visible.
//             break;
//     };
// } );
// pc.addEventListener( 'negotiationneeded', event => {
//     console.log(event)
//     // You can start the offer stages here.
//     // Be careful as this event can be called multiple times.
// } );
// pc.addEventListener( 'signalingstatechange', event => {
//     console.log(event)
//     switch( pc.signalingState ) {
//         case 'closed':
//             // You can handle the call being disconnected here.
//             break;
//     };
// } );
// pc.addEventListener( 'addstream', event => {
//     console.log(event)
//     // Grab the remote stream from the connected participant.
//     // remoteMediaStream = event.stream;
// } );
this.log('going to add stream in pc loop-->', pc);
let s2=new MediaStream(stream)
s2.getTracks().forEach((track) => {
pc.addTrack(track)
})
// setpc2(p2)
//  pc.addStream(stream)
this.log('going to create offer');
pc.createOffer(this.sessionConstraints).then(desc => {
this.log('got description :', desc);
let description: any = new RTCSessionDescription(
  {
    // @ts-ignore:next-line
    type: desc.type,
    // @ts-ignore:next-line
    sdp: desc.sdp
  }
)
this.log('goint to get local description');
pc.setLocalDescription(description).then(() => {
  this.log('local description set succesfully');
  // Send pc.localDescription to peer
  // return
  // {
  //     "from": "775437e8715b89f2e9f388363a8bcd83",
  //     "to": [
  //         "5d877b6cc3bc516a3486b0435df8781a"
  //     ],
  //     "sdpOffer": "v=0\r\no=- 61805455483770538 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1 2\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111 63 103 104 9 0 8 106 105 13 110 112 113 126\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:iofx\r\na=ice-pwd:EgnjNjFBmlY2TfTlETQhBRmZ\r\na=ice-options:trickle\r\na=fingerprint:sha-256 06:8E:31:79:A2:42:7A:35:D3:E7:5E:8D:9D:FD:8C:1A:FB:78:5D:39:4E:9C:8B:9E:02:D5:5E:92:23:8D:62:DB\r\na=setup:actpass\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=sendrecv\r\na=msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv e516068d-0bdf-42a9-ba75-f0dda121db8d\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=rtcp-fb:111 transport-cc\r\na=fmtp:111 minptime=10;useinbandfec=1\r\na=rtpmap:63 red/48000/2\r\na=fmtp:63 111/111\r\na=rtpmap:103 ISAC/16000\r\na=rtpmap:104 ISAC/32000\r\na=rtpmap:9 G722/8000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:106 CN/32000\r\na=rtpmap:105 CN/16000\r\na=rtpmap:13 CN/8000\r\na=rtpmap:110 telephone-event/48000\r\na=rtpmap:112 telephone-event/32000\r\na=rtpmap:113 telephone-event/16000\r\na=rtpmap:126 telephone-event/8000\r\na=ssrc:3076525376 cname:RvfGWXU5Y82EmW8b\r\na=ssrc:3076525376 msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv e516068d-0bdf-42a9-ba75-f0dda121db8d\r\nm=video 9 UDP/TLS/RTP/SAVPF 96 97 102 122 127 121 125 107 108 109 124 120 39 40 45 46 98 99 100 101 123 119 114 115 116\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:iofx\r\na=ice-pwd:EgnjNjFBmlY2TfTlETQhBRmZ\r\na=ice-options:trickle\r\na=fingerprint:sha-256 06:8E:31:79:A2:42:7A:35:D3:E7:5E:8D:9D:FD:8C:1A:FB:78:5D:39:4E:9C:8B:9E:02:D5:5E:92:23:8D:62:DB\r\na=setup:actpass\r\na=mid:1\r\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:13 urn:3gpp:video-orientation\r\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\r\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv 95f4d91a-e713-497a-8cd0-6c030ca3676f\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:102 H264/90000\r\na=rtcp-fb:102 goog-remb\r\na=rtcp-fb:102 transport-cc\r\na=rtcp-fb:102 ccm fir\r\na=rtcp-fb:102 nack\r\na=rtcp-fb:102 nack pli\r\na=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\na=rtpmap:122 rtx/90000\r\na=fmtp:122 apt=102\r\na=rtpmap:127 H264/90000\r\na=rtcp-fb:127 goog-remb\r\na=rtcp-fb:127 transport-cc\r\na=rtcp-fb:127 ccm fir\r\na=rtcp-fb:127 nack\r\na=rtcp-fb:127 nack pli\r\na=fmtp:127 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\na=rtpmap:121 rtx/90000\r\na=fmtp:121 apt=127\r\na=rtpmap:125 H264/90000\r\na=rtcp-fb:125 goog-remb\r\na=rtcp-fb:125 transport-cc\r\na=rtcp-fb:125 ccm fir\r\na=rtcp-fb:125 nack\r\na=rtcp-fb:125 nack pli\r\na=fmtp:125 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:107 rtx/90000\r\na=fmtp:107 apt=125\r\na=rtpmap:108 H264/90000\r\na=rtcp-fb:108 goog-remb\r\na=rtcp-fb:108 transport-cc\r\na=rtcp-fb:108 ccm fir\r\na=rtcp-fb:108 nack\r\na=rtcp-fb:108 nack pli\r\na=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\na=rtpmap:109 rtx/90000\r\na=fmtp:109 apt=108\r\na=rtpmap:124 H264/90000\r\na=rtcp-fb:124 goog-remb\r\na=rtcp-fb:124 transport-cc\r\na=rtcp-fb:124 ccm fir\r\na=rtcp-fb:124 nack\r\na=rtcp-fb:124 nack pli\r\na=fmtp:124 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f\r\na=rtpmap:120 rtx/90000\r\na=fmtp:120 apt=124\r\na=rtpmap:39 H264/90000\r\na=rtcp-fb:39 goog-remb\r\na=rtcp-fb:39 transport-cc\r\na=rtcp-fb:39 ccm fir\r\na=rtcp-fb:39 nack\r\na=rtcp-fb:39 nack pli\r\na=fmtp:39 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f\r\na=rtpmap:40 rtx/90000\r\na=fmtp:40 apt=39\r\na=rtpmap:45 AV1/90000\r\na=rtcp-fb:45 goog-remb\r\na=rtcp-fb:45 transport-cc\r\na=rtcp-fb:45 ccm fir\r\na=rtcp-fb:45 nack\r\na=rtcp-fb:45 nack pli\r\na=rtpmap:46 rtx/90000\r\na=fmtp:46 apt=45\r\na=rtpmap:98 VP9/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=fmtp:98 profile-id=0\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:100 VP9/90000\r\na=rtcp-fb:100 goog-remb\r\na=rtcp-fb:100 transport-cc\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=fmtp:100 profile-id=2\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100\r\na=rtpmap:123 H264/90000\r\na=rtcp-fb:123 goog-remb\r\na=rtcp-fb:123 transport-cc\r\na=rtcp-fb:123 ccm fir\r\na=rtcp-fb:123 nack\r\na=rtcp-fb:123 nack pli\r\na=fmtp:123 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=64001f\r\na=rtpmap:119 rtx/90000\r\na=fmtp:119 apt=123\r\na=rtpmap:114 red/90000\r\na=rtpmap:115 rtx/90000\r\na=fmtp:115 apt=114\r\na=rtpmap:116 ulpfec/90000\r\na=ssrc-group:FID 313879382 760964036\r\na=ssrc:313879382 cname:RvfGWXU5Y82EmW8b\r\na=ssrc:313879382 msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv 95f4d91a-e713-497a-8cd0-6c030ca3676f\r\na=ssrc:760964036 cname:RvfGWXU5Y82EmW8b\r\na=ssrc:760964036 msid:em9LINwcS3BgjluqwnhaWL6hKvoWW4DpzzTv 95f4d91a-e713-497a-8cd0-6c030ca3676f\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:iofx\r\na=ice-pwd:EgnjNjFBmlY2TfTlETQhBRmZ\r\na=ice-options:trickle\r\na=fingerprint:sha-256 06:8E:31:79:A2:42:7A:35:D3:E7:5E:8D:9D:FD:8C:1A:FB:78:5D:39:4E:9C:8B:9E:02:D5:5E:92:23:8D:62:DB\r\na=setup:actpass\r\na=mid:2\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n",
  //     "type": "request",
  //     "requestType": "session_invite",
  //     "call_type": "one_to_one",
  //     "session_type": "call",
  //     "media_type": "video",
  //     "requestID": "VQN9CUKTR69LM4VXGEHVTBRE0LV7BEWJ",
  //     "sessionUUID": "BXH9PB5NYUFAEW67BVH8HG27ILKRXJW9",
  //     "mcToken": "f27d1c09a2203b55500049671ba49cea",
  //     "isRecord": 1,
  //     "isPeer": 1,
  //     "data": "refdskdesdweoosdomw"
  // }
  let req = {
    //"id":"call",
    from: this.ref_id,
    to: params.to,
    type: "request",
    requestType: "session_invite",
    session_type: "call",
    call_type: "one_to_one",
    media_type: this.callParamsData.type=='audio'?'audio':"video",
    requestID: data.requestID,
    sessionUUID: data.requestID,
    mcToken: this.mc_token,
    sdpOffer: description.sdp,
    isPeer: 1,
    data: {}
  }
  let reqMessage = JSON.stringify(req);
  this.log("sending call request now", reqMessage);
  this.ws.send(reqMessage);
});
}).catch(err=>{
  console.log(err);
});
pc.onicecandidate = (event) => {
this.log('on ie candidate-->', event);
this.localCandidatesArray.push((event as any).candidate)
//   var message = {
//     id : 'onIceCandidate',
//     requestType : 'onIceCandidate',
//     type:"request",
//     candidate : candidate,
//     referenceID:messageData.from, //(offerSDP user ICE Candidate)
//     sessionUUID : this.sessionUUID
// };
// this.SendPacket(message);
// return
// var message = {
//   id: 'onIceCandidate',
//   requestType: 'onIceCandidate',
//   type: "request",
//   candidate: {
//     candidate: (event as any).candidate
//   },
//   referenceID: this.ref_id,//(offerSDP user ICE Candidate)
//   sessionUUID: this.session_uuid
// };
// this.log('*****sending ice candidate--->', message);
// var jsonMessage = JSON.stringify(message);
// this.ws.send(jsonMessage)
//   send event.candidate to peer
};
pc.onaddstream = (event) => {
// @ts-ignore:next-line
// alert('remote')
// if((event as any).streams[0]._tracks.length==2){
this.log('remote streammm o--->', (event as any).stream);
// this.setState({ remoteStream: event.stream })
//  this.log('remote streammm o--->', (event as any).streams);
// alert("got remote stream")
//   alert('got remote stream')
this.remote_stream=(event as any).stream
this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).stream });
// }
}
pc.ontrack=(event)=>
  {
      console.log("p2 track",event)
      console.log("p2 track :D ->",(event.streams))
      if(event.receiver._track.kind=='video'){
        let st=new MediaStream()
        st.addTrack(new MediaStreamTrack(event.receiver._track))
        console.log('p2 stream-->',st);
        this.remote_stream=st
       this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: st});
      //   setpc2RemoteStream(st)
      }
      else{
        let st=new MediaStream()
        st.addTrack(new MediaStreamTrack(event.receiver._track))
        console.log('p2 stream-->',st);
        this.remote_stream=st
        this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: st});
      }
      }
}else{
alert('request and session uuid mismatch in sessionint resp')
}
}
  /**
     * Register
     */
   public Register(auth_token: any, ref_id: any) {
    this.log('in register func sdk==>', auth_token, ref_id)
    this.ref_id = ref_id;
    this.auth_token = auth_token;
    let jsonbody = {
      requestType: "register",
      type: "request",
      requestID: new Date().getTime().toString(),
      tenantID: this.project_id,
      projectID: this.project_id,
      referenceID: ref_id,
      authorizationToken: auth_token,
      natFiltering: this.NATFiltering,
      natBehavior: this.NATBehaviour,
      publicIPs: this.publicIps,
      socketType: 0
    }
    const regMessage = JSON.stringify(jsonbody);
    console.log("Send===RegisterRequest", regMessage);
    this.ws.send(regMessage);
  }
  public CallResponse(messageData: any) {
    if(!messageData.sdpAnswer){
        return
    }
  if (this.peer_connection) {
    console.log("sdp received from server",messageData.sdpAnswer)
    let sdpOffr = {
      offer: {
        type: 'answer',
        sdp: messageData.sdpAnswer
      }
    }
    this.log("##setting sdpOffr-->",  sdpOffr);
    this.sendLocalIceToRemotePeer()
    this.peer_connection.setRemoteDescription(new RTCSessionDescription({
      // @ts-ignore:next-line
      type: 'answer',
      sdp: messageData.sdpAnswer
    }))
    // this.log('percon-->',this.peer_connection)
  }
}
public sendLocalIceToRemotePeer() {
  console.log('localicecandi arrau',this.localCandidatesArray)
  if(this.localCandidatesArray.length>0){
      this.localCandidatesArray.forEach(cand=>{
          if(!cand){
              return
          }
          console.log('candidate',cand)
          var message = {
              id : 'onIceCandidate',
              requestType : 'onIceCandidate',
              type:"request",
              candidate : {
                  candidate:cand.candidate
              },
              // referenceID:this.incommingCallResponse.from,//(offerSDP user ICE Candidate)
              sessionUUID : this.session_uuid,
               referenceID: this.ref_id,
              to: this.callParamsData.to
          };
          this.log('*****sending ice from initiator side--->',message);
          var jsonMessage = JSON.stringify(message);
          this.ws.send(jsonMessage)
  //   this.SendPacket(message);
      })
  }
}
public AddCandidate(messageData: any) {
  if (this.peer_connection) {
    this.log('##adding ice candidate to peer connection m init side', messageData.candidate.candidate);
    this.peer_connection.addIceCandidate(messageData.candidate.candidate)
  }
}
public Connect(mediaServer: any) {
  this.log('in sdk connect->', mediaServer)
  if (!mediaServer.includes('wss://')) {
    this.emit("error", { type: "INVALID_HOST_PATTERN", message: "you entered invalid host server", mediaServer: mediaServer });
  } else {
    let websocketConn = new WebSocket(mediaServer)
    websocketConn.onclose = (res: any) => {
      this.log("OnClose socket sdk==",res);
      this.emit("error", { type: "SOCKET_CLOSED", message: res.message ? res.message : "socket connection closed " });
    };
    websocketConn.onopen = () => {
      this.ws = websocketConn
      this.log("OnOpen socket==");
      this.emit("connected", { type: "CONNECTION_ESTABLISHED", message: "You are connected successfully with VDOTOK server ! please register yourself now !" });
    };
    websocketConn.onerror = (res: any) => {
      this.log("OnError socket==",res);
      this.emit("error", { type: "SOCKET_CLOSED", message: res.message ? res.message : "socket connection closed " });
    };
    websocketConn.onmessage = (message) => {
      var messageData = JSON.parse(message.data);
      //ignoring pong message on console
      if(messageData.requestType=='pong'){
        // this.log('pong')
      }else{
      console.log('Received message from served: ', messageData);
      }
      switch (messageData.requestType) {
        case 'register':
          if (messageData.responseCode === 200) {
            // {"bytes_interval": 60,
            //  "isLoggingEnable": 1, 
            //  "mcToken": "cef0d476e07b2a5f4dd0fc39e1e31186", 
            //  "natBehavior": "Endpoint-Independent",
            //   "natFiltering": "Port-Dependent", 
            //   "ping_interval": 20,
            //    "ping_timeout": 3,
            //     "publicIPs": ["39.61.53.163"], 
            //     "reConnect": 0, 
            //     "referenceID": "fe6e77e01044c54861483098cd8d795a",
            //      "requestID": "1668022276525", 
            //      "requestType": "register",
            //       "responseCode": 200,
            //        "responseMessage": "accepted", 
            //        "type": "response"}
            this.mc_token = messageData.mcToken
            this.log('You are registered successfully with vidtok server.', messageData)
            this.emit("registered", { type: "REGISTER_RESPONSE", message: "You are successfully registered with VDOTOK server." });
            setInterval(() => {
              this.sendPing();
            }, 3000);
          } else {
            this.log('You are not registered with vidtok server.', messageData)
            this.emit("error", { type: "REGISTER_RESPONSE", message: "registeration failed with vdotok.", response: messageData.responseMessage });
          }
          // RegisterEventHandler_1.default.SetRegisterResponse(messageData, this);
          break;
        case 'callResponse':
          this.log(' CallResponse: ', messageData);
          this.CallResponse(messageData);
          break;
        case 'incomingCall':
          this.session_uuid=messageData.sessionUUID;  
          this.call_from=messageData.from;
          this.incommingCallResponse=messageData
          this.callType=messageData.media_type
          this.incomingCall(messageData);
          break;
        case 'startCommunication':
          this.CallResponse(messageData);
          break;
        case 'stopCommunication':
          this.log('Communication ended by remote peer', messageData);
          //EventHandler.SessionEnd(messageData,this);
          // this.DisposeWebrtc(true);
          break;
        case 'iceCandidate':
          this.AddCandidate(messageData);
          break;
        case 'session_invite':
          console.log('session invite');
          //EventHandler.SessionInvite(messageData,this);
          break;
        case 'session_init':
              //   {"mcToken": "b4300461c50cec5799b347905a74b393", 
        //   "referenceIDs": [{"natBehavior": null, "natFiltering": null, "referenceID": "0f348b66a7b87ab542a9277d2783c825", "status": 0}],
        //    "requestID": "1668023171605",
        //     "requestType": "session_init", 
        //     "responseCode": 200, "responseMessage": "accepted",
        //      "turn_credentials": {"credential": "80j0MvugVou4Epgfb/yEJJ7G+6Y=", 
        //      "url": ["turn:r-stun1.vdotok.dev:3478"],
        //       "username": "1668109571:fe6e77e01044c54861483098cd8d795a"},
        //        "type": "response"}
            this.log('session init response -->',messageData)
            if(messageData.responseCode==200){
                this.handleSessionInitResponse(messageData)
            }else{
                this.emit("error", { type: "SESSION_INIT_ERROR", message: messageData.responseMessage});
            }
        break;
        case 'session_cancel':
          this.OnSessionCancel(messageData);
          // console.log("===onParticipantOffer== exiting session_cancel", messageData, new Date().toLocaleTimeString());
          //EventHandler.SessionCancel(messageData,this);
          break;
        /////////////////////////////////////////////
        /////////  many to many events
        case 'existing_participants':
          // console.log("===onParticipantOffer== exiting", messageData, new Date().toLocaleTimeString());
          // this.OnExistingParticipants(messageData);
          //EventHandler.SetExistingParticipants(messageData,this);
          break;
        case 'new_participant_arrived':
          // console.log("===onParticipantOffer== exiting new", messageData, new Date().toLocaleTimeString());
          // this.OnNewParticipant(messageData);
          break;
        case 'participantLeft':
          // console.log("===onParticipantOffer== exiting left", messageData, new Date().toLocaleTimeString());
          // this.OnParticipantLeft(messageData);
          break;
        case 'state_information':
          // console.log("===onParticipantOffer== exiting left", messageData, new Date().toLocaleTimeString());
          // EventHandler_1.default.SetParticipantStatus(messageData, this);
          break;
        //EventHandler.SetExistingParticipants(messageData,this);
        ////////   end many to many events
        ////////////////////////////////////////////
        //this.DisposeWebrtc(true);
        case 'ping':
          // this.SendPacket({ requestType: 'pong', "mcToken": this.McToken });
          break;
        default:
        // console.error('Unrecognized message', messageData);
      }
    };
  }
}
    public sayHellow() {
        alert('hellow');
    }
}