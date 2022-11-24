/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;


import com.reactnativevdotokstreaming.util.Utility;
import com.reactnativevdotokstreaming.util.UtilityException;

public class Dummy extends MessageAttribute {
	int lengthValue;
	public Dummy() {
		super(MessageAttributeType.Dummy);
	}

	public void setLengthValue(int length) {
		this.lengthValue = length;
	}

	public byte[] getBytes() throws UtilityException {
		byte[] result = new byte[lengthValue + 4];
		//	message attribute header
		// type
		System.arraycopy(Utility.integerToTwoBytes(typeToInteger(type)), 0, result, 0, 2);
		// length
		System.arraycopy(Utility.integerToTwoBytes(lengthValue), 0, result, 2, 2);
		return result;
	}

	public static Dummy parse(byte[] data) {
		Dummy dummy = new Dummy();
		dummy.setLengthValue(data.length);
		return dummy;
	}
}
