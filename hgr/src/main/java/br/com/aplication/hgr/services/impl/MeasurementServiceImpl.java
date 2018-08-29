package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.MeasurementException;
import br.com.aplication.hgr.models.Measurement;
import br.com.aplication.hgr.repositories.MeasurementRepository;
import br.com.aplication.hgr.services.MeasurementService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@SuppressWarnings("unused")
public class MeasurementServiceImpl implements MeasurementService {

  private static final Logger logger = LogManager.getLogger(MeasurementServiceImpl.class);

  @Autowired
  private MeasurementRepository measurementRepository;

  @Override
  @Transactional( rollbackFor = Exception.class )
  public void save(Measurement measurement) {
    if( !StringUtils.isEmpty( measurement.getType() ) &&
        !StringUtils.isEmpty( measurement.getType().trim() ) &&
        !"NOVA UNIDADE DE MEDIÇÃO".equals( measurement.getType().trim() ) ){
      if( measurement.getId() == null ){
        measurement.setType(measurement.getType().toUpperCase());
        Measurement measurementAux = measurementRepository.findByTypeIgnoreCase(measurement.getType());
        if( measurementAux == null ){
          measurementRepository.save( measurement );
        }else{
          throw new MeasurementException( "Já existe uma medição com type " + measurementAux.getType() );
        }
      }else {
        logger.info("Tipo de medição já existe na base " + measurement.getId() );
      }
    }else{
      throw new MeasurementException( "Tipo de medição não pode ser vazio" );
    }
  }

  @Override
  public List findAll() {
    return measurementRepository.findAll();
  }

  @Override
  public Measurement findById(Long id) {
    return measurementRepository.findOne(id);
  }
}
