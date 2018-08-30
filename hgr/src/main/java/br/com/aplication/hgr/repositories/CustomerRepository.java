package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

  Customer findByDocumentNumber( String documentNumber );

  Page<Customer> findByDocumentNumber( String documentNumber, Pageable pageable );

  Page<Customer> findByLegalNameLikeAllIgnoreCase( String legalName, Pageable pageable );

  Page<Customer> findByFantasyNameLikeAllIgnoreCase( String fantasyName,  Pageable pageable );

}
