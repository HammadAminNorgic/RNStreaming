// @ts-nocheck
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { Client, RTCView } from 'react-native-vdotok-streaming'
import notifee, { AndroidImportance } from '@notifee/react-native';

const ClientApp = () => {
  let project_id = '115G1WZI'

  const [sdk, setSdk] = useState(null)
  const [role, setRole] = useState(null)
  const [callType, setCallType] = useState('camera')

  const [connected, setConnect] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [sdkConnected, setSdkConnected] = useState(false)

  const [callInProgress, setCallInprogress] = useState(false)
  const [speakerOn, setSpeakerOn] = useState(false)


  const [calling, setCalling] = useState(false)
  const [callReceived, setCallReceived] = useState(false)
  const [err, setErr] = useState('')
  const [pausedVideo, setPausedVideo] = useState(false)
  const [pausedAudio, setPauseAudio] = useState(false)
  const [callTime, setCallTime] = useState(0)

  const [callDeclined, setCallDeclined] = useState(false)
  const [localStream, setLocalStream] = useState(false)
  const [remoteStream, setRemoteStream] = useState(false)



  const [userData, setUserData] = useState({

    "auth_token": "fa5ebf8d63718ef5071aabf8b28aa612",

    "authorization_token": "92862cc73e777b52dbd196018d432b97",

    "created_datetime": "1672917462",

    "email": "hammadjani@gmail.com",

    "full_name": "hammadjani",

    "media_server_map": {

        "complete_address": "wss://q-signalling.vdotok.dev:8443/call",

        "end_point": "call",

        "host": "q-signalling.vdotok.dev",

        "port": "8443",

        "protocol": "wss"

    },

    "message": "Login Successful",

    "messaging_server_map": {

        "complete_address": "wss://q-messaging.vdotok.dev:443",

        "host": "q-messaging.vdotok.dev",

        "port": "443",

        "protocol": "wss"

    },

    "phone_num": "923278884407",

    "process_time": 360,

    "profile_pic": "",

    "ref_id": "e3ef4e9e7d4ab1806dbb49d5a07a55a8",

    "status": 200,

    "stun_server_map": {

        "complete_address": "r-stun2.vdotok.dev:3478",

        "host": "r-stun2.vdotok.dev",

        "port": "3478"

    },

    "user_id": 5236,

    "username": "hammadjani"

});
  const [user2Data, setUser2Data] = useState({

    "auth_token": "2e54baf19dbe98da7886632655105105",

    "authorization_token": "396142328d6d672b547e7f8227c7f6f1",

    "created_datetime": "1672917493",

    "email": "hammadpoop@gmail.com",

    "full_name": "hammadpoop",

    "media_server_map": {

        "complete_address": "wss://q-signalling.vdotok.dev:8443/call",

        "end_point": "call",

        "host": "q-signalling.vdotok.dev",

        "port": "8443",

        "protocol": "wss"

    },

    "message": "Login Successful",

    "messaging_server_map": {

        "complete_address": "wss://q-messaging.vdotok.dev:443",

        "host": "q-messaging.vdotok.dev",

        "port": "443",

        "protocol": "wss"

    },

    "phone_num": "923129654600",

    "process_time": 129,

    "profile_pic": "",

    "ref_id": "d52b8b652fb5fe8277a74c7389e802ee",

    "status": 200,

    "stun_server_map": {

        "complete_address": "r-stun2.vdotok.dev:3478",

        "host": "r-stun2.vdotok.dev",

        "port": "3478"

    },

    "user_id": 5237,

    "username": "hammadpoop"

})


  const timerRef = useRef(null);
  let currentTimeRef = useRef(callTime);

  const endForegroundService = async () => {
    // await notifee.stopForegroundService()
    setPauseAudio(false)
    setPausedVideo(false)
    setCallReceived(false)
    endTimer()
    try {
      await notifee.stopForegroundService();
    } catch (err) {
      // Handle Error
    };

  }
  useEffect(() => {
    return () => {
      // alert('hii')

      if (sdk) {
        console.log('i am leaving')
        sdk.Disconnect()
        endTimer()
      }
      // endForegroundService()

    }
  }, [])
  const toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":")
  }

  const getTime = () => {
    setCallTime(x => x + 1)
    // currentTimeRef.current=callTime
  }

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      getTime()
    }, 1000);

  }
  const endTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setCallTime(0)
    }
  }
  const initSdk = (role) => {
    let auth_token_ = role === 'receiver' ? user2Data.authorization_token : userData.authorization_token;
    let ref_if_ = role === 'receiver' ? user2Data.ref_id : userData.ref_id
    console.log('role-->', role, auth_token_, ref_if_)

    let client = new Client({
      host: userData.media_server_map.complete_address,
      projectId: project_id
    });

    client.on('connected', (res) => {
      setConnect(true)
      console.log('sdk connected', res)
      client.Register(auth_token_, ref_if_)
    })
    client.on('registered', (res) => {
      console.log('user registered with vdotok server', res)
      setRegistered(true)
    })
    client.on('error', (res) => {
      console.log('sdk error in app: ', res)
      if (res.type === 'NO_STREAM_GOT') {
        setLocalStream(null)
        setRemoteStream(null)
        setCallInprogress(false)
        setCallReceived(false)
        endForegroundService()
      }
      if (res.type == 'SOCKET_CLOSED') {
        setConnect(false)
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
      setTimeout(() => {
        client.Spkr()
      }, 1000);
    })
    client.on('stop_session', (res) => {
      console.log('stop session event from notification called-->', res)
      client.DeclineCall()
      if (localStream) {
        // localStream.release()
      }
      setLocalStream(null)
      setRemoteStream(null)
      setCallInprogress(false)
      setCallReceived(false)
      endForegroundService()
    })
    client.on('stream_state_info', (res) => {
      console.log('stream state changed:', res)

    })
    client.on('audio_state_info', (res) => {
      console.log('audio state changed:', res)

    })

    client.on('call', (res) => {
      console.log('on call in app-->', res)
      if (res.type === "CALL_RECEIVED") {
        setCallReceived(true)
        console.log('call received in app -->', res)
        // setTimeout(() => {
        //   client.DeclineCall();
        // }, 2000);
      }
      if (res.type === 'CALL_ENDED') {
        if (localStream) {
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
  const ToggleVideoOn = () => {
    // if(localStream){
    //   localStream.getVideoTracks().forEach((track) => {
    //     console.log('sc',track);
    //   track.enabled =true
    // }) 
    // }
    sdk.ResumeStream()


  }
  const ToggleVideoOff = () => {
    // if(localStream){
    //   localStream.getVideoTracks().forEach((track) => {
    //     console.log('sc',track);
    //   track.enabled =false
    // }) 
    // }
    sdk.PauseStream()

  }

const ToggleSpeakerOn=()=>{
  sdk.SetSpeakerOn()
}
const ToggleSpeakerOff=()=>{
  console.log('this is sdk',sdk);
  sdk.SetSpeakerOff()
}

  const ToggleAudioOn = () => {
    sdk.UnmuteMic()
  }
  const ToggleAudioOff = () => {
    // if(localStream){
    //   localStream.getAudioTracks().forEach((track) => {
    //     console.log('sc',track);
    //   track.enabled =false
    // }) 
    // }

    sdk.MuteMic()
  }


  const switchCamera = () => {
    //   localStream.getVideoTracks().forEach((track) => {
    //     console.log('sc',track);
    //     track._switchCamera();
    // })
    sdk.SwitchCamera();
  }
  const makeCall = async (type = 'video') => {
    if (sdk) {
      if (type !== 'video') {
        try {
          const channelId = await notifee.createChannel({
            id: 'screen_capture',
            name: 'Screen Capture',
            lights: false,
            vibration: false,
            importance: AndroidImportance.DEFAULT
          });

          await notifee.displayNotification({
            title: 'Screen Capture',
            body: 'This notification will be here until you stop capturing.',
            android: {
              channelId,
              asForegroundService: true
            }
          });
          // setTimeout(() => {
          sdk.OneToOneCall({
            to: [user2Data.ref_id],
            type: type === 'video' ? 'camera' : 'screen'
          })
          setCallInprogress(true)

          // }, 2000);

        } catch (err) {
          // Handle Error
        };
      } else {
        console.log("sdk", sdk)
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
    if (localStream) {
      // localStream.release()
    }
    sdk.DeclineCall();

    setLocalStream(null)
    setRemoteStream(null)
    setCallInprogress(false)
    setCallReceived(false)
    endForegroundService()

  }
  const acceptCall = () => {
    if (!sdk) {
      alert('sdk not connected')
      return;
    }
    sdk.AcceptCall();
    setCallReceived(false)
    setCallInprogress(true)



  }
  const declineCall = () => {
    if (!sdk) {
      alert('sdk not connected')
      return;
    }
    sdk.DeclineCall();
    setCallInprogress(false)
    setCallReceived(false)

  }

  return (
    <View style={{
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
          backgroundColor:'green',
          zIndex:10,
          justifyContent: "space-between",

          // paddingVertical: 50,
          // paddingHorizontal: 10
        }}>
          {localStream && <View style={{ zIndex: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, alignItems: "center", justifyContent: 'center' }}>
            <Text style={{ color: 'yellow', fontWeight: 'bold', fontSize: 18, letterSpacing: 2, }}>{toHHMMSS(callTime)}</Text>
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
              zIndex: 2,
              marginTop: 30,


            }
          }>
            {
              connected ? (<Text style={{ color: "green", fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>Socket Connected</Text>) : (<Text style={{ color: "green", fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>Socket Disconnected</Text>)
            }
            {
              registered && (<Text style={{ color: "green", fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>Registered with vdotok</Text>)
            }
            {
              <TouchableOpacity onPress={()=>{
                if(sdk){
                  sdk.disconnectSocket();
                }
              }} style={{padding:15,backgroundColor:'grey'}}>
                <Text>Disconnect socket</Text>
              </TouchableOpacity>
            }
          </View>}


          {
            (connected && registered) ? (

              <View style={
                {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:'yellow',
                  zIndex:20



                }
              }>
                {
                  !callInProgress ? (
                    <>
                      <TouchableOpacity onPress={() => {
                        // sdk.stunInfo()
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
                    <View style={{ display: 'flex', flexDirection: "row", zIndex: 10, marginBottom: 50,backgroundColor:'red' }}>
                      {callType !== 'screen' && (<>
                        <TouchableOpacity onPress={() => {
                          switchCamera()
                        }} style={{ height: 40, width: 40, backgroundColor: '#E0E0E0', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center", marginHorizontal: 5 }}>
                          {/* <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Switch Camera</Text> */}
                          <Image source={require('./assets/icons/switch.png')} style={{ height: '80%', width: '80%', resizeMode: "contain" }} />



                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          if (pausedVideo) {
                            ToggleVideoOn()
                          } else {
                            ToggleVideoOff()

                          }
                          setPausedVideo(!pausedVideo)


                        }} style={{ height: 40, width: 40, backgroundColor: '#E0E0E0', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center", marginHorizontal: 5 }}>
                          <Image source={pausedVideo ? require('./assets/icons/camOff.png') : require('./assets/icons/camOn.png')} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          if (pausedAudio) {
                            ToggleAudioOn()
                          } else {
                            ToggleAudioOff()
                          }
                          setPauseAudio(!pausedAudio)
                        }} style={{ height: 40, width: 40, backgroundColor: '#E0E0E0', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center", marginHorizontal: 5 }}>
                          <Image source={pausedAudio ? require('./assets/icons/micOff.png') : require('./assets/icons/micOn.png')} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />

                        </TouchableOpacity></>)}

                        <TouchableOpacity onPress={() => {
                          if (speakerOn) {
                            ToggleSpeakerOff()
                          } else {
                            ToggleSpeakerOn()

                          }
                          setSpeakerOn(!speakerOn)


                        }} style={{ height: 40, width: 40, backgroundColor: '#E0E0E0', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center", marginHorizontal: 5 }}>
                          <Image source={!speakerOn ? require('./assets/icons/speakerOff.png') : require('./assets/icons/speakerOn.png')} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />

                        </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        endCall()
                      }} style={{ height: 40, width: 70, backgroundColor: 'red', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center" }}>
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
              <View style={{ display: 'flex', height: '100%', position: 'absolute', width: "100%",zIndex:9,backgroundColor:'rgba(0,0,0,0.5)' }}>
                <View style={{ height: 150, width: 100, borderColor: 'red', zIndex: 2, position: 'absolute', bottom: 140, right: 20, borderWidth: 1, backgroundColor: 'grey' }}>
                  {/* <Text style={{ color: 'black' }}>local:</Text> */}
                  {localStream && (
                    <>

                      <RTCView zOrder={2} zIndex={2} streamURL={localStream.toURL()} style={{ height: '100%', width: '100%', zIndex: 2 }}></RTCView></>)}
                </View>
                <View style={{ height: '100%', width: "100%", zIndex: 1, position: 'absolute' }}>
                  {/* <Text style={{ color: "black" }}>remote:</Text> */}
                  {remoteStream && (
                    <>

                      <RTCView zOrder={1} zIndex={1} streamURL={remoteStream.toURL()} style={{ height: '100%', width: '100%', zIndex: 1 }}></RTCView></>)}

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
          {localStream && <View style={{ zIndex: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, alignItems: "center", justifyContent: 'center' }}>
            <Text style={{ color: 'yellow', fontWeight: 'bold', fontSize: 18, letterSpacing: 2, }}>{toHHMMSS(callTime)}</Text>
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
              marginTop: 30,
              zIndex: 2


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
                      <View style={{ display: 'flex', flexDirection: "row", zIndex: 10, marginBottom: 50 }}>
                        {callType !== 'screen' && (<><TouchableOpacity onPress={() => {
                          switchCamera()
                        }} style={{ height: 40, width: 40, backgroundColor: '#E0E0E0', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center", marginHorizontal: 5 }}>
                          {/* <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>Switch Camera</Text> */}
                          <Image source={require('./assets/icons/switch.png')} style={{ height: '80%', width: '80%', resizeMode: "contain" }} />



                        </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            if (pausedVideo) {
                              ToggleVideoOn()
                            } else {
                              ToggleVideoOff()
                            }
                            setPausedVideo(!pausedVideo)


                          }} style={{ height: 40, width: 40, backgroundColor: '#E0E0E0', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center", marginHorizontal: 5 }}>
                            <Image source={pausedVideo ? require('./assets/icons/camOff.png') : require('./assets/icons/camOn.png')} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />

                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            if (pausedAudio) {
                              ToggleAudioOn()
                            } else {
                              ToggleAudioOff()
                            }
                            setPauseAudio(!pausedAudio)
                          }} style={{ height: 40, width: 40, backgroundColor: '#E0E0E0', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center", marginHorizontal: 5 }}>
                            <Image source={pausedAudio ? require('./assets/icons/micOff.png') : require('./assets/icons/micOn.png')} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />

                          </TouchableOpacity></>)}
                          <TouchableOpacity onPress={() => {
                          if (speakerOn) {
                            ToggleSpeakerOff()
                          } else {
                            ToggleSpeakerOn()

                          }
                          setSpeakerOn(!speakerOn)


                        }} style={{ height: 40, width: 40, backgroundColor: '#E0E0E0', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center", marginHorizontal: 5 }}>
                          <Image source={!speakerOn ? require('./assets/icons/speakerOff.png') : require('./assets/icons/speakerOn.png')} style={{ height: '70%', width: '70%', resizeMode: "contain" }} />

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          endCall()
                        }} style={{ height: 40, width: 70, backgroundColor: 'red', display: 'flex', borderRadius: 40, display: 'flex', alignItems: "center", justifyContent: "center" }}>
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
              <View style={{ display: 'flex', height: '100%', position: 'absolute', width: "100%", }}>
                <View style={{ height: 150, width: 100, borderColor: 'red', zIndex: 2, position: 'absolute', bottom: 140, right: 20, borderWidth: 1, backgroundColor: "grey" }}>
                  {/* <Text style={{ color: 'black' }}>local:</Text> */}
                  {localStream && (
                    <>

                      <RTCView zOrder={2} zIndex={2} streamURL={localStream.toURL()} style={{ height: '100%', width: '100%', zIndex: 2 }}></RTCView></>)}
                </View>
                <View style={{ height: '100%', width: "100%", zIndex: 1, position: 'absolute' }}>

                  {/* <Text style={{ color: "black" }}>remote:</Text> */}
                  {remoteStream && (
                    <>

                      <RTCView zOrder={1} zIndex={1} streamURL={remoteStream.toURL()} style={{ height: '100%', width: '100%', zIndex: 1 }}></RTCView></>)}

                </View>

              </View>

            ) : <View></View>
          }

        </View>
      ) : (
        <Text>unknown role</Text>
      )}




    </View>
  )
}

export default ClientApp

const styles = {}
