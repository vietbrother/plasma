package com.mydeveloperplanet.myspringcloudvisionplanet;

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
    private EquipmentRepository equipmentRepository;

    //@PostMapping("/save")   // GET Method for reading operation
    @RequestMapping(value = "/save", method = RequestMethod.POST, produces = "application/json")
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
