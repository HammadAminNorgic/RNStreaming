/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.test;

import android.util.Log;

import com.reactnativevdotokstreaming.attribute.ChangeRequest;
import com.reactnativevdotokstreaming.attribute.ErrorCode;
import com.reactnativevdotokstreaming.attribute.MappedAddress;
import com.reactnativevdotokstreaming.attribute.MessageAttribute;
import com.reactnativevdotokstreaming.attribute.MessageAttributeException;
import com.reactnativevdotokstreaming.attribute.MessageAttributeParsingException;
import com.reactnativevdotokstreaming.attribute.OtherAddress;
import com.reactnativevdotokstreaming.attribute.XORMappedAddress;
import com.reactnativevdotokstreaming.header.MessageHeader;
import com.reactnativevdotokstreaming.header.MessageHeaderParsingException;
import com.reactnativevdotokstreaming.util.UtilityException;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketTimeoutException;

public class DiscoveryTest {

    InetAddress localIpAddress;
    String stunServer;
    int port;
    int timeoutInitValue = 2000; //ms
    XORMappedAddress XORMappedAddress1 = null;
    OtherAddress OtherAddress1 = null;
    XORMappedAddress XORMappedAddress2 = null;
    OtherAddress OtherAddress2 = null;
    DatagramSocket socketTest1 = null;
    DiscoveryInfo di;
    StringBuilder sb = new StringBuilder();

    public DiscoveryTest(InetAddress iaddress, String stunServer, int port) {
        super();
        this.localIpAddress = iaddress;
        this.stunServer = stunServer;
        this.port = port;
      Log.d("Stun Results", "DiscoveryTest: "+iaddress.toString());

    }



  public DiscoveryInfo test() throws UtilityException, IOException, MessageAttributeException, MessageHeaderParsingException {
    Log.d("hamm ", "=======Nat Behaviour Type=======");
        XORMappedAddress1 = null;
        OtherAddress1 = null;
        socketTest1 = null;
        di = new DiscoveryInfo(localIpAddress);
    Log.d("hamm ", "=======Nat Behaviour Type======= di"+di.toString());

    sb.append("=======Nat Behaviour Type=======");
    Log.d("hamm ", "=======Nat Behaviour Type======= after append");

    if (test1())
            if (test2())
                if (test3()) {
                }
        test2FB();
        socketTest1.close();
        Log.d("Stun Results", sb.toString());
        return di;
    }

