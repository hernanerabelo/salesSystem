package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.CustomerException;
import br.com.aplication.hgr.exceptions.DocumentException;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.repositories.CustomerRepository;
import br.com.aplication.hgr.services.CustomerService;
import br.com.aplication.hgr.utils.DocumentUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

  @Autowired
  private CustomerRepository customerRepository;

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
      validAndFormatDocumentNumber(customer);
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
      validAndFormatDocumentNumber(customer);
      updateInformationDate( customer );
      customerRepository.save( customer );

      return customer;
    }else{
      throw new CustomerException( "Cliente não pode ter id para ser salvo." );
    }
  }

  private void validAndFormatDocumentNumber(Customer customer) {
    customer.setDocumentNumber( formatDocumentNumber(customer.getDocumentNumber() ) );
    if( customer.getDocumentNumber().length() == 14 ){
      if( DocumentUtils.isCNPJValid(customer.getDocumentNumber())) {
        customer.setDocumentType("CNPJ");
      }else{
        throw new DocumentException("Número do CNPJ inválido");
      }
    }else if( customer.getDocumentNumber().length() == 11 ){
      if(DocumentUtils.isCPFValid(customer.getDocumentNumber())){
        customer.setDocumentType("CPF");
      }else {
        throw new DocumentException("Número do CPF inválido");
      }
    }else {
      throw new DocumentException("Inserir um número de documento válido (CPF/CNPJ)");
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

  @Override
  public Customer getCustomerByDocumentNumber(String documentNumber) {
    if( documentNumber != null && !"".equals(documentNumber)){
      return customerRepository.getCustomerByDocumentNumber(documentNumber);
    }else{
      throw new CustomerException( "Por favor inserir valor do número do documento do cliente (CPF/CNPJ)" );
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


  private String formatDocumentNumber( String documentNumber ){
    if( documentNumber != null ){
      documentNumber = documentNumber.replaceAll("[^\\d]", "");
    }

    if( documentNumber == null || "".equals( documentNumber ) ){
      throw new CustomerException("Número do documento inválido!!!");
    }
    return documentNumber;
  }
}
