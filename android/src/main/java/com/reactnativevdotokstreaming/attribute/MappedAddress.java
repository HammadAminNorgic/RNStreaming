/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

import android.util.Log;

public class MappedAddress extends MappedResponseChangedSourceAddressReflectedFrom {

	public MappedAddress() {
		super(MessageAttributeType.MappedAddress);
	}

	public static MessageAttribute parse(byte[] data) throws MessageAttributeParsingException {
		MappedAddress ma = new MappedAddress();
		MappedResponseChangedSourceAddressReflectedFrom.parse(ma, data);
		Log.d("StunClient","Message Attribute: Mapped Address parsed: " + ma.toString() + ".");
		return ma;
	}
}
