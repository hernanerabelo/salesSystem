package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.CarrierException;
import br.com.aplication.hgr.models.Carrier;
import br.com.aplication.hgr.repositories.CarrierRepository;
import br.com.aplication.hgr.services.CarrierService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;

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
    logger.info("Buscando carregador com id " + id );
    return carrierRepository.findOne( id );
  }

  @Override
  public Carrier update(Carrier carrier) {
    logger.info("Atualizando transportador com id " + carrier.getId() );
    if( carrierRepository.exists( carrier.getId() ) ){
      updateInformationDate(carrier);
      return carrierRepository.save( carrier );
    }else {
      throw new CarrierException("Transportador não encontrado na base para ser atualizado");
    }
  }

  @Override
  public void save(Carrier carrier) {
    logger.info("Criando transportadora " + carrier.getName() );
    if( carrier.getId() == null ){
      updateInformationDate(carrier);
      carrierRepository.save( carrier );
      logger.info("Criado transportadora " + carrier.getId() );
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
}
