package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.AddressException;
import br.com.aplication.hgr.exceptions.CustomerException;
import br.com.aplication.hgr.exceptions.DocumentException;
import br.com.aplication.hgr.models.Contact;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.repositories.CustomerRepository;
import br.com.aplication.hgr.services.CustomerService;
import br.com.aplication.hgr.utils.DocumentUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;

@Service
@SuppressWarnings("unused")
public class CustomerServiceImpl implements CustomerService {
  private static final Logger logger = LogManager.getLogger(CustomerServiceImpl.class);

  @Autowired
  private CustomerRepository customerRepository;

  @Override
  public Page<Customer> listAllByPage( Pageable pageable, String fantasyName  ){
    return customerRepository.findByFantasyNameLikeAllIgnoreCase( fantasyName, pageable );
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Customer findById( Long id ){
    logger.info("Buscando cliente com id " + id );
    Customer customer = customerRepository.findOne( id );
    if( customer != null ){
      return customer;
    }else{
      logger.warn("Cliente not found for id " + id );
    }
    return null;
  }


  @Override
  @Transactional(rollbackFor = Exception.class)
  public Customer update( Customer customer ){
    if( customerRepository.exists( customer.getId() ) ){

      validAttributesOfCustomer(customer);

      validAndFormatDocumentNumber(customer);
      updateInformationDate( customer );
      customerRepository.save( customer );
      return customer;
    }else{
      throw new CustomerException( "Cliente não encontrado" );
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void save( Customer customer ){

    if( customer.getId() == null ){
      validAndFormatDocumentNumber( customer );
      updateInformationDate( customer );

      validAttributesOfCustomer(customer);

      customerRepository.save( customer );
      logger.info("Criado customer " + customer.getId() );

    }else{
      throw new CustomerException( "Cliente não pode ter id para ser salvo." );
    }
  }

  private void validAttributesOfCustomer(Customer customer) {
    validIfContactCanBeInsert(customer);
    validIfAddressCanBeInsert(customer);
  }

  private void validIfAddressCanBeInsert(Customer customer) {
    if( customer.getAddress() != null ){
      if( !StringUtils.isEmpty( customer.getAddress().getStreet() ) ){
        customer.getAddress().setCustomer(customer);
      }else{
        throw new AddressException("O endereço precisa conter nome da Rua ou Avenida");
      }
    }else{
      throw new CustomerException("Não foi encontrado endereço no cliente");
    }
  }

  private void validIfContactCanBeInsert(Customer customer) {
    List<Contact> contacts = customer.getContacts();
    if( contacts != null ){
      for (Contact contact : contacts) {
        if( !StringUtils.isEmpty( contact.getName() ) &&
            !StringUtils.isEmpty( contact.getEmail() ) &&
            !StringUtils.isEmpty( contact.getObservation() ) &&
            !StringUtils.isEmpty( contact.getPhone() ) ){
          contact.setCustomer(customer);
        }else {
          throw new CustomerException( "Pelo menos um valor tem que ser inserido no contato" );
        }
      }
    }else {
      logger.info("Não possui contato para ser inserido");
    }
  }

  @Transactional(rollbackFor = Exception.class)
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

    Customer customerOwnerDocument = customerRepository.findByDocumentNumber(customer.getDocumentNumber());

    if( customerOwnerDocument != null && !customerOwnerDocument.getId().equals( customer.getId() ) ){
      throw new DocumentException("O cliente " + customerOwnerDocument.getFantasyName() +
          " já possui o " + customerOwnerDocument.getDocumentType() + " informado");
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Page<Customer> getCustomerByDocumentNumber( Pageable pageable ,String documentNumber ) {
    if( documentNumber != null && !"".equals(documentNumber)){
      Page<Customer> customer = customerRepository.findByDocumentNumber(documentNumber, pageable);
      if( customer != null ){
        return customer;
      }else{
        logger.warn("Cliente not found for documentNumber " + documentNumber );
      }
      return null;
    }else{
      throw new CustomerException( "Por favor inserir valor do número do documento do cliente (CPF/CNPJ)" );
    }
  }

  @Override
  public Page<Customer> getCustomersByLegalName( Pageable pageable, String legalName ) {
    if( !StringUtils.isEmpty( legalName ) && !StringUtils.isEmpty( legalName.trim() ) ){
      return customerRepository.findByLegalNameLikeAllIgnoreCase( legalName, pageable );
    }else {
      throw new CustomerException("Nome com valor vazio");
    }
  }

  @Override
  public Page<Customer> getCustomersByFantasyName( Pageable pageable, String fantasyName ) {
    if( !StringUtils.isEmpty( fantasyName ) && !StringUtils.isEmpty( fantasyName.trim() ) ){
      return customerRepository.findByFantasyNameLikeAllIgnoreCase(fantasyName, pageable);
    }else {
      throw new CustomerException("Nome com valor vazio");
    }
  }

  private void updateInformationDate(Customer customer ){
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
