package com.stackabuse.hibernatedemo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * The interface Phone repository.
 *
 * @author Robley Gori - ro6ley.github.io
 */
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    @Query(nativeQuery = true, value = "select * from p_equipment where code IN (:codes)")   // 3. Spring JPA In cause using native query
    List<Equipment> findEquimentByListCode(@Param("names") List<String> codes);
}
