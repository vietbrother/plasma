package com.mydeveloperplanet.myspringcloudvisionplanet;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * This class will represent our phone and its attributes: - ID - Name -
 * Operating system
 *
 * @author Robley Gori - ro6ley.github.io
 */
@Entity
@Table(name = "p_equipment")   // the table in the database that will contain our phones data
@EntityListeners(AuditingEntityListener.class)
public class Equipment {

    /**
     * The attributes of the phone
     */
    //@Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
    //@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "p_equipment_id_seq")
    @Id
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "p_equipment_id_seq")
//    @SequenceGenerator(name = "p_equipment_id_seq", sequenceName = "p_equipment_id_seq")
    @SequenceGenerator(name = "p_equipment_id_seq",
            sequenceName = "p_equipment_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "p_equipment_id_seq")
    @Column(name = "id", updatable = false)
    private Integer id;    // Each phone will be given an auto-generated unique identifier when stored

    @Column(name = "code")
    private String code;    // We will also save the name of the phone

    @Column(name = "stage")
    private Integer stage;    // We will also save the operating system running the phone

    @Column(name = "warehouse")
    private Integer warehouse;    // We will also save the operating system running the phone

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

    public Integer getStage() {
        return stage;
    }

    public void setStage(Integer stage) {
        this.stage = stage;
    }

    public Integer getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Integer warehouse) {
        this.warehouse = warehouse;
    }

    public Integer getP_customer() {
        return p_customer;
    }

    public void setP_customer(Integer p_customer) {
        this.p_customer = p_customer;
    }

    @Override
    public String toString() {
        return "Equipment{" + "id=" + id + ", code=" + code + ", stage=" + stage + ", warehouse=" + warehouse + ", p_customer=" + p_customer + '}';
    }

}
