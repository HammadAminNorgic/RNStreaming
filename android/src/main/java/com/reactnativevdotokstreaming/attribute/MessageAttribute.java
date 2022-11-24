/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;


import android.util.Log;

import com.reactnativevdotokstreaming.util.Utility;
import com.reactnativevdotokstreaming.util.UtilityException;

public abstract class MessageAttribute implements MessageAttributeInterface {

    MessageAttributeType type;

    public MessageAttribute() {
    }

    public MessageAttribute(MessageAttributeType type) {
        setType(type);
    }

    public static int typeToInteger(MessageAttributeType type) {
        if (type == MessageAttributeType.MappedAddress) return MAPPEDADDRESS;
        if (type == MessageAttributeType.XORMappedAddress) return XOR_MAPPED_ADDRESS;
        if (type == MessageAttributeType.ResponseAddress) return RESPONSEADDRESS;
        if (type == MessageAttributeType.ChangeRequest) return CHANGEREQUEST;
        if (type == MessageAttributeType.SourceAddress) return SOURCEADDRESS;
        if (type == MessageAttributeType.OtherAddress) return OTHERADDRESS;
        if (type == MessageAttributeType.ChangedAddress) return CHANGEDADDRESS;
        if (type == MessageAttributeType.Username) return USERNAME;
        if (type == MessageAttributeType.Password) return PASSWORD;
        if (type == MessageAttributeType.MessageIntegrity) return MESSAGEINTEGRITY;
        if (type == MessageAttributeType.ErrorCode) return ERRORCODE;
        if (type == MessageAttributeType.UnknownAttribute) return UNKNOWNATTRIBUTE;
        if (type == MessageAttributeType.ReflectedFrom) return REFLECTEDFROM;
        if (type == MessageAttributeType.Dummy) return DUMMY;
        if (type == MessageAttributeType.MagicCooke) return MAGIC_COOKIE;
        return -1;
    }

    public static MessageAttributeType intToType(long type) {
        if (type == MAPPEDADDRESS) return MessageAttributeType.MappedAddress;
        if (type == XOR_MAPPED_ADDRESS) return MessageAttributeType.XORMappedAddress;
        if (type == OTHERADDRESS) return MessageAttributeType.OtherAddress;
        if (type == RESPONSEADDRESS) return MessageAttributeType.ResponseAddress;
        if (type == CHANGEREQUEST) return MessageAttributeType.ChangeRequest;
        if (type == SOURCEADDRESS) return MessageAttributeType.SourceAddress;
        if (type == CHANGEDADDRESS) return MessageAttributeType.ChangedAddress;
        if (type == USERNAME) return MessageAttributeType.Username;
        if (type == PASSWORD) return MessageAttributeType.Password;
        if (type == MESSAGEINTEGRITY) return MessageAttributeType.MessageIntegrity;
        if (type == ERRORCODE) return MessageAttributeType.ErrorCode;
        if (type == UNKNOWNATTRIBUTE) return MessageAttributeType.UnknownAttribute;
        if (type == REFLECTEDFROM) return MessageAttributeType.ReflectedFrom;
        if (type == DUMMY) return MessageAttributeType.Dummy;
        if (type == MAGIC_COOKIE) return MessageAttributeType.MagicCooke;
        return null;
    }

    public static MessageAttribute parseCommonHeader(byte[] data) throws MessageAttributeParsingException {
        try {
            byte[] typeArray = new byte[2];
            System.arraycopy(data, 0, typeArray, 0, 2);
            int type = Utility.twoBytesToInteger(typeArray);
            byte[] lengthArray = new byte[2];
            System.arraycopy(data, 2, lengthArray, 0, 2);
            int lengthValue = Utility.twoBytesToInteger(lengthArray);
            byte[] valueArray = new byte[lengthValue];
            System.arraycopy(data, 4, valueArray, 0, lengthValue);
            MessageAttribute ma;
            switch (type) {
                case MAPPEDADDRESS:
                    ma = MappedAddress.parse(valueArray);
                    break;
                case XOR_MAPPED_ADDRESS:
                    ma = XORMappedAddress.parse(valueArray);
                    break;
                case OTHERADDRESS:
                    ma = OtherAddress.parse(valueArray);
                    break;
                case RESPONSEADDRESS:
                    ma = ResponseAddress.parse(valueArray);
                    break;
                case CHANGEREQUEST:
                    ma = ChangeRequest.parse(valueArray);
                    break;
                case SOURCEADDRESS:
                    ma = SourceAddress.parse(valueArray);
                    break;
                case CHANGEDADDRESS:
                    ma = ChangedAddress.parse(valueArray);
                    break;
                case USERNAME:
                    ma = Username.parse(valueArray);
                    break;
                case PASSWORD:
                    ma = Password.parse(valueArray);
                    break;
                case MESSAGEINTEGRITY:
                    ma = MessageIntegrity.parse(valueArray);
                    break;
                case ERRORCODE:
                    ma = ErrorCode.parse(valueArray);
                    break;
                case UNKNOWNATTRIBUTE:
                    ma = UnknownAttribute.parse(valueArray);
                    break;
                case REFLECTEDFROM:
                    ma = ReflectedFrom.parse(valueArray);
                    break;
                default:
                    if (type <= 0x7fff) {
                        throw new UnknownMessageAttributeException("Unkown mandatory message attribute", intToType(type));
                    } else {
                        Log.d("StunClient","MessageAttribute with type " + type + " unkown.");
                        ma = Dummy.parse(valueArray);
                        break;
                    }
            }
            return ma;
        } catch (UtilityException ue) {
            throw new MessageAttributeParsingException("Parsing error");
        }
    }

    public MessageAttributeType getType() {
        return type;
    }

    public void setType(MessageAttributeType type) {
        this.type = type;
    }
    //abstract public MessageAttribute parse(byte[] data) throws MessageAttributeParsingException;

    abstract public byte[] getBytes() throws UtilityException;

    public int getLength() throws UtilityException {
        int length = getBytes().length;
        return length;
    }
}
