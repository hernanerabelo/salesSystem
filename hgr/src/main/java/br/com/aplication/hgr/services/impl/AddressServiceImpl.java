package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.AddressException;
import br.com.aplication.hgr.models.Address;
import br.com.aplication.hgr.models.ParentPK;
import br.com.aplication.hgr.repositories.AddressRepository;
import br.com.aplication.hgr.services.AddressService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;

@Service
public class AddressServiceImpl implements AddressService {
  private static Logger logger = LogManager.getLogger( AddressServiceImpl.class);
  @Autowired
  AddressRepository addressRepository;

  @Transactional(rollbackOn = Exception.class)
  @Override
  public void save( Address address ) {
    if( address != null ){
      ParentPK parentPK = address.getParentPK();
      if( parentPK != null &&
          !StringUtils.isEmpty( parentPK.getParentId() ) &&
          !StringUtils.isEmpty( parentPK.getParentType() ) ){
        if( addressRepository.exists( parentPK.getParentId(), parentPK.getParentType() ) == 0 ){
          if( !StringUtils.isEmpty( address.getStreet() ) &&
              !StringUtils.isEmpty( address.getStreet().trim() ) ){
            addressRepository.save(address);
            logger.info("Criado endereco " + address.getParentPK() );
          }else {
            logger.error("Inserir nome da rua ou avenida");
            throw new AddressException("Inserir nome da rua ou avenida");
          }
        }else {
          logger.error("Foi encontrado um cliente com esse endereço " + parentPK.toString());
          throw new RuntimeException( "Foi encontrado um cliente com esse endereço " + parentPK.toString() );
        }
      }else {
        logger.error("Não foi encontrado parenteId ou parentType");
        throw new RuntimeException("Não foi encontrado parenteId ou parentType");
      }
    }else{
      throw new AddressException("Não foi encontrado endereço para o cliente");
    }
  }

  @Override
  public Address findByParentIdAndParentType(Long parentId, String parentType) {
    if( !StringUtils.isEmpty(parentId) && !StringUtils.isEmpty(parentType) ){
      return addressRepository.findByParentIdAndParentType( parentId, parentType );
    }else {
      throw new RuntimeException("Não foi encontrado parenteId ou parentType");
    }
  }

  @Override
  public void update(Address address) {
    if( address != null ){
      ParentPK parentPK = address.getParentPK();
      if( parentPK != null &&
          !StringUtils.isEmpty( parentPK.getParentId() ) &&
          !StringUtils.isEmpty( parentPK.getParentType() ) ){
        if( !StringUtils.isEmpty( address.getStreet() ) &&
            !StringUtils.isEmpty( address.getStreet().trim() ) ){
          addressRepository.save(address);
          logger.info("Criado endereco " + address.getParentPK() );
        }else {
          logger.error("Inserir nome da rua ou avenida");
          throw new AddressException("Inserir nome da rua ou avenida");
        }
      }else {
        logger.error("Não foi encontrado parenteId ou parentType");
        throw new RuntimeException("Não foi encontrado parenteId ou parentType");
      }
    }else{
      throw new AddressException("Não foi encontrado endereço para o cliente");
    }
  }
}
