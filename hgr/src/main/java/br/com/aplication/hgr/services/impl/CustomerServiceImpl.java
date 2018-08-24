package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.AddressException;
import br.com.aplication.hgr.exceptions.CustomerException;
import br.com.aplication.hgr.exceptions.DocumentException;
import br.com.aplication.hgr.models.Address;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.models.ParentPK;
import br.com.aplication.hgr.repositories.CustomerRepository;
import br.com.aplication.hgr.services.AddressService;
import br.com.aplication.hgr.services.CustomerService;
import br.com.aplication.hgr.utils.DocumentUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {
  private static final Logger logger = LogManager.getLogger(CustomerServiceImpl.class);

  @Autowired
  private CustomerRepository customerRepository;

  @Autowired
  private AddressService addressService;

  @Override
  public List<Customer> findAll(){
    return customerRepository.findAll();
  }

  @Override
  public Customer findById( Long id ){
    logger.info("Buscando cliente com id " + id );
    Customer customer = customerRepository.findOne( id );
    if( customer != null ){
      populateCustomer(customer);
    }else{
      logger.warn("Cliente not found for id " + id );
    }
    return customer;
  }

  @Transactional(rollbackOn = Exception.class)
  @Override
  public Customer update( Customer customer ){
    if( customerRepository.exists( customer.getId() ) ){
      validAndFormatDocumentNumber(customer);
      updateInformationDate( customer );
      customerRepository.save( customer );

      if( customer.getAddress() != null ){
        customer.getAddress().setParentPK( new ParentPK( customer.getId(), Customer.class.getSimpleName() ) );
        addressService.update( customer.getAddress() );
      }else {
        throw new CustomerException( "Não foi encontrado endereço para o cliente" );
      }
      return customer;
    }else{
      throw new CustomerException( "Cliente não encontrado" );
    }
  }

  @Transactional(rollbackOn = Exception.class)
  @Override
  public void save( Customer customer ){

    if( customer.getId() == null ){
      validAndFormatDocumentNumber( customer );
      updateInformationDate( customer );
      customerRepository.save( customer );
      logger.info("Criado customer " + customer.getId() );
      if( customer.getAddress() != null ){
        customer.getAddress().setParentPK( new ParentPK( customer.getId(), Customer.class.getSimpleName() ) );
        addressService.save( customer.getAddress() );
      }else {
        throw new AddressException("Não foi encontrado informações do endereço");
      }
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

    Customer customerOwnerDocument = customerRepository.getCustomerByDocumentNumber(customer.getDocumentNumber());

    if( customerOwnerDocument != null && !customerOwnerDocument.getId().equals( customer.getId() ) ){
      throw new DocumentException("O cliente " + customerOwnerDocument.getFantasyName() +
          " já possui o " + customerOwnerDocument.getDocumentType() + " informado");
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
      Customer customer = customerRepository.getCustomerByDocumentNumber(documentNumber);
      if( customer != null ){
        populateCustomer(customer);
      }else{
        logger.warn("Cliente not found for documentNumber " + documentNumber );
      }
      return customer;
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

  private void populateCustomer( Customer customer ){
    if( customer != null ){
      Address address = addressService.findByParentIdAndParentType(customer.getId(), Customer.class.getSimpleName());
      if( address != null ){
        logger.info("Address found " + address.getParentPK() );
        customer.setAddress(address);
      }else {
        logger.info("Not found address for customer" + customer.getId());
      }
    }else{
      logger.warn("cliente is null");
    }
  }
}