    private boolean test1() throws UtilityException, IOException, MessageAttributeParsingException, MessageHeaderParsingException {
      Log.d("hamm ", "=======Nat Behaviour Type======= in test 1");


      try {
            sb.append("\n=======N-B Test1 Result=======");
            Log.d("hamm ", "=======Nat Behaviour Type=======before socketTest1 1");

        socketTest1 = new DatagramSocket();
        Log.d("hamm ", "=======Nat Behaviour Type======= in socketTest1 "+socketTest1.toString());

        socketTest1.setReuseAddress(true);
        Log.d("hamm ", "=======Nat Behaviour Type======= in test 1");

        socketTest1.setSoTimeout(timeoutInitValue);
        Log.d("hamm ", "=======Nat Behaviour Type======= in test 1");

            MessageHeader sendMH = new MessageHeader(MessageHeader.MessageHeaderType.BindingRequest);
            sendMH.generateTransactionID();

            byte[] data = sendMH.getBytes();
        Log.d("hamm ", "=======Nat Behav1" +data );
        Log.d("hamm ", "=======Nat Behav1"  +data.length);
        Log.d("hamm ", "=======Nat Behav1" +InetAddress.getByName(stunServer));
        Log.d("hamm ", "=======Nat Behav1" +port );


//        netAddress.getByName("stun.l.google.com"), 19302
        DatagramPacket send = new DatagramPacket(data, data.length, InetAddress.getByName(stunServer), port);
//        DatagramPacket send = new DatagramPacket(data, data.length, InetAddress.getByName("stun.l.google.com"), 19302);
        Log.d("hamm ", "=======Nat Behaviour Type======= in  send sent. 1"+send.toString());
        Log.d("hamm ", "=======Nat Behaviour Type======= in  send sent. 1"+socketTest1.toString());

        socketTest1.send(send);
        Log.d("hamm ", "=======Nat Behaviour Type======= in  Request sent. 1");
            Log.d("StunClient", "Test 1: Binding Request sent.");

            MessageHeader receiveMH = new MessageHeader();

            DatagramPacket receive = new DatagramPacket(new byte[700], 700);
            socketTest1.receive(receive);
            receiveMH = MessageHeader.parseHeader(receive.getData());
        Log.d("StunClient", "Test 1: Binding Request parseHeader.");

        receiveMH.parseAttributes(receive.getData());
        Log.d("StunClient", "Test 1: Binding Request getData."+receiveMH.toString());



        MappedAddress publicIP = (MappedAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.MappedAddress);
//        Log.d("StunClient", "Test 1: Binding Request publicIP."+publicIP.toString());toStrin

        XORMappedAddress1 = (XORMappedAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.XORMappedAddress);
//        Log.d("StunClient", "Test 1: Binding Request XORMappedAddress1." + XORMappedAddress1.toString());

        OtherAddress1 = (OtherAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.OtherAddress);

//        Log.d("StunClient", "Test 1: Binding Request OtherAddress1." + OtherAddress1.toString());

            ErrorCode ec = (ErrorCode) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.ErrorCode);
//        Log.d("StunClient", "Test 1: Binding Request getData. ec" +ec.toString());
        Log.d("StunClient", "test1: ec");
        sb.append("\nPUBLIC IP and Port " + publicIP.getAddress().getInetAddress() + ":" + publicIP.getPort());
            sb.append("\nXor Mapped address and port  " + XORMappedAddress1.getAddress().getInetAddress() + ":" + XORMappedAddress1.getPort());
            sb.append("\nOther Address and port" + OtherAddress1.getAddress().getInetAddress() + ":" + OtherAddress1.getPort());
        Log.d("StunClient", "Test 1: Binding Request getData. appnd");

            if (ec != null) {
                di.setError(ec.getResponseCode(), ec.getReason());
                Log.e("StunClient", "Message header contains an Errorcode message attribute.");
                return false;
            }
            di.setPublicIP(publicIP.getAddress().getInetAddress());
            if ((XORMappedAddress1 == null) || (OtherAddress1 == null)) {
                Log.e("StunClient", "Response does not contain a Mapped Address or Changed Address message attribute.");
                return false;
            } else {
                if ((XORMappedAddress1.getPort() == socketTest1.getLocalPort()) && (XORMappedAddress1.getAddress().getInetAddress().equals(socketTest1.getLocalAddress()))) {
                    di.setNATed(false);
                    di.setNATMapping("Direct-Mapping");
                    Log.i("StunClient", "Node is not NATed");
                } else {
                    di.setNATed(true);
                    Log.i("StunClient", "Node is NATed.");
                }
                return true;
            }
        } catch (SocketTimeoutException ste) {
            di.setUDPBlocked(true);
            Log.e("StunClient", "Node is not capable of UDP communication.");
            return false;
        }

    }

    private boolean test2() throws UtilityException, IOException, MessageAttributeParsingException, MessageHeaderParsingException {
        sb.append("\n=======N-B Test2 Result=======");
        try {

            MessageHeader sendMH = new MessageHeader(MessageHeader.MessageHeaderType.BindingRequest);
            sendMH.generateTransactionID();

            byte[] data = sendMH.getBytes();
            DatagramPacket send = new DatagramPacket(data, data.length, OtherAddress1.getAddress().getInetAddress(), port);
            socketTest1.send(send);
            Log.d("StunClient", "Test 2: Binding Request sent.");

            MessageHeader receiveMH = new MessageHeader();

            DatagramPacket receive = new DatagramPacket(new byte[700], 700);
            socketTest1.receive(receive);
            receiveMH = MessageHeader.parseHeader(receive.getData());
            receiveMH.parseAttributes(receive.getData());

            MappedAddress publicIP = (MappedAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.MappedAddress);
            XORMappedAddress2 = (XORMappedAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.XORMappedAddress);
            OtherAddress2 = (OtherAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.OtherAddress);


            ErrorCode ec = (ErrorCode) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.ErrorCode);
            sb.append("\nPUBLIC IP and Port " + publicIP.getAddress().getInetAddress() + ":" + publicIP.getPort());
            sb.append("\nXor Mapped address and port  " + XORMappedAddress2.getAddress().getInetAddress() + ":" + XORMappedAddress2.getPort());
            sb.append("\nOther Address and port" + OtherAddress2.getAddress().getInetAddress() + ":" + OtherAddress2.getPort());

            if (ec != null) {
                di.setError(ec.getResponseCode(), ec.getReason());
                Log.e("StunClient", "Message header contains an Errorcode message attribute.");
                return false;
            }
            di.setPublicIP(publicIP.getAddress().getInetAddress());
            if ((XORMappedAddress1.getAddress().getInetAddress().equals(XORMappedAddress2.getAddress().getInetAddress())) &&
                    (XORMappedAddress1.getPort() == (XORMappedAddress2.getPort()))) {
                di.setNATMapping("Endpoint-Independent");
                Log.i("StunClient", "Endpoint-Independent Mapping");
                return false;
            } else {
                Log.d("StunClient", "Test 3 is required");
                return true;
            }

        } catch (SocketTimeoutException ste) {
            Log.e("StunClient", "Test 1: Socket timeout while receiving the response.");
            di.setUDPBlocked(true);
            return false;
        }
    }

    private boolean test3() throws UtilityException, IOException, MessageAttributeParsingException, MessageHeaderParsingException {
        sb.append("\n=======N-B Test3 Result=======");
        try {
            MessageHeader sendMH = new MessageHeader(MessageHeader.MessageHeaderType.BindingRequest);
            sendMH.generateTransactionID();

            byte[] data = sendMH.getBytes();
            DatagramPacket send = new DatagramPacket(data, data.length, OtherAddress1.getAddress().getInetAddress(), OtherAddress1.getPort());
            socketTest1.send(send);
            Log.d("StunClient", "Test 2: Binding Request sent.");

            MessageHeader receiveMH = new MessageHeader();
            DatagramPacket receive = new DatagramPacket(new byte[700], 700);
            socketTest1.receive(receive);
            receiveMH = MessageHeader.parseHeader(receive.getData());
            receiveMH.parseAttributes(receive.getData());


            MappedAddress publicIP = (MappedAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.MappedAddress);
            XORMappedAddress XORMappedAddress3 = (XORMappedAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.XORMappedAddress);
            OtherAddress OtherAddress3 = (OtherAddress) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.OtherAddress);


            ErrorCode ec = (ErrorCode) receiveMH.getMessageAttribute(MessageAttribute.MessageAttributeType.ErrorCode);
            sb.append("\nPUBLIC IP and Port " + publicIP.getAddress().getInetAddress() + ":" + publicIP.getPort());
            sb.append("\nXor Mapped address and port  " + XORMappedAddress3.getAddress().getInetAddress() + ":" + XORMappedAddress3.getPort());
            sb.append("\nOther Address and port" + OtherAddress3.getAddress().getInetAddress() + ":" + OtherAddress3.getPort());

            if (ec != null) {
                di.setError(ec.getResponseCode(), ec.getReason());
                Log.e("StunClient", "Message header contains an Errorcode message attribute.");
                return false;
            }
            di.setPublicIP(publicIP.getAddress().getInetAddress());
            if (XORMappedAddress2.getAddress().getInetAddress().equals(XORMappedAddress3.getAddress().getInetAddress())
                    && XORMappedAddress2.getPort() == XORMappedAddress3.getPort()) {
                di.setNATMapping("Address-Dependent");
                Log.i("StunClient", "Address-Dependent Mapping");
                return false;
            } else {
                Log.i("StunClient", "Address and Port Dependent Mapping");
                di.setNATMapping("Port-Dependent");
                return true;
            }


        } catch (SocketTimeoutException ste) {
            Log.e("StunClient", "Test 1: Socket timeout while receiving the response.");
            di.setUDPBlocked(true);
            Log.e("StunClient", "Node is not capable of UDP communication.");
            return false;

        }
    }

    private void test2FB() throws UtilityException, IOException {
        try {
            sb.append("\n=======N-f Test2 Result=======");
            MessageHeader sendMH = new MessageHeader(MessageHeader.MessageHeaderType.BindingRequest);
            sendMH.generateTransactionID();

            ChangeRequest changeRequest = new ChangeRequest();
            changeRequest.setChangeIP();
            changeRequest.setChangePort();

            sendMH.addMessageAttribute(changeRequest);

            byte[] data = sendMH.getBytes();
            DatagramPacket send = new DatagramPacket(data, data.length, InetAddress.getByName(stunServer), port);
            socketTest1.send(send);
            Log.d("StunClient", "TestFB 1: Binding Request sent.");

            DatagramPacket receive = new DatagramPacket(new byte[700], 700);
            socketTest1.receive(receive);

            di.setNATFilteringBehavior("Endpoint-Independent");
            Log.i("StunClient", "Endpoint-Independent Filtering");
        } catch (SocketTimeoutException ste) {
            test3FB();
        }
    }

    private void test3FB() throws UtilityException, IOException {
        sb.append("\n=======N-f Test3 Result=======");
        try {

            MessageHeader sendMH = new MessageHeader(MessageHeader.MessageHeaderType.BindingRequest);
            sendMH.generateTransactionID();

            ChangeRequest changeRequest = new ChangeRequest();
            changeRequest.setChangePort();

            sendMH.addMessageAttribute(changeRequest);

            byte[] data = sendMH.getBytes();
            DatagramPacket send = new DatagramPacket(data, data.length, InetAddress.getByName(stunServer), port);
            socketTest1.send(send);
            Log.d("StunClient", "TestFB 2: Binding Request sent.");

            DatagramPacket receive = new DatagramPacket(new byte[700], 700);
            socketTest1.receive(receive);

            di.setNATFilteringBehavior("Address-Dependent Filtering");
            Log.i("StunClient", "Address-Dependent");
        } catch (SocketTimeoutException ste) {
            di.setNATFilteringBehavior("Port-Dependent");
            Log.i("StunClient", "Address and Port-Dependent Filtering");
        }
    }
}
