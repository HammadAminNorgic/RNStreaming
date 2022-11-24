/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

public interface MessageAttributeInterface {
    final static int MAPPEDADDRESS = 0x0001; // 1
    final static int RESPONSEADDRESS = 0x0002; //2
    final static int CHANGEREQUEST = 0x0003; //3
    final static int SOURCEADDRESS = 0x0004; //4
    final static int XOR_MAPPED_ADDRESS = 0x0020;  // 32
    final static int OTHERADDRESS = 0x802C; //32812
    final static int CHANGEDADDRESS = 0x0005; //5
    final static int USERNAME = 0x0006;// 6
    final static int PASSWORD = 0x0007;//7
    final static int MESSAGEINTEGRITY = 0x0008; //8
    final static int ERRORCODE = 0x0009; //9
    final static int UNKNOWNATTRIBUTE = 0x000a; //10
    final static int REFLECTEDFROM = 0x000b; //11
    final static int DUMMY = 0x0000; //0
    final static int MAGIC_COOKIE = 0x2112A442;

    public enum MessageAttributeType {
        MappedAddress,
        XORMappedAddress,
        OtherAddress,
        ResponseAddress,
        ChangeRequest,
        SourceAddress,
        ChangedAddress,
        Username,
        Password,
        MessageIntegrity,
        ErrorCode,
        UnknownAttribute,
        ReflectedFrom,
        Dummy,
        MagicCooke
    }
}
