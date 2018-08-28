package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {

    Page<Customer> listAllByPage( Pageable pageable, String fantasyName  );

    Customer findById( Long id );

    Customer update( Customer customer );

    void save( Customer customer );

    Page<Customer> getCustomerByDocumentNumber( Pageable pageable, String documentNumber );

    Page<Customer> getCustomersByLegalName( Pageable pageable, String name );

    Page<Customer> getCustomersByFantasyName( Pageable pageable, String fantasyName );
}
