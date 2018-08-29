package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.AddressException;
import br.com.aplication.hgr.exceptions.ProviderException;
import br.com.aplication.hgr.exceptions.DocumentException;
import br.com.aplication.hgr.models.Contact;
import br.com.aplication.hgr.models.Provider;
import br.com.aplication.hgr.repositories.ProviderRepository;
import br.com.aplication.hgr.services.ProviderService;
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
public class ProviderServiceImpl implements ProviderService {

  private static final Logger logger = LogManager.getLogger(ProviderServiceImpl.class);

  @Autowired
  private ProviderRepository providerRepository;

  @Override
  public Page<Provider> listAllByPage(Pageable pageable ){
    return providerRepository.findAll( pageable );
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Provider findById( Long id ){
    logger.info("Buscando fornecedor com id " + id );
    Provider provider = providerRepository.findOne( id );
    if( provider != null ){
      return provider;
    }else{
      logger.warn("Provider not found for id " + id );
    }
    return null;
  }


  @Override
  @Transactional(rollbackFor = Exception.class)
  public Provider update( Provider provider ){
    if( providerRepository.exists( provider.getId() ) ){

      validAttributesOfProvider(provider);

      validAndFormatDocumentNumber(provider);
      updateInformationDate( provider );
      providerRepository.save( provider );
      return provider;
    }else{
      throw new ProviderException( "Cliente não encontrado" );
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void save( Provider provider ){

    if( provider.getId() == null ){
      validAndFormatDocumentNumber( provider );
      updateInformationDate( provider );

      validAttributesOfProvider(provider);

      providerRepository.save( provider );
      logger.info("Criado provider " + provider.getId() );

    }else{
      throw new ProviderException( "Cliente não pode ter id para ser salvo." );
    }
  }

  private void validAttributesOfProvider(Provider provider) {
    validIfContactCanBeInsert(provider);
    validIfAddressCanBeInsert(provider);
  }

  private void validIfAddressCanBeInsert(Provider provider) {
    if( provider.getAddress() != null ){
      if( !StringUtils.isEmpty( provider.getAddress().getStreet() ) ){
        provider.getAddress().setProvider(provider);
      }else{
        throw new AddressException("O endereço precisa conter nome da Rua ou Avenida");
      }
    }else{
      throw new ProviderException("Não foi encontrado endereço no Fornecedor");
    }
  }

  private void validIfContactCanBeInsert(Provider provider) {
    List<Contact> contacts = provider.getContacts();
    if( contacts != null ){
      for (Contact contact : contacts) {
        if( !StringUtils.isEmpty( contact.getName() ) &&
            !StringUtils.isEmpty( contact.getEmail() ) &&
            !StringUtils.isEmpty( contact.getObservation() ) &&
            !StringUtils.isEmpty( contact.getPhone() ) ){
          contact.setProvider(provider);
        }else {
          throw new ProviderException( "Pelo menos um valor tem que ser inserido no contato" );
        }
      }
    }else {
      logger.info("Não possui contato para ser inserido");
    }
  }

  @Transactional(rollbackFor = Exception.class)
  private void validAndFormatDocumentNumber(Provider provider) {
    provider.setDocumentNumber( formatDocumentNumber(provider.getDocumentNumber() ) );
    if( provider.getDocumentNumber().length() == 14 ){
      if( DocumentUtils.isCNPJValid(provider.getDocumentNumber())) {
        provider.setDocumentType("CNPJ");
      }else{
        throw new DocumentException("Número do CNPJ inválido");
      }
    }else if( provider.getDocumentNumber().length() == 11 ){
      if(DocumentUtils.isCPFValid(provider.getDocumentNumber())){
        provider.setDocumentType("CPF");
      }else {
        throw new DocumentException("Número do CPF inválido");
      }
    }else {
      throw new DocumentException("Inserir um número de documento válido (CPF/CNPJ)");
    }

    Provider providerOwnerDocument = providerRepository.findByDocumentNumber(provider.getDocumentNumber());

    if( providerOwnerDocument != null && !providerOwnerDocument.getId().equals( provider.getId() ) ){
      throw new DocumentException("O Fornecedor " + providerOwnerDocument.getFantasyName() +
          " já possui o " + providerOwnerDocument.getDocumentType() + " informado");
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Page<Provider> getProviderByDocumentNumber( Pageable pageable ,String documentNumber ) {
    if( documentNumber != null && !"".equals(documentNumber)){
      Page<Provider> provider = providerRepository.findByDocumentNumber(documentNumber, pageable);
      if( provider != null ){
        return provider;
      }else{
        logger.warn("Provider not found for documentNumber " + documentNumber );
      }
      return null;
    }else{
      throw new ProviderException( "Por favor inserir valor do número do documento do Fornecedor (CPF/CNPJ)" );
    }
  }

  @Override
  public Page<Provider> getProvidersByLegalName( Pageable pageable, String legalName ) {
    if( !StringUtils.isEmpty( legalName ) && !StringUtils.isEmpty( legalName.trim() ) ){
      return providerRepository.findByLegalNameLikeAllIgnoreCase( legalName, pageable );
    }else {
      throw new ProviderException("Nome com valor vazio");
    }
  }

  @Override
  public Page<Provider> getProvidersByFantasyName( Pageable pageable, String fantasyName ) {
    if( !StringUtils.isEmpty( fantasyName ) && !StringUtils.isEmpty( fantasyName.trim() ) ){
      return providerRepository.findByFantasyNameLikeAllIgnoreCase(fantasyName, pageable);
    }else {
      throw new ProviderException("Nome com valor vazio");
    }
  }

  private void updateInformationDate(Provider provider ){
    if( provider.getCreatedAt() == null ){
      provider.setCreatedBy("criar autenticacao");
      provider.setCreatedAt(new Date());
    }else {
      provider.setUpdatedBy("criar autenticacao");
      provider.setUpdatedAt(new Date());
    }
  }


  private String formatDocumentNumber( String documentNumber ){
    if( documentNumber != null ){
      documentNumber = documentNumber.replaceAll("[^\\d]", "");
    }

    if( documentNumber == null || "".equals( documentNumber ) ){
      throw new ProviderException("Número do documento inválido!!!");
    }
    return documentNumber;
  }
}
