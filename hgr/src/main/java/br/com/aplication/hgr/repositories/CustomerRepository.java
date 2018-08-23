package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

  @Query(value = "SELECT * FROM HBR_CUSTOMER WHERE DOCUMENT_NUMBER = ?1", nativeQuery = true)
  Customer getCustomerByDocumentNumber(String documentNumber);
}
