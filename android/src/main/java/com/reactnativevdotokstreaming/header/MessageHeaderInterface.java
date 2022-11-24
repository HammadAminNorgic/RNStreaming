/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.header;

public interface MessageHeaderInterface {
	public enum MessageHeaderType { BindingRequest, BindingResponse, BindingErrorResponse, SharedSecretRequest, SharedSecretResponse, SharedSecretErrorResponse };
	final static int BINDINGREQUEST = 0x0001;
	final static int BINDINGRESPONSE = 0x0101;
	final static int BINDINGERRORRESPONSE = 0x0111;
	final static int SHAREDSECRETREQUEST = 0x0002;
	final static int SHAREDSECRETRESPONSE = 0x0102;
	final static int SHAREDSECRETERRORRESPONSE = 0x0112;
}
