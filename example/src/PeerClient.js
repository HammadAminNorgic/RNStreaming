

// @ts-nocheck
import React, { useState,useEffect,useRef } from 'react'
import { Text, TouchableOpacity, View,Image, SafeAreaView } from 'react-native'
// import { PeerClient} from './PeerClient'
import {RTCView,PeerClient} from 'react-native-vdotok-streaming'
// import notifee, { AndroidImportance } from '@notifee/react-native';

const PeerClientApp = () => {
  let project_id = '6NE92I'

  const [sdk, setSdk] = useState(null)
  const [role, setRole] = useState(null)
  const [callType, setCallType] = useState('camera')

  const [connected, setConnect] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [callInProgress, setCallInprogress] = useState(false)

  const [calling, setCalling] = useState(false)
  const [callReceived, setCallReceived] = useState(false)
  const [err, setErr] = useState('')            
  const [pausedVideo, setPausedVideo] = useState(false)
  const [pausedAudio, setPauseAudio] = useState(false)
  const [callTime, setCallTime] = useState(0)




  const [callDeclined, setCallDeclined] = useState(false)
  const [localStream, setLocalStream] = useState(false)
  const [remoteStream, setRemoteStream] = useState(false)

  const [stunCredentials, setStunCredentials] = useState({
    complete_address: "r-stun2.vdotok.dev:3478",
    host: "r-stun2.vdotok.dev",
    port: "3478"
  })

  
  const [userData, setUserData] = useState({

    "auth_token": "90924fdc9c96f776d15f26bac53a7199",

    "authorization_token": "046705461b6f1b7a52b434f2a9d59aa1",

    "created_datetime": "1660226058",

    "email": "Hammad1_Caller@gmail.com",

    "full_name": "Hammad1_Caller",

    "media_server_map": {

        "complete_address": "wss://q-signalling.vdotok.dev:8443/call",

        "end_point": "call",

        "host": "q-signalling.vdotok.dev",

        "port": "8443",

        "protocol": "wss"

    },

    "message": "Login Successful",

    "messaging_server_map": {

        "complete_address": "wss://q-messaging2.vdotok.dev:443",

        "host": "q-messaging2.vdotok.dev",

        "port": "443",

        "protocol": "wss"

    },

    "phone_num": "923865192724",

    "process_time": 108,

    "profile_pic": "",

    "ref_id": "fe6e77e01044c54861483098cd8d795a",

    "status": 200,

    "user_id": 1020,

    "username": "Hammad1_Caller"

});
  const [user2Data, setUser2Data] = useState({

    "auth_token": "14d662cdf7a159d3ea0bf318b4eafbcb",

    "authorization_token": "19f3d41aa0968a9d92cbf6e923fee98f",

    "created_datetime": "1660226084",

    "email": "Hammad1_Callee@gmail.com",

    "full_name": "Hammad1_Callee",

    "media_server_map": {

        "complete_address": "wss://q-signalling.vdotok.dev:8443/call",

        "end_point": "call",

        "host": "q-signalling.vdotok.dev",

        "port": "8443",

        "protocol": "wss"

    },

    "message": "Login Successful",

    "messaging_server_map": {

        "complete_address": "wss://q-messaging2.vdotok.dev:443",

        "host": "q-messaging2.vdotok.dev",

        "port": "443",

        "protocol": "wss"

    },

    "phone_num": "923080243863",

    "process_time": 272,

    "profile_pic": "",

    "ref_id": "0f348b66a7b87ab542a9277d2783c825",

    "status": 200,

    "user_id": 1021,

    "username": "Hammad1_Callee"

})


const timerRef = useRef(null);
let currentTimeRef = useRef(callTime);

const endForegroundService=async()=>{
  // await notifee.stopForegroundService()
  setPauseAudio(false)
  setPausedVideo(false)
setCallReceived(false)
endTimer()
try {
	// await notifee.stopForegroundService();
} catch( err ) {
	// Handle Error
};

}
useEffect(()=>{
  return()=>{
    // alert('hii')

    if(sdk){
      console.log('i am leaving')
      sdk.Disconnect()
      endTimer()
    }
    // endForegroundService()

  }
},[])
const toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10)
  var hours   = Math.floor(sec_num / 3600)
  var minutes = Math.floor(sec_num / 60) % 60
  var seconds = sec_num % 60

  return [hours,minutes,seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0)
      .join(":")
}

