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
  @Transactional( readOnly = true )
  public ResponseEntity list(Pageable pageable ) {
    logger.info("Buscando todas as transportadoras");
    Page<Carrier> carriers = carrierService.listAllByPage( pageable );

    return new ResponseEntity<>(carriers, HttpStatus.OK);
  }

  @RequestMapping( value = "/{id}", method = RequestMethod.GET )
  @Transactional( readOnly = true )
  public ResponseEntity findById( @PathVariable("id") Long id ){
    logger.info("Buscando transportadora com id " + id );
    Carrier carrier = carrierService.findById( id );
    if( carrier == null){
      return new ResponseEntity<Carrier>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>( carrier, HttpStatus.OK );
  }

  @RequestMapping(  method = RequestMethod.PUT )
  @Transactional( rollbackFor = Exception.class )
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
  @Transactional( readOnly = true )
  public ResponseEntity getCarrierByName( Pageable pageable, @PathVariable("name") String name ){
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

  @RequestMapping( value = "/populate", method = RequestMethod.GET )
  public ResponseEntity populate( ){
    try {
      for ( int i = 0; i < 1000 ; i++ ) {
        Carrier carrier = new Carrier();
        carrier.setName( "Transportadora " + i + " - 00000" + i );
        carrier.setAddress(new Address());
        carrier.getAddress().setCep( "38408222" );
        carrier.getAddress().setCity( "UBERLANDIA" );
        carrier.getAddress().setNumber( "A" + i );
        carrier.getAddress().setState( "MG" );
        carrier.getAddress().setStreet( "RUA TEST " + i );
        carrier.getAddress().setNeighborhood( "CENTRO" );
        carrier.setContacts( new ArrayList<>() );
        carrier.getContacts().add(new Contact());
        carrier.getContacts().get(0).setName( "contato " + i );
        carrier.getContacts().get(0).setObservation( "observação " + i );
        carrier.getContacts().get(0).setEmail( "email " + i + "@test.com.br" );
        carrier.getContacts().get(0).setPhone( "telefone1 " + i );
        carrier.getContacts().get(0).setPhone2( "telefone2 " + i );
        carrier.setCreatedAt(new Date());
        carrier.setUpdatedAt(new Date());
        carrierService.save( carrier );
      }

    }catch (Exception e){
      logger.error(e);
      throw e;
    }
    return new ResponseEntity<>(new Carrier(), HttpStatus.OK);
  }
}
