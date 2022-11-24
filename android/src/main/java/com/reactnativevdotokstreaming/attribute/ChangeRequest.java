/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

import com.reactnativevdotokstreaming.util.Utility;
import com.reactnativevdotokstreaming.util.UtilityException;

public class ChangeRequest extends MessageAttribute {
    /*
     *  0                   1                   2                   3
     *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * |0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 A B 0|
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     */
    boolean changeIP = false;
    boolean changePort = false;

    public ChangeRequest() {
        super(MessageAttributeType.ChangeRequest);
    }

    public static ChangeRequest parse(byte[] data) throws MessageAttributeParsingException {
        try {
            if (data.length < 4) {
                throw new MessageAttributeParsingException("Data array too short");
            }
            ChangeRequest cr = new ChangeRequest();
            int status = Utility.oneByteToInteger(data[3]);
            switch (status) {
                case 0:
                    break;
                case 2:
                    cr.setChangePort();
                    break;
                case 4:
                    cr.setChangeIP();
                    break;
                case 6:
                    cr.setChangeIP();
                    cr.setChangePort();
                    break;
                default:
                    throw new MessageAttributeParsingException("Status parsing error");
            }
            return cr;
        } catch (UtilityException ue) {
            throw new MessageAttributeParsingException("Parsing error");
        }
    }

    public boolean isChangeIP() {
        return changeIP;
    }

    public boolean isChangePort() {
        return changePort;
    }

    public void setChangeIP() {
        changeIP = true;
    }

    public void setChangePort() {
        changePort = true;
    }


    public byte[] getBytes() throws UtilityException {
        byte[] result = new byte[8];
        // message attribute header
        // type
        System.arraycopy(Utility.integerToTwoBytes(typeToInteger(type)), 0, result, 0, 2);
        // length
        System.arraycopy(Utility.integerToTwoBytes(4), 0, result, 2, 2);


        // change request header
        if (changeIP) result[7] = Utility.integerToOneByte(4);
        if (changePort) result[7] = Utility.integerToOneByte(2);
        if (changeIP && changePort) result[7] = Utility.integerToOneByte(6);
        return result;
    }
}
