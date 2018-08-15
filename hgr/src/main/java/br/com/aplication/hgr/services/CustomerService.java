package br.com.aplication.hgr.services;

import br.com.aplication.hgr.exceptions.CustomerException;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class CustomerService {

  @Autowired
  CustomerRepository customerRepository;

  @Transactional(rollbackOn = Exception.class)
  public Customer insertNewCustomer( Customer customer ){
    updateInformationDate( customer );
    return customerRepository.save( customer );
  }

  public List<Customer> findAll(){
    return customerRepository.findAll();
  }

  public Customer findById( Long id ){
    return customerRepository.findOne( id );
  }

  @Transactional(rollbackOn = Exception.class)
  public Customer update( Customer customer ){
    if( customerRepository.exists( customer.getId() ) ){
      updateInformationDate( customer );
      customerRepository.save( customer );
      return customer;
    }else{
      throw new CustomerException( "Cliente não encontrado" );
    }
  }

  @Transactional(rollbackOn = Exception.class)
  public Customer save( Customer customer ){

    if( customer.getId() == null ){
      updateInformationDate( customer );
      customerRepository.save( customer );

      return customer;
    }else{
      throw new CustomerException( "Cliente não pode ter id para ser salvo" );
    }
  }

  @Transactional(rollbackOn = Exception.class)
  public void delete( Customer customer ){
    if( customerRepository.exists( customer.getId() ) ){
      customerRepository.delete( customer.getId() );
    }else{
      throw new CustomerException( "Cliente não encontrado" );
    }
  }

  private void updateInformationDate( Customer customer ){
    if( customer.getCreatedAt() == null ){
      customer.setCreatedBy("criar autenticacao");
      customer.setCreatedAt(new Date());
    }
    customer.setUpdatedBy("criar autenticacao");
    customer.setUpdatedAt( new Date() );
  }
}
