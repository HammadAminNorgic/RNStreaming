/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;


import com.reactnativevdotokstreaming.util.Utility;
import com.reactnativevdotokstreaming.util.UtilityException;

public class Password extends MessageAttribute {
	String password;

	public Password() {
		super(MessageAttributeType.Password);
	}

	public Password(String password) {
		super(MessageAttributeType.Password);
		setPassword(password);
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public byte[] getBytes() throws UtilityException {
		int length = password.length();
		// password header
		if ((length % 4) != 0) {
			length += 4 - (length % 4);
		}
		// message attribute header
		length += 4;
		byte[] result = new byte[length];
		// message attribute header
		// type
		System.arraycopy(Utility.integerToTwoBytes(typeToInteger(type)), 0, result, 0, 2);
		// length
		System.arraycopy(Utility.integerToTwoBytes(length - 4), 0, result, 2, 2);

		// password header
		byte[] temp = password.getBytes();
		System.arraycopy(temp, 0, result, 4, temp.length);
		return result;
	}

	public static Password parse(byte[] data) {
		Password result = new Password();
		String password = new String(data);
		result.setPassword(password);
		return result;
	}
}
