/**
 * Created By: VdoTok
 * Date & Time: On 10/17/22 At 10:17 PM in 2022
 */

package com.reactnativevdotokstreaming.test;

import java.net.InetAddress;
import java.util.ArrayList;

public class DiscoveryInfo {
    public InetAddress localIP;
  public boolean error = false;
  public int errorResponseCode = 0;
  public String errorReason;
  public String NATMapping;
  public String NATFilteringBehavior;
  public ArrayList<String> publicIP = new ArrayList();
  public boolean isNATed = false;
  public boolean isUDPBlocked = false;


    public DiscoveryInfo(InetAddress testIP) {
        this.localIP = testIP;
    }

    public boolean isNATed() {
        return isNATed;
    }

    public void setNATed(boolean NATed) {
        isNATed = NATed;
    }

    public boolean isError() {
        return error;
    }

    public void setError(int responseCode, String reason) {
        this.error = true;
        this.errorResponseCode = responseCode;
        this.errorReason = reason;
    }

    public String getNATMapping() {
        return NATMapping;
    }

    public void setNATMapping(String NATMapping) {
        this.NATMapping = NATMapping;
    }

    public String getNATFilteringBehavior() {
        return NATFilteringBehavior;
    }

    public void setNATFilteringBehavior(String NATFilteringBehavior) {
        this.NATFilteringBehavior = NATFilteringBehavior;
    }

    public ArrayList<String> getPublicIP() {
        return publicIP;
    }

    public void setPublicIP(InetAddress sPublicIP) {
        String iPInString = sPublicIP.getHostName().replace("/", "");
        if (!publicIP.contains(iPInString))
            this.publicIP.add(iPInString);
    }

    public boolean isUDPBlocked() {
        return isUDPBlocked;
    }

    public void setUDPBlocked(boolean UDPBlocked) {
        isUDPBlocked = UDPBlocked;
    }

    @Override
    public String toString() {
        return "localIP=" + localIP +
                ",\n er=" + error +
                ",\n eRCode=" + errorResponseCode +
                ",\n eReason='" + errorReason + '\'' +
                ",\n natBehaviour='" + NATMapping + '\'' +
                ",\n NFilter='" + NATFilteringBehavior + '\'' +
                ",\n pIP=" + publicIP +
                ",\n isNATed=" + isNATed +
                ",\n isUDPBlocked=" + isUDPBlocked;
    }
}
