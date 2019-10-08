/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mydeveloperplanet.myspringcloudvisionplanet;

/**
 *
 * @author ADMIN
 */
public class ResponseObj {

    private String errorCode;
    private String lstId;

    public ResponseObj() {
    }

    public ResponseObj(String errorCode, String lstId) {
        this.errorCode = errorCode;
        this.lstId = lstId;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getLstId() {
        return lstId;
    }

    public void setLstId(String lstId) {
        this.lstId = lstId;
    }

}