const getTime=()=>{
  setCallTime(x=>x+1)
  // currentTimeRef.current=callTime
}

const startTimer=()=>{
  timerRef.current= setInterval(() => {
    getTime()
  }, 1000);

}
const endTimer=()=>{
  if(timerRef.current){
    clearInterval(timerRef.current)
    setCallTime(0)
  }
}
  const initSdk = (role) => {
    let auth_token_ = role === 'receiver' ? user2Data.authorization_token : userData.authorization_token;
    let ref_id = role === 'receiver' ? user2Data.ref_id : userData.ref_id
    console.log('role-->', role, auth_token_, ref_id)
let sdkInitParam={
    host: userData.media_server_map.complete_address,
    projectId: project_id,
    stunHost:stunCredentials.host,
    stunPort:stunCredentials.port
  }
    let client = new PeerClient(sdkInitParam);

    client.on('connected', (res) => {
      setConnect(true)
      console.log('sdk connected', res)
      client.Register(auth_token_, ref_id)
    })
    client.on('registered', (res) => {
      console.log('user registered with vdotok server', res)
      setRegistered(true)
    })
    client.on('error', (res) => {
      console.log('sdk error in app: ', res)
      alert(res.message)
      if(res.type==='NO_STREAM_GOT'){
        setLocalStream(null)
        setRemoteStream(null)
        setCallInprogress(false)
       setCallReceived(false)
       endForegroundService()
      }
      setErr(res.message)
    })
    client.on('local_stream', (res) => {
      console.log('this is your local stream in app-->', res)
      setLocalStream(res.stream)
      startTimer()
    })
    client.on('remote_stream', (res) => {
      console.warn('this is remote stream in app-->', res)
      setRemoteStream(res.stream)
    
    })
    client.on('stop_session',(res)=>{
      console.log('stop session event from notification called-->',res)
      client.DeclineCall()
      if(localStream)
{
  // localStream.release()
}      
      setLocalStream(null)
      setRemoteStream(null)
      setCallInprogress(false)
     setCallReceived(false)
     endForegroundService()
    })
    client.on('stream_state_info',(res)=>{
      console.log('stream state changed:', res)

    })
    client.on('audio_state_info',(res)=>{
      console.log('audio state changed:', res)

    })

    client.on('call', (res) => {
      console.log('on call in app-->',res)
      if (res.type === "CALL_RECEIVED") {
        setCallReceived(true)
        console.log('call received in app -->', res)
        // setTimeout(() => {
        //   client.DeclineCall();
        // }, 2000);
      }
      if (res.type === 'CALL_ENDED') {
        if(localStream)
        {
          // localStream.release()
        }  
        setLocalStream(null)
        setRemoteStream(null)
        setCallInprogress(false)
        endForegroundService()
      }
    })
  //   stream.getVideoTracks().forEach((track) => {
  //     console.log('sc',track);
  //     cameraState ? track.enabled = false : track.enabled = true
  // })
  // }

    console.log("client in app", client)
    setSdk(client)
  }
  const ToggleVideoOn=()=>{
    // if(localStream){
    //   localStream.getVideoTracks().forEach((track) => {
    //     console.log('sc',track);
    //   track.enabled =true
    // }) 
    // }
    sdk.ResumeStream()
  

  }
  const ToggleVideoOff=()=>{
    // if(localStream){
    //   localStream.getVideoTracks().forEach((track) => {
    //     console.log('sc',track);
    //   track.enabled =false
    // }) 
    // }
  sdk.PauseStream()

  }
  const ToggleAudioOn=()=>{
    sdk.UnmuteMic()
  }
  const ToggleAudioOff=()=>{
    // if(localStream){
    //   localStream.getAudioTracks().forEach((track) => {
    //     console.log('sc',track);
    //   track.enabled =false
    // }) 
    // }
  
sdk.MuteMic()
  }


  const switchCamera=()=>{
  //   localStream.getVideoTracks().forEach((track) => {
  //     console.log('sc',track);
  //     track._switchCamera();
  // })
  sdk.SwitchCamera();
  }
  const makeCall = async (type = 'video') => {
    if (sdk) {
        if(type !== 'video'){
            try {
                // const channelId = await notifee.createChannel( {
                //     id: 'screen_capture',
                //     name: 'Screen Capture',
                //     lights: false,
                //     vibration: false,
                //     importance: AndroidImportance.DEFAULT
                // } );
            
                // await notifee.displayNotification( {
                //     title: 'Screen Capture',
                //     body: 'This notification will be here until you stop capturing.',
                //     android: {
                //         channelId,
                //         asForegroundService: true
                //     }
                // } );
                // setTimeout(() => {
                      sdk.OneToOneCall({
                    to: [user2Data.ref_id],
                    type: type === 'video' ? 'camera' : 'screen'
                  })
                  setCallInprogress(true)

                // }, 2000);
            
            } catch( err ) {
                // Handle Error
            };
        }else{
          console.log("sdk",sdk)
            sdk.OneToOneCall({
                to: [user2Data.ref_id],
                type: type === 'video' ? 'camera' : 'screen'
              })
              setCallInprogress(true)
        }
   
    } else {
      alert('sdk not conected')
    }
  }
  const endCall = async () => {
    if(localStream)
    {
      // localStream.release()
    }  
    sdk.DeclineCall();
 
    setLocalStream(null)
    setRemoteStream(null)
    setCallInprogress(false)
   setCallReceived(false)
   endForegroundService()

  }
  const acceptCall=()=>{
    if(!sdk){
      alert('sdk not connected')
    return;
    }
    sdk.AcceptCall();
   setCallReceived(false)
   setCallInprogress(true)



  }
  const declineCall=()=>{
    if(!sdk){
      alert('sdk not connected')
    return;
    }
    sdk.DeclineCall();
    setCallInprogress(false)
   setCallReceived(false)

  }

  return (
    <SafeAreaView style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      // alignItems: 'center',
      justifyContent: 'center',

    }}>
       {/* {localStream && <View style={{position:'absolute',zIndex:5,top:10,right:30,backgroundColor:'rgba(0,0,0,0.5)',padding:10,display:'flex',borderRadius:5,alignItems:"center",justifyContent:'center'}}>
               <Text style={{color:'yellow',fontWeight:'bold',fontSize:18,letterSpacing:2,}}>{toHHMMSS(callTime)}</Text>
                </View>} */}
      {!role ? (<View style={{ display: 'flex', flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: 'black' }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 30 }}>Please Select Your Role:</Text>

        <TouchableOpacity onPress={() => {
          // console.log("yooo",Client)
          // let a=new Hello()
          setRole('caller')
          initSdk('caller')
        }} style={{ height: 50, backgroundColor: 'white', display: 'flex', width: 200, borderRadius: 10, display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 10 }}>
          <Text style={{ color: "black", fontWeight: 'bold', fontSize: 17 }}>Caller</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          setRole('receiver')
          initSdk('receiver')
        }} style={{ height: 50, backgroundColor: 'white', display: 'flex', width: 200, borderRadius: 10, display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 10 }}>
          <Text style={{ color: "black", fontWeight: 'bold', fontSize: 17 }}>Receiver</Text>
        </TouchableOpacity>

      </View>) : role === 'caller' ? (
        <View style={{
          display: 'flex',
          flex: 1,
          // alignItems: "center",
          justifyContent: "space-between",

          // paddingVertical: 50,
          // paddingHorizontal: 10
        }}>
             {localStream && <View style={{zIndex:5,backgroundColor:'rgba(0,0,0,0.5)',padding:10,alignItems:"center",justifyContent:'center'}}>
               <Text style={{color:'yellow',fontWeight:'bold',fontSize:18,letterSpacing:2,}}>{toHHMMSS(callTime)}</Text>
                </View>}
          {
            !connected && (
              <View style={{ display: 'flex', flex: 1, alignItems: "center", justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, color: "black" }}>Loading please wait..</Text>

              </View>
            )
          }

          {((connected || registered) && !localStream) && <View style={
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex:2,
              marginTop:30,


            }
          }>
            {
              connected && (<Text style={{ color: "green", fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>Socket Connected</Text>)
            }
            {
              registered && (<Text style={{ color: "green", fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>Registered with vdotok</Text>)
            }
          </View>}
       

          {
            (connected && registered) ? (

              <View style={
                {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex:5



                }
              }>
                {
                  !callInProgress ? (
                    <>
                      <TouchableOpacity onPress={() => {
                        makeCall('video')
                        setCallType('camera')
                      }} style={{ height: 50, backgroundColor: 'black', display: 'flex', width: 200, borderRadius: 10, display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                        <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Video Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        makeCall('screen')
                        setCallType('screen')

                      }} style={{ height: 50, backgroundColor: 'black', display: 'flex', width: 200, borderRadius: 10, display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                        <Text style={{ color: "yellow", fontWeight: 'bold', fontSize: 17 }}>Screen Share Call</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={{display:'flex',flexDirection:"row",zIndex:4,marginBottom:50}}>
                   { callType !=='screen' && (<>
                   <TouchableOpacity onPress={() => {
                     switchCamera()
                      }} style={{ height: 40,width:40, backgroundColor: '#E0E0E0', display: 'flex',  borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center",marginHorizontal:5 }}>
                        {/* <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Switch Camera</Text> */}
                    <Image source={require('./assets/icons/switch.png')} style={{height:'80%',width:'80%',resizeMode:"contain"}}/>
                      
                    
                    
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        if(pausedVideo){
                          ToggleVideoOn()
                        }else{
                          ToggleVideoOff()

                        }
                        setPausedVideo(!pausedVideo)

                       
                      }} style={{ height: 40,width:40, backgroundColor: '#E0E0E0', display: 'flex',  borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center",marginHorizontal:5}}>
                    <Image source={pausedVideo?require('./assets/icons/camOff.png'):require('./assets/icons/camOn.png')} style={{height:'70%',width:'70%',resizeMode:"contain"}}/>
                       
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        if(pausedAudio){
                          ToggleAudioOn()
                        }else{
                          ToggleAudioOff()
                        }
                        setPauseAudio(!pausedAudio)
                      }} style={{ height: 40,width:40, backgroundColor: '#E0E0E0', display: 'flex',  borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center" ,marginHorizontal:5}}>
                    <Image source={pausedAudio?require('./assets/icons/micOff.png'):require('./assets/icons/micOn.png')} style={{height:'70%',width:'70%',resizeMode:"contain"}}/>

                      </TouchableOpacity></>)}
                      <TouchableOpacity onPress={() => {
                        endCall()
                      }} style={{ height: 40,width:70, backgroundColor: 'red', display: 'flex',  borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center"}}>
                        <Text style={{ color: "white", fontWeight: 'bold', fontSize: 13 }}>End Call</Text>
                      </TouchableOpacity>
                   
                    </View>
                  )
                }

              </View>

            ) : (<View></View>)


          }

          {
            (localStream || remoteStream) ? (
              <View style={{ display: 'flex', height: '100%',position:'absolute',   width: "100%",zIndex:1 }}>
                <View  style={{ height: 150, width: 100,borderColor:'red',zIndex:2,position:'absolute',bottom:140,right:20,borderWidth:1,backgroundColor:'grey'}}>
                  {/* <Text style={{ color: 'black' }}>local:</Text> */}
                  {localStream && (
                    <>

                      <RTCView zOrder={2}  streamURL={localStream.toURL()} style={{ height: '100%', width: '100%' }}></RTCView></>)}
                </View>
                <View style={{ height: '100%', width: '100%', zIndex:1,position:'absolute' }}>
                  {/* <Text style={{ color: "black" }}>remote:</Text> */}
                  {remoteStream && (
                    <>

                      <RTCView   streamURL={remoteStream.toURL()} style={{ height: '100%', width: '100%' }}></RTCView></>)}

                </View>

              </View>

            ) : <View></View>
          }

        </View>
      ) : role === 'receiver' ? (
        <View style={{
          display: 'flex',
          flex: 1,
          // alignItems: "center",
          justifyContent: "space-between",

          // paddingVertical: 50,
          // paddingHorizontal: 10
        }}>
          {localStream && <View style={{zIndex:5,backgroundColor:'rgba(0,0,0,0.5)',padding:10,alignItems:"center",justifyContent:'center'}}>
               <Text style={{color:'yellow',fontWeight:'bold',fontSize:18,letterSpacing:2,}}>{toHHMMSS(callTime)}</Text>
                </View>}
          {
            !connected && (
              <View style={{ display: 'flex', flex: 1, alignItems: "center", justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, color: "black" }}>Loading please wait..</Text>

              </View>
            )
          }

          {(connected || registered) && !localStream && <View style={
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop:30,
              zIndex:2


            }
          }>
            {
              connected && (<Text style={{ color: "green", fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>Socket Connected</Text>)
            }
            {
              registered && (<Text style={{ color: "green", fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>Registered with vdotok</Text>)
            }
          </View>}

          {
            (connected && registered) ? (

              <View style={
                {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",



                }
              }>

                {
                  !callInProgress ? (
                    <>
                      {
                        callReceived ? (
                          <>
                            <Text style={{ fontSize: 20, color: 'balck', fontWeight: "bold", marginBottom: 10 }}>Some one in calling you !</Text>
                            <View style={{ width: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                              <TouchableOpacity onPress={() => {
                                // makeCall('video')
                                acceptCall()
                              }} style={{ height: 50, backgroundColor: 'green', display: 'flex', width: '49%', borderRadius: 10, display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                                <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Accept</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => {
                                //  makeCall('screen')
                                declineCall()

                              }} style={{ height: 50, backgroundColor: 'red', display: 'flex', width: '49%', borderRadius: 10, display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                                <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Decline</Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : (
                          <Text style={{ color: "black", fontSize: 18 }}>You are receiver please wait for a call</Text>

                        )
                      }
                      {/* <TouchableOpacity onPress={() => {
            makeCall('video')
          }} style={{ height: 50, backgroundColor: 'grey', display: 'flex', width: 200, borderRadius: 10, display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Video Call</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
         makeCall('screen')
          }} style={{ height: 50, backgroundColor: 'grey', display: 'flex', width: 200, borderRadius: 10, display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Screen Share CAll</Text>
          </TouchableOpacity>
                   */}
                    </>
                  ) : (
                    <>
                          <View style={{display:'flex',flexDirection:"row",zIndex:4,marginBottom:50}}>
                   { callType !=='screen' && (<><TouchableOpacity onPress={() => {
                     switchCamera()
                      }} style={{ height: 40,width:40, backgroundColor: '#E0E0E0', display: 'flex',  borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center",marginHorizontal:5 }}>
                        {/* <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Switch Camera</Text> */}
                    <Image source={require('./assets/icons/switch.png')} style={{height:'80%',width:'80%',resizeMode:"contain"}}/>
                      
                    
                    
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        if(pausedVideo){
                          ToggleVideoOn()
                        }else{
                          ToggleVideoOff()
                        }
                        setPausedVideo(!pausedVideo)

                       
                      }} style={{ height: 40,width:40, backgroundColor: '#E0E0E0', display: 'flex',  borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center",marginHorizontal:5}}>
                    <Image source={pausedVideo?require('./assets/icons/camOff.png'):require('./assets/icons/camOn.png')} style={{height:'70%',width:'70%',resizeMode:"contain"}}/>
                       
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        if(pausedAudio){
                          ToggleAudioOn()
                        }else{
                          ToggleAudioOff()
                        }
                        setPauseAudio(!pausedAudio)
                      }} style={{ height: 40,width:40, backgroundColor: '#E0E0E0', display: 'flex',  borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center" ,marginHorizontal:5}}>
                    <Image source={pausedAudio?require('./assets/icons/micOff.png'):require('./assets/icons/micOn.png')} style={{height:'70%',width:'70%',resizeMode:"contain"}}/>

                      </TouchableOpacity></>)}
                      <TouchableOpacity onPress={() => {
                        endCall()
                      }} style={{ height: 40,width:70, backgroundColor: 'red', display: 'flex',  borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center"}}>
                        <Text style={{ color: "white", fontWeight: 'bold', fontSize: 13 }}>End Call</Text>
                      </TouchableOpacity>
                   
                    </View>
                   
                      

                    </>
                  )
                }

              </View>

            ) : (<View></View>)


          }
   {
            (localStream || remoteStream) ? (
              <View style={{ display: 'flex', height: '100%',position:'absolute',   width: "100%", }}>
                <View  style={{ height: 150, width: 100,borderColor:'red',zIndex:2,position:'absolute',bottom:140,right:20,borderWidth:1,backgroundColor:"grey"}}>
                  {/* <Text style={{ color: 'black' }}>local:</Text> */}
                  {localStream && (
                    <>

                      <RTCView zOrder={2} zIndex={2} streamURL={localStream.toURL()} style={{ height: '100%', width: '100%',zIndex:2  }}></RTCView></>)}
                </View>
                <View style={{ height: '100%', width: "100%", zIndex:1,position:'absolute' }}>
                 
                  {/* <Text style={{ color: "black" }}>remote:</Text> */}
                  {remoteStream && (
                    <>

                      <RTCView zOrder={1} zIndex={1} streamURL={remoteStream.toURL()} style={{ height: '100%', width: '100%',zIndex:1 }}></RTCView></>)}

                </View>

              </View>

            ) : <View></View>
          }

        </View>
      ) : (
        <Text>unknown role</Text>
      )}




    </SafeAreaView>
  )
}

export default PeerClientApp

const styles = {}





// import { Text, View } from 'react-native'
// import React, { Component } from 'react'

// export class App extends Component {
//   componentDidMount(){
//     console.log('hammad')
//   }
//   componentWillUnmount(){
//     console.log('unmounting')
//   }
//   render() {
//     return (
//       <View>
//         <Text>App</Text>
//       </View>
//     )
//   }
// }

// export default App


// import { View, Text, AppState } from 'react-native'
// import React, { useEffect,useLayoutEffect } from 'react'

// const App = () => {
//   useEffect(()=>{
//     AppState.addEventListener('change',(nextAppState)=>{
//       console.log('app state chnaged-->',nextAppState)
//       if (nextAppState === 'inactive') {
//         console.log('the app is closed');
//        }    

//     });
// // setInterval(() => {
// //   console.log(new Date())
// // }, 1000);

// return()=>{
// console.log('goin')
// }

// },[])

//   return (
//     <View>
//       <Text>App</Text>
//     </View>
//   )
// }

// export default App






////


// import React, { useState } from 'react'
// import { View, Text, TouchableOpacity } from 'react-native'

// export default function Peer() {
//     const [role, setrole] = useState(null)
//     let project_id = '6NE92I'

//     const [sdk, setSdk] = useState(null)
//     const [callType, setCallType] = useState('camera')
  
//     const [connected, setConnect] = useState(false)
//     const [registered, setRegistered] = useState(false)
//     const [callInProgress, setCallInprogress] = useState(false)
  
//     const [calling, setCalling] = useState(false)
//     const [callReceived, setCallReceived] = useState(false)
//     const [err, setErr] = useState('')            
//     const [pausedVideo, setPausedVideo] = useState(false)
//     const [pausedAudio, setPauseAudio] = useState(false)
//     const [callTime, setCallTime] = useState(0)
  
  
  
  
//     const [callDeclined, setCallDeclined] = useState(false)
//     const [localStream, setLocalStream] = useState(false)
//     const [remoteStream, setRemoteStream] = useState(false)
  
//     const [stunCredentials, setStunCredentials] = useState({
//       complete_address: "r-stun2.vdotok.dev:3478",
//       host: "r-stun2.vdotok.dev",
//       port: "3478"
//     })
  
    
//     const [userData, setUserData] = useState({
  
//       "auth_token": "90924fdc9c96f776d15f26bac53a7199",
  
//       "authorization_token": "046705461b6f1b7a52b434f2a9d59aa1",
  
//       "created_datetime": "1660226058",
  
//       "email": "Hammad1_Caller@gmail.com",
  
//       "full_name": "Hammad1_Caller",
  
//       "media_server_map": {
  
//           "complete_address": "wss://q-signalling.vdotok.dev:8443/call",
  
//           "end_point": "call",
  
//           "host": "q-signalling.vdotok.dev",
  
//           "port": "8443",
  
//           "protocol": "wss"
  
//       },
  
//       "message": "Login Successful",
  
//       "messaging_server_map": {
  
//           "complete_address": "wss://q-messaging2.vdotok.dev:443",
  
//           "host": "q-messaging2.vdotok.dev",
  
//           "port": "443",
  
//           "protocol": "wss"
  
//       },
  
//       "phone_num": "923865192724",
  
//       "process_time": 108,
  
//       "profile_pic": "",
  
//       "ref_id": "fe6e77e01044c54861483098cd8d795a",
  
//       "status": 200,
  
//       "user_id": 1020,
  
//       "username": "Hammad1_Caller"
  
//   });
//     const [user2Data, setUser2Data] = useState({
  
//       "auth_token": "14d662cdf7a159d3ea0bf318b4eafbcb",
  
//       "authorization_token": "19f3d41aa0968a9d92cbf6e923fee98f",
  
//       "created_datetime": "1660226084",
  
//       "email": "Hammad1_Callee@gmail.com",
  
//       "full_name": "Hammad1_Callee",
  
//       "media_server_map": {
  
//           "complete_address": "wss://q-signalling.vdotok.dev:8443/call",
  
//           "end_point": "call",
  
//           "host": "q-signalling.vdotok.dev",
  
//           "port": "8443",
  
//           "protocol": "wss"
  
//       },
  
//       "message": "Login Successful",
  
//       "messaging_server_map": {
  
//           "complete_address": "wss://q-messaging2.vdotok.dev:443",
  
//           "host": "q-messaging2.vdotok.dev",
  
//           "port": "443",
  
//           "protocol": "wss"
  
//       },
  
//       "phone_num": "923080243863",
  
//       "process_time": 272,
  
//       "profile_pic": "",
  
//       "ref_id": "0f348b66a7b87ab542a9277d2783c825",
  
//       "status": 200,
  
//       "user_id": 1021,
  
//       "username": "Hammad1_Callee"
  
//   })

//     const selectRole = (rolee) => {
//         setrole(rolee)
//         initSdk(rolee)
//     }

//     const initSdk = (rolee) => {
//         // alert(rolee)
//        Connect(_Credentials.host);
//     }

//     const Connect=()=>{

//     }
//     return (
//         <View style={styles.container}>
//             {role && <Text style={{ padding: 10, color: "red" }}>{role}</Text>}
//             {!role && (<>
//                 <TouchableOpacity onPress={() => {
//                     selectRole('caller')
//                 }} style={styles.smallButton}>
//                     <Text>Caller</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => {
//                     selectRole('receiver')
//                 }} style={styles.smallButton}>
//                     <Text>Receiver</Text>
//                 </TouchableOpacity>
//             </>)}
//             {role == 'caller' && <TouchableOpacity style={styles.smallButton}>
//                 <Text>call</Text>
//             </TouchableOpacity>}
//         </View>
//     )
// }
// const styles = {
//     container: {
//         flex: 1,
//         backgroundColor: "gold"
//     },
//     smallButton: {
//         padding: 10,
//         marginBottom: 10,
//         backgroundColor: 'white'
//     }
// }