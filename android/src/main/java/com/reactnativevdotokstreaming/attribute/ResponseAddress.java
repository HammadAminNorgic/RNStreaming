/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

import android.util.Log;


public class ResponseAddress extends MappedResponseChangedSourceAddressReflectedFrom {
	public ResponseAddress() {
		super(MessageAttributeType.ResponseAddress);
	}

	public static MessageAttribute parse(byte[] data) throws MessageAttributeParsingException {
		ResponseAddress ra = new ResponseAddress();
		MappedResponseChangedSourceAddressReflectedFrom.parse(ra, data);
		Log.d("StunClient","Message Attribute: Response Address parsed: " + ra.toString() + ".");
		return ra;
	}
}
