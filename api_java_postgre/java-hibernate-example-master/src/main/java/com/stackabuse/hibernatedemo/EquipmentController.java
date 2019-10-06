package com.stackabuse.hibernatedemo;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * The type Phone controller.
 *
 * @author Robley Gori - ro6ley.github.io
 */
@RestController
@RequestMapping("/equipment")
public class EquipmentController {

    @Autowired
    private PhoneRepository phoneRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    /**
     * Get all phones list.
     *
     * @return the list
     */
    @GetMapping("/phones")   // GET Method for reading operation
    public List<Phone> getAllPhones() {
        return phoneRepository.findAll();
    }

    /**
     * Gets phones by id.
     *
     * @param phoneId the phone id
     * @return the phones by id
     * @throws Exception
     */
    @GetMapping("/phones/{id}")    // GET Method for Read operation
    public ResponseEntity<Phone> getPhoneById(@PathVariable(value = "id") Long phoneId)
            throws Exception {

        Phone phone = phoneRepository.findById(phoneId)
                .orElseThrow(() -> new Exception("Phone " + phoneId + " not found"));
        return ResponseEntity.ok().body(phone);
    }

    /**
     * Create phone.
     *
     * @param phone the phone
     * @return the phone
     */
    @PostMapping("/phones")     // POST Method for Create operation
    public Phone createPhone(@Valid @RequestBody Phone phone) {
        return phoneRepository.save(phone);
    }

    /**
     * Update phone response entity.
     *
     * @param phoneId the phone id
     * @param phoneDetails the phone details
     * @return the response entity
     * @throws Exception
     */
    @PutMapping("/phones/{id}")    // PUT Method for Update operation
    public ResponseEntity<Phone> updatePhone(
            @PathVariable(value = "id") Long phoneId, @Valid @RequestBody Phone phoneDetails)
            throws Exception {

        Phone phone = phoneRepository.findById(phoneId)
                .orElseThrow(() -> new Exception("Phone " + phoneId + " not found"));

        phone.setPhoneName(phoneDetails.getPhoneName());
        phone.setOs(phoneDetails.getOs());

        final Phone updatedPhone = phoneRepository.save(phone);
        return ResponseEntity.ok(updatedPhone);
    }

    /**
     * Delete phone map.
     *
     * @param phoneId the phone id
     * @return the map of the deleted phone
     * @throws Exception the exception
     */
    @DeleteMapping("/phone/{id}")    // DELETE Method for Delete operation
    public Map<String, Boolean> deletePhone(@PathVariable(value = "id") Long phoneId) throws Exception {
        Phone phone = phoneRepository.findById(phoneId)
                .orElseThrow(() -> new Exception("Phone " + phoneId + " not found"));

        phoneRepository.delete(phone);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @PostMapping("/save")   // GET Method for reading operation
    public String updateEquipment(@RequestParam("lstCodeRequest") String lstCodeRequest,
            @RequestParam("stage") String stage, @RequestParam("customerId") String customerId) {
        String res = "fail";
        try {
            List<String> lstCode = Arrays.asList(lstCodeRequest.split(","));
            List<Equipment> lstEquip = equipmentRepository.findEquimentByListCode(lstCode);
            for (String code : lstCode) {
                Equipment equip = checkExistCode(code, lstEquip);
                if (equip == null) {
                    equip = new Equipment();
                }
                equip.setStage(Integer.valueOf(stage));
                equip.setWarehouse(getWareHouse(stage));
                equip.setP_customer(customerId == null || customerId == "" ? null : Integer.valueOf(customerId));
                equipmentRepository.save(equip);
            }
            res = "ok";
        } catch (Exception e) {
            e.printStackTrace();
            res = e.getMessage();
        }

        return res;
    }

    public int getWareHouse(String stage) {
        if ("1".equals(stage)) {
            return 1;
        } else if ("2".equals(stage)) {
            return 2;
        } else if ("3".equals(stage)) {
            return 1;
        } else if ("4".equals(stage)) {
            return 3;
        } else {
            return 0;
        }
    }

    public Equipment checkExistCode(String code, List<Equipment> lstEquip) {
        if (lstEquip != null && !lstEquip.isEmpty()) {
            for (Equipment equip : lstEquip) {
                if (code.equals(equip.getCode())) {
                    return equip;
                }
            }
        }
        return null;
    }
}
