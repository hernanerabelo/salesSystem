package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.models.Address;
import br.com.aplication.hgr.models.Contact;
import br.com.aplication.hgr.models.Measurement;
import br.com.aplication.hgr.models.Carrier;
import br.com.aplication.hgr.services.CarrierService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;

@RestController
@RequestMapping("/carrier")
@SuppressWarnings("unused")
public class CarrierController {


  private static final Logger logger = LogManager.getLogger(CarrierController.class);
  @Autowired
  private CarrierService carrierService;

  @RequestMapping( method = RequestMethod.GET )
  public ResponseEntity list(Pageable pageable ) {
    logger.info("Buscando todas as transportadoras");
    Page<Carrier> carriers = carrierService.listAllByPage( pageable );

    return new ResponseEntity<>(carriers, HttpStatus.OK);
  }

  @RequestMapping( value = "/{id}", method = RequestMethod.GET )
  public ResponseEntity findById( @PathVariable("id") Long id ){
    logger.info("Buscando transportadora com id " + id );
    Carrier carrier = carrierService.findById( id );
    if( carrier == null){
      return new ResponseEntity<Carrier>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>( carrier, HttpStatus.OK );
  }

  @RequestMapping(  method = RequestMethod.PUT )
  public ResponseEntity update( @RequestBody Carrier carrier ){
    logger.info("Atualizando a transportadora " + carrier.getName() );

    Carrier retorno = carrierService.update( carrier );
    if( retorno == null ){
      return new ResponseEntity<>( HttpStatus.BAD_REQUEST );
    }
    return new ResponseEntity<>( retorno, HttpStatus.ACCEPTED );
  }

  @RequestMapping( method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity save( @RequestBody Carrier carrier ){
    logger.info("Salvando a transportadora " + carrier.getName() );
    carrierService.save( carrier );
    return new ResponseEntity<>( carrier , HttpStatus.CREATED);
  }

  @RequestMapping( value = "/name/{name}", method = RequestMethod.GET)
  public ResponseEntity getCarrierByDescription( Pageable pageable, @PathVariable("name") String name ){
    logger.info("Buscando transportadora pelo nome " + name );

    Page<Carrier> carriers = carrierService.getByName( pageable, name );
    logger.info("total encontrados = " + carriers.getTotalElements());
    if( carriers.getTotalElements() == 0){
      return new ResponseEntity<>(  carriers, HttpStatus.NOT_FOUND );
    }
    return new ResponseEntity<>(  carriers, HttpStatus.OK );
  }

  @RequestMapping( value = "/json", method = RequestMethod.GET )
  public ResponseEntity getJsonCarrier( ){

    Carrier carrier = new Carrier();
    carrier.setAddress(new Address());
    carrier.setContacts( new ArrayList<>() );
    carrier.setCreatedAt(new Date());
    carrier.setUpdatedAt(new Date());

    return new ResponseEntity<>(carrier, HttpStatus.OK);
  }
}
