/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

import android.util.Log;

public class ReflectedFrom extends MappedResponseChangedSourceAddressReflectedFrom {


	public ReflectedFrom() {
		super(MessageAttributeType.ReflectedFrom);
	}

	public static ReflectedFrom parse(byte[] data) throws MessageAttributeParsingException {
		ReflectedFrom result = new ReflectedFrom();
		MappedResponseChangedSourceAddressReflectedFrom.parse(result, data);
		Log.d("StunClient","Message Attribute: ReflectedFrom parsed: " + result.toString() + ".");
		return result;
	}


}
