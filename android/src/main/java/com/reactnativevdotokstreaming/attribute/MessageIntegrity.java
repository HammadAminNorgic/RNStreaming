/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.attribute;

public class MessageIntegrity extends MessageAttribute {
	// incomplete message integrity implementation
	public MessageIntegrity() {
		super(MessageAttributeType.MessageIntegrity);
	}

	public byte[] getBytes() {
		return new byte[0];
	}

	public static MessageIntegrity parse(byte[] data) {
		return new MessageIntegrity();
	}
}
