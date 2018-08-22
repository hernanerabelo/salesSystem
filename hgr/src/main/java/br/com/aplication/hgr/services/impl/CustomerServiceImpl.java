package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.CustomerException;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.repositories.CustomerRepository;
import br.com.aplication.hgr.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

  @Autowired
  CustomerRepository customerRepository;

  @Transactional(rollbackOn = Exception.class)
  @Override
  public Customer insertNewCustomer( Customer customer ){
    updateInformationDate( customer );
    return customerRepository.save( customer );
  }

  @Override
  public List<Customer> findAll(){
    return customerRepository.findAll();
  }

  @Override
  public Customer findById( Long id ){
    return customerRepository.findOne( id );
  }

  @Transactional(rollbackOn = Exception.class)
  @Override
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
  @Override
  public Customer save( Customer customer ){

    if( customer.getId() == null ){
      if( validDocumentNumber(customer) ){
//      todo mudar logica para buscar cpf ou cnpj
        if( customer.getDocumentNumber().length() == 14 ){
          customer.setDocumentType("CNPJ");
        }else{
          customer.setDocumentType("CPF");
        }
        updateInformationDate( customer );
        customerRepository.save( customer );

        return customer;
      }else{
        throw new CustomerException( "Faltando informação para salvar o cliente." );
      }
    }else{
      throw new CustomerException( "Cliente não pode ter id para ser salvo." );
    }
  }

  @Transactional(rollbackOn = Exception.class)
  @Override
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
    }else {
      customer.setUpdatedBy("criar autenticacao");
      customer.setUpdatedAt(new Date());
    }
  }


  private boolean validDocumentNumber( Customer customer ){
    if( customer.getDocumentNumber() != null ){
      customer.setDocumentNumber( customer.getDocumentNumber().replaceAll("[^\\d]", "") );
    }

    if( customer.getDocumentNumber() == null || "".equals( customer.getDocumentNumber() ) ){
      throw new CustomerException("Número do documento inválido!!!");
    }
    return true;
  }
}
