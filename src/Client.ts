// @ts-nocheck

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
export class Client extends EventEmitter {
    public ws: any;
    public project_id: any;
    public auth_token: any;
    public ref_id: any;
    public mc_token: any;
    public session_uuid: any;
    public peer_connection: any;
    public call_from:any;
    public local_stream:any;
    public remote_stream:any;
    public audio_paused:any=false;
    public stream_paused:any=false;
    public speakerOn:any=false;

    public sessionConstraints:any = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true
      }
    };

    constructor(_Credentials: any) {
      super();
  
      console.log('sdk constructor->', _Credentials)
      setTimeout(() => {
  
        if (_Credentials.host && _Credentials.projectId) {
//           const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
//           let pc= new RTCPeerConnection(configuration)
// console.log('i am here brothers',pc)
//           return;
          this.project_id = _Credentials.projectId
          this.Connect(_Credentials.host);

        //   notifee.onForegroundEvent(async ({ type, detail }) => {
        //     console.log('notif notif',type,detail)
        //   // @ts-ignore:next-line
        //     if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop') {
        //       await notifee.stopForegroundService()
        //       this.emit('stop_session',{
        //         type:"STOP_SESSION"
        //       })
        //     }
        //     });
  
        } else {
          this.emit("error", { type: "INVALID_INITIALIZATION_ARGUMENTS", message: "host or projectId is missing while initialization" });
  
        }
      }, 500);
      //window.addEventListener('offline', this.onOffline);
    }
    public log(...args: any) {
  // return;
      console.log(' ')
      console.log('====================== VDOTOK CONSOLE START ===================')
      console.log(args)
      console.log('====================== VDOTOK CONSOLE END ===================')
      console.log(' ')
    }


    /**
     * stunInfo
     */
    public stunInfo() {
      // @ts-ignore:next-line
      // aalert('stun')
      // Vdotok1.stun()
      
    }
    /**
     * ping
     */
    public sendPing() {
      this.log('sending ping req:')
      let p= {
      "requestID":new Date().getTime().toString(),
      "requestType":"ping",
      "mcToken":this.mc_token }
      this.ws.send(JSON.stringify(p));
    }
  
  
    /**
     * incomingCall
     */
    public incomingCall(messageData:any) {
      this.emit("call",{type:"CALL_RECEIVED",message:"Received a call",from:this.call_from,call_type:messageData.media_type});    
      
    }
    /**
     * AcceptCall
     */
    public AcceptCall() {
      let uUID=new Date().getTime().toString();
      const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
      let pc :any;
      
      // let isFront = true;
              // @ts-ignore:next-line
  
      
        mediaDevices.getUserMedia({
          audio: true,
          video: true,
        })
        .then(stream => {
          this.log('GOT local STREAM-->',stream);
          this.local_stream=stream
          this.emit("local_stream", { type: "GOT_LOCAL_STREAM", message: "this is your local stream", stream: stream });
        //  pc = new RTCPeerConnection(configuration);
         //@ts-ignore
        pc=new RTCPeerConnection(configuration)
        // pc.setConfiguration(configuration)
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
          // pc.addStream(new MediaStream(stream))
          this.log('adding stream in pc-->',pc);
          // @ts-ignore:next-line
          pc.createOffer(this.sessionConstraints).then(desc => {
            this.log('desccccc',desc);
            let description: any = new RTCSessionDescription(
              {
                // @ts-ignore:next-line
                type: desc.type,
                // @ts-ignore:next-line
                sdp: desc.sdp
              }
            )
            pc.setLocalDescription(description).then(() => {
              this.log('GsetLocalDescription');
              // Send pc.localDescription to peer
              let response ={
                  "type":"request",
                  "requestType":"session_invite",
                  "sdpOffer":description.sdp,
                  "requestID":uUID,
                  "sessionUUID":this.session_uuid,
                  "responseCode":200,
                  "responseMessage":"accepted"
              };
            
                let reqMessage=JSON.stringify(response);
                this.log("===OnOffering Answer",reqMessage);
  
        this.ws.send(reqMessage);
            });
          });
          // @ts-ignore:next-line
          pc.onicecandidate = (event)=> {
            this.log('on ie candidate-->',event);
  
  
            
            var message = {
                id : 'onIceCandidate',
                requestType : 'onIceCandidate',
                type:"request",
                candidate : {
                    candidate:(event as any).candidate
                },
                referenceID:this.call_from,//(offerSDP user ICE Candidate)
                sessionUUID : this.session_uuid
            };
            this.log('*****sending ice candidate--->',message);
            
            var jsonMessage = JSON.stringify(message);
            this.ws.send(jsonMessage)
    
          
          //   send event.candidate to peer
          };
          // @ts-ignore:next-line
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
      
      
      }
        //   pc.ontrack=(event)=>{
        //   // @ts-ignore:next-line
        //   // if((event as any).streams[0]._tracks.length==2){
        //     // this.setState({ remoteStream: event.stream })
        //     this.log('remote streammm o--->', (event as any).streams);
   
        //      //   alert('got remote stream')
        //      this.remote_stream=(event as any).streams[0]
        //      this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).streams[0] });
     
        //     //  }

        //   // // alert('remote')
        //   // if(event.streams.length<2){
        //   //   return;
        //   //   }
        //   //     console.log('remote streammm--->',event.streams);
        //   //     this.remote_stream=(event as any).streams
        //   // this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).streams });
             
        //   //   //   alert('got remote stream')
    
        //   }
          // Got stream!
        })
        .catch(error => {
          console.log('error-->',error);
      
          // Log error
        });
  
      
      
    }
  public toggleSpeaker(flag:any){
    this.log('flag value==>',flag)
    // Vdotok1.toggleSpeaker(flag)
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
    this.log('yooooo')

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
  
  /**
   * ResumeStream
   */
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
  
  
  /**
   * switchCamera
   */
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
  
  /**
   * GetStream
   */
  
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
    } else {
      stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true
      }
  
      )
      this.log('got stream in separate funct',stream)
    }
    return stream
    
  }
  
  
  /**
   * endForegroundService
   */
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
      }

    
    // await notifee.stopForegroundService()
  }
  
    /**
     * OneToOneCall
     */
    public async OneToOneCall(params: any) {
      this.log('one to one call params', params)
     
        let stream: any = null
     
     
     
          stream =await this.GetStream(params)
        this.log('this is what i got',stream)
        if(!stream){
              // @ts-ignore:next-line
          alert('No stream got');
        this.emit("error", { type: "NO_STREAM_GOT", message: "unable to get stream"});
        this.endForegroundService()
          return;
        }
        this.log("got stream", stream)
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
  
  
        let uUID = new Date().getTime().toString();
        this.session_uuid = uUID
        const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
        //@ts-ignore
        // configuration
        const pc = new RTCPeerConnection(configuration);
        // pc.setConfiguration(configuration)

        this.peer_connection = pc
        this.log('going to add stream in pc loop-->', pc);
this.log('this is peerConnection-->',pc.getStats())
        // pc.addStream(new MediaStream(stream));

    //  let trackss=  stream._tracks
    //  console.log("tracksssss mm",trackss)
    //     trackss.forEach((track: any) =>
    //   {
    //     console.log('i am in this loop')
    //     pc.addTrack(track)}
    //   );
    let s2=new MediaStream(stream)
  
    s2.getTracks().forEach((track) => {
    pc.addTrack(track)
    })
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
            let data = {
              //"id":"call",
              from: this.ref_id,
              to: params.to,
              type: "request",
              requestType: "session_invite",
              session_type: "call",
              call_type: "one_to_one",
              media_type: "video",
              requestID: uUID,
              sessionUUID: uUID,
              mcToken: this.mc_token,
              sdpOffer: description.sdp,
              data: {}
            }
            let reqMessage = JSON.stringify(data);
            this.log("sending call request now", reqMessage);
            this.ws.send(reqMessage);
  
  
          });
        });
   
        pc.onicecandidate = (event) => {
          this.log('on ie candidate-->', event);
  
  
          //   var message = {
          //     id : 'onIceCandidate',
          //     requestType : 'onIceCandidate',
          //     type:"request",
          //     candidate : candidate,
          //     referenceID:messageData.from, //(offerSDP user ICE Candidate)
          //     sessionUUID : this.sessionUUID
          // };
          // this.SendPacket(message);
  
  
          var message = {
            id: 'onIceCandidate',
            requestType: 'onIceCandidate',
            type: "request",
            candidate: {
              candidate: (event as any).candidate
            },
            referenceID: this.ref_id,//(offerSDP user ICE Candidate)
            sessionUUID: this.session_uuid
          };
          this.log('*****sending ice candidate--->', message);
  
          var jsonMessage = JSON.stringify(message);
          this.ws.send(jsonMessage)
  
  
          //   send event.candidate to peer
        };
        // pc.ontrack = (event) => {
        // // @ts-ignore:next-line
        //   // alert('remote')
        //   // if((event as any).streams[0]._tracks.length==2){
        //   this.log('remote streammm o--->', (event as any).streams);

        //  // this.setState({ remoteStream: event.stream })
        // //  this.log('remote streammm o--->', (event as any).streams);

        //   //   alert('got remote stream')
        //   this.remote_stream=(event as any).streams[0]
        //   this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).streams[0] });
  
        //   // }
         
         
        // }
  
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
            
            
            }
  
      
    }

    public Spkr(){
      // Vdotok1.toggleSpeaker1() 
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
        socketType: 0
      }
      const regMessage = JSON.stringify(jsonbody);
      console.log("Send===RegisterRequest", regMessage);
      this.ws.send(regMessage);
    }
    public CallResponse(messageData: any) {
      if (this.peer_connection) {
        let sdpOffr = {
          offer: {
            type: 'answer',
            sdp: messageData.sdpAnswer
          }
        }
        this.log("##setting sdpOffr-->", this.peer_connection, sdpOffr);
        this.peer_connection.setRemoteDescription(new RTCSessionDescription({
          // @ts-ignore:next-line
          type: 'answer',
          sdp: messageData.sdpAnswer
        }))
        // this.log('percon-->',this.peer_connection)
      }
  
    }
    public AddCandidate(messageData: any) {
      if (this.peer_connection) {
        this.log('##adding ice candidate to peer connection', messageData.candidate);
        this.peer_connection.addIceCandidate(messageData.candidate)
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
  }