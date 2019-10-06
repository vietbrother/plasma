package com.mydeveloperplanet.myspringcloudvisionplanet;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * This class will represent our phone and its attributes: - ID - Name -
 * Operating system
 *
 * @author Robley Gori - ro6ley.github.io
 */
@Entity
@Table(name = "p_order")   // the table in the database that will contain our phones data
@EntityListeners(AuditingEntityListener.class)
public class Order {

    /**
     * The attributes of the phone
     */
    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "p_equipment_id_seq")
    private Integer id;    // Each phone will be given an auto-generated unique identifier when stored

    @Column(name = "code")
    private String code;    // We will also save the name of the phone

    @Column(name = "type")
    private Integer type;    // We will also save the operating system running the phone

    @Temporal(TemporalType.DATE)
    @Column(name = "date_time")
    private Date date_time;    // We will also save the operating system running the phone

    @Column(name = "p_customer")
    private Integer p_customer;    // We will also save the operating system running the phone

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Date getDate_time() {
        return date_time;
    }

    public void setDate_time(Date date_time) {
        this.date_time = date_time;
    }

    public Integer getP_customer() {
        return p_customer;
    }

    public void setP_customer(Integer p_customer) {
        this.p_customer = p_customer;
    }

}
