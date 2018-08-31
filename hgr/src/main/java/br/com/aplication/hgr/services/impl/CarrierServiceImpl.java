package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.AddressException;
import br.com.aplication.hgr.exceptions.CarrierException;
import br.com.aplication.hgr.exceptions.CustomerException;
import br.com.aplication.hgr.models.Carrier;
import br.com.aplication.hgr.models.Contact;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.repositories.CarrierRepository;
import br.com.aplication.hgr.services.CarrierService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;

@Service
public class CarrierServiceImpl implements CarrierService {

  private static final Logger logger = LogManager.getLogger(CarrierServiceImpl.class);

  @Autowired
  CarrierRepository carrierRepository;

  @Override
  public Page<Carrier> listAllByPage(Pageable pageable) {
    logger.info("Buscando todas as transportadoras");
    return carrierRepository.findAll(pageable);
  }

  @Override
  public Carrier findById(Long id) {
    logger.info("Buscando transportadora com id " + id );
    return carrierRepository.findOne( id );
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Carrier update(Carrier carrier) {
    logger.info("Atualizando transportadora com id " + carrier.getId() );
    if( carrierRepository.exists( carrier.getId() ) ){
      if( isValidCarrier( carrier ) ){
        updateInformationDate(carrier);
        return carrierRepository.save( carrier );
      }
    }else {
      throw new CarrierException("Transportador não encontrado na base para ser atualizado");
    }
    return null;
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void save(Carrier carrier) {
    logger.info("Criando transportadora " + carrier.getName() );
    if( carrier.getId() == null ){
      if ( isValidCarrier(carrier) ){
        updateInformationDate(carrier);
        carrierRepository.save( carrier );
        logger.info("Criado transportadora " + carrier.getId() );
      }
    }else {
      throw new CarrierException("Transportador não pode ter ID para ser salvo");
    }
  }

  @Override
  public Page<Carrier> getByName(Pageable pageable, String name) {
    logger.info("Buscando transportadora com nome " + name );
    if( !StringUtils.isEmpty( name ) && !StringUtils.isEmpty( name.trim() ) ){
      return carrierRepository.findByNameLikeAllIgnoreCase( name, pageable );
    }else {
      throw new CarrierException("Inserir o nome da transportadora pra busca");
    }
  }

  private void updateInformationDate(Carrier carrier ){
    if( carrier.getCreatedAt() == null ){
      carrier.setCreatedBy("criar autenticacao");
      carrier.setCreatedAt(new Date());
    }else {
      carrier.setUpdatedBy("criar autenticacao");
      carrier.setUpdatedAt(new Date());
    }
  }

  private boolean isValidCarrier( Carrier carrier ){
    if( StringUtils.isEmpty( carrier.getName() ) || StringUtils.isEmpty( carrier.getName().trim() ) ){
      throw new CarrierException( "Transportadora precisa ter um nome" );
    }
    validAttributesOfCarrier(carrier);
    return true;
  }

  private void validAttributesOfCarrier(Carrier carrier) {
    validIfContactCanBeInsert(carrier);
    validIfAddressCanBeInsert(carrier);
  }

  private void validIfAddressCanBeInsert(Carrier carrier) {
    if( carrier.getAddress() != null ){
      if( !StringUtils.isEmpty( carrier.getAddress().getStreet() ) ){
        carrier.getAddress().setCarrier(carrier);
      }else{
        throw new AddressException("O endereço precisa conter nome da Rua ou Avenida");
      }
    }else{
      throw new CustomerException("Não foi encontrado endereço no cliente");
    }
  }

  private void validIfContactCanBeInsert(Carrier carrier) {
    List<Contact> contacts = carrier.getContacts();
    if( contacts != null ){
      for (Contact contact : contacts) {
        if( !StringUtils.isEmpty( contact.getName() ) &&
            !StringUtils.isEmpty( contact.getEmail() ) &&
            !StringUtils.isEmpty( contact.getObservation() ) &&
            !StringUtils.isEmpty( contact.getPhone() ) ){
          contact.setCarrier(carrier);
        }else {
          throw new CustomerException( "Pelo menos um valor tem que ser inserido no contato" );
        }
      }
    }else {
      logger.info("Não possui contato para ser inserido");
    }
  }
}
