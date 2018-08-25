package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Customer;

import java.util.List;

public interface CustomerService {

    List<Customer> findAll();

    Customer findById( Long id );

    Customer update( Customer customer );

    void save( Customer customer );

    Customer getCustomerByDocumentNumber( String documentNumber );
}
