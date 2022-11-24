/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

import com.reactnativevdotokstreaming.util.Utility;
import com.reactnativevdotokstreaming.util.UtilityException;

public class Username extends MessageAttribute {
	String username;

	public Username() {
		super(MessageAttributeType.Username);
	}

	public Username(String username) {
		super(MessageAttributeType.Username);
		setUsername(username);
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public byte[] getBytes() throws UtilityException {
		int length = username.length();
		// username header
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
		System.arraycopy(Utility.integerToTwoBytes(length-4), 0, result, 2, 2);

		// username header
		byte[] temp = username.getBytes();
		System.arraycopy(temp, 0, result, 4, temp.length);
		return result;
	}

	public static Username parse(byte[] data) {
		Username result = new Username();
		String username = new String(data);
		result.setUsername(username);
		return result;
	}
}
