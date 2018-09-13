package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.models.Measurement;
import br.com.aplication.hgr.services.MeasurementService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/measurement")
@SuppressWarnings("unused")
public class MeasurementController {

  private static final Logger logger = LogManager.getLogger(MeasurementController.class);
  @Autowired
  private MeasurementService measurementService;

  @RequestMapping( method = RequestMethod.GET )
  @Transactional( readOnly = true )
  public ResponseEntity findAll( ) {
    logger.info("buscando todas as unidades de medição");
    List<Measurement> measurements = measurementService.findAll();
    if( measurements == null || measurements.size() == 0 ){
      logger.warn("não foi encontrado nenhuma unidade de medição");
      return new ResponseEntity<>( HttpStatus.NOT_FOUND);
    }
    logger.info("total de unidade de medição encontrado" + measurements.size());
    Collections.sort( measurements, (Measurement ob1, Measurement obj2) -> {
      if( ob1.getType() == null ){
        return 1;
      }else if( obj2.getType() == null ) {
        return -1;
      }else{
        return ob1.getType().compareTo( obj2.getType() );
      }
    });

    return new ResponseEntity<>(measurements, HttpStatus.OK);
  }

  @RequestMapping( value = "/{id}", method = RequestMethod.GET )
  @Transactional( readOnly = true )
  public ResponseEntity findById( @PathVariable("id") Long id ){

    Measurement measurement = measurementService.findById( id );
    if( measurement == null){
      return new ResponseEntity<Measurement>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>( measurement, HttpStatus.OK );
  }

  @RequestMapping( method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity save( @RequestBody Measurement measurement ){
    measurementService.save( measurement );
    return new ResponseEntity<>( measurement , HttpStatus.CREATED);
  }

  @RequestMapping( value = "/json", method = RequestMethod.GET )
  public ResponseEntity getJsonMeasurement( ){

    Measurement measurement = new Measurement();

    return new ResponseEntity<>(measurement, HttpStatus.OK);
  }
}
