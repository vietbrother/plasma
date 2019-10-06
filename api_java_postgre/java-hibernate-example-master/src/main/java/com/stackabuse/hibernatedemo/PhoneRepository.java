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
public interface PhoneRepository extends JpaRepository<Phone, Long> {

//    @Query(nativeQuery = true, value = "SELECT * FROM Employee as e WHERE e.employeeName IN (:names)")   // 3. Spring JPA In cause using native query
//    List<Employee> findByEmployeeName(@Param("names") List<String> names);
}
