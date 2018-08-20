package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Customer;

import java.util.List;

public interface CustomerService {

    Customer insertNewCustomer( Customer customer );

    List<Customer> findAll();

    Customer findById( Long id );

    Customer update( Customer customer );

    Customer save( Customer customer );

    void delete( Customer customer );

}
