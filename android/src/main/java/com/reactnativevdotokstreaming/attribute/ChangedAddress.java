/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;


import android.util.Log;

public class ChangedAddress extends MappedResponseChangedSourceAddressReflectedFrom {

    public ChangedAddress() {
        super(MessageAttributeType.ChangedAddress);
    }

    public static MessageAttribute parse(byte[] data) throws MessageAttributeParsingException {
        ChangedAddress ca = new ChangedAddress();
        MappedResponseChangedSourceAddressReflectedFrom.parse(ca, data);
        Log.e("StunClient", "Message Attribute: Changed Address parsed: " + ca.toString() + ".");
        return ca;
    }
}
