/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

import android.util.Log;

public class OtherAddress extends MappedResponseChangedSourceAddressReflectedFrom {

	public OtherAddress() {
		super(MessageAttributeType.OtherAddress);
	}

	public static MessageAttribute parse(byte[] data) throws MessageAttributeParsingException {
		OtherAddress ma = new OtherAddress();
		MappedResponseChangedSourceAddressReflectedFrom.parse(ma, data);
		Log.d("StunClient","Message Attribute: Mapped Address parsed: " + ma.toString() + ".");
		return ma;
	}
}
