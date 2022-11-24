package com.reactnativevdotokstreaming;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativevdotokstreaming.attribute.MessageAttributeException;
import com.reactnativevdotokstreaming.header.MessageHeaderParsingException;
import com.reactnativevdotokstreaming.test.DiscoveryInfo;
import com.reactnativevdotokstreaming.test.DiscoveryTest;
import com.reactnativevdotokstreaming.util.UtilityException;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Map;
import java.util.TreeMap;

@ReactModule(name = NatManager.NAME)
public class NatManager extends ReactContextBaseJavaModule {
    public static final String NAME = "NatManager";
 public DiscoveryTest DT;
    public NatManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void natTest(String stunaddress, int stunport, Promise promise) throws IOException, MessageAttributeException, MessageHeaderParsingException, UtilityException {
         DT=new DiscoveryTest(InetAddress.getLocalHost() ,  "r-stun2.vdotok.dev", 3478);
      Log.d("hammm --", "stun: "+DT.toString());
      DiscoveryInfo di= DT.test();
      Log.d("hammm --", "stun: "+di.toString());
      WritableMap data = Arguments.createMap();
      data.putString("NATBehaviour", di.NATMapping.toString());
      data.putString("NATFiltering", di.NATFilteringBehavior.toString());
//      data.putArray("NATPublicIps", di.publicIP);

//            data.putMap("NATPublicIps", (ReadableMap) map);
        promise.resolve(di.NATFilteringBehavior.toString()+"<->"+di.NATMapping.toString()+"<->"+di.publicIP.toString());
    }

}
