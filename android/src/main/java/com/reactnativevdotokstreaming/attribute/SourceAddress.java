/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

import android.util.Log;


public class SourceAddress extends MappedResponseChangedSourceAddressReflectedFrom {

	public SourceAddress() {
		super(MessageAttributeType.SourceAddress);
	}

	public static MessageAttribute parse(byte[] data) throws MessageAttributeParsingException {
		SourceAddress sa = new SourceAddress();
		MappedResponseChangedSourceAddressReflectedFrom.parse(sa, data);
		Log.d("StunClient","Message Attribute: Source Address parsed: " + sa.toString() + ".");
		return sa;
	}
}
