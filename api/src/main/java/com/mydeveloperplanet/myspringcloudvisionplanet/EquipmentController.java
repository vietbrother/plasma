package com.mydeveloperplanet.myspringcloudvisionplanet;

import com.google.gson.Gson;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//import com.google.gson.Gson;
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
        String lstId = "";
        try {
            List<String> lstCode = Arrays.asList(lstCodeRequest.split(","));
            List<Equipment> lstEquip = equipmentRepository.findEquimentByListCode(lstCode);
            System.out.println("lstCode " + lstCodeRequest);
            System.out.println("lstEquip " + lstEquip.size());
            for (String code : lstCode) {
                Equipment equip = checkExistCode(code, lstEquip);
                if (equip == null) {
                    equip = new Equipment();
                    equip.setCode(code);
                }
                equip.setStage(Integer.valueOf(stage));
                equip.setWarehouse(getWareHouse(stage));
                if (customerId != null && !"".equals(customerId)) {
                    equip.setP_customer(Integer.valueOf(customerId));
                }
                Equipment ressult = equipmentRepository.save(equip);
                lstId += ressult.getId() + ";";
            }
            res = "ok";
        } catch (Exception e) {
            e.printStackTrace();
            res = e.getMessage();
        }
        Gson gson = new Gson();
        String json = gson.toJson(new ResponseObj(res, lstId));
        System.out.println("json " + json);
        return json;
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
