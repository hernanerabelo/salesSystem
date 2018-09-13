package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.models.Address;
import br.com.aplication.hgr.models.Provider;
import br.com.aplication.hgr.services.ProviderService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Date;

@RestController
@RequestMapping("/provider")
@SuppressWarnings("unused")
public class ProviderController {

  private static final Logger logger = LogManager.getLogger(ProviderController.class);
  @Autowired
  private ProviderService providerService;

  @RequestMapping( method = RequestMethod.GET )
  @Transactional( readOnly = true )
  public ResponseEntity list(Pageable pageable) {

    Page<Provider> providers = providerService.listAllByPage( pageable );
    logger.info("total de fornecedores encontrado" + providers.getTotalElements());
    if( providers.getTotalElements() == 0 ){
      return new ResponseEntity<>(providers, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(providers, HttpStatus.OK);
  }

  @RequestMapping( value = "/{id}", method = RequestMethod.GET )
  @Transactional( readOnly = true )
  public ResponseEntity findById( @PathVariable("id") Long id ){

    Provider provider = providerService.findById( id );
    if( provider == null){
      return new ResponseEntity<Provider>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>( provider, HttpStatus.OK );
  }

  @RequestMapping(  method = RequestMethod.PUT )
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity update( @RequestBody Provider provider ){

    Provider retorno = providerService.update( provider );

    return new ResponseEntity<>(retorno, HttpStatus.ACCEPTED);
  }

  @RequestMapping( method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity save( @RequestBody Provider provider ){
    providerService.save( provider );
    return new ResponseEntity<>( provider , HttpStatus.CREATED);
  }

  @RequestMapping( value = "/document/{documentNumber}", method = RequestMethod.GET)
  @Transactional( readOnly = true )
  public ResponseEntity getProviderByDocumentNumber( Pageable pageable, @PathVariable("documentNumber") String documentNumber ){
    logger.info("Buscando cliente pelo documentNumber " + documentNumber );

    Page<Provider> providers = providerService.getProviderByDocumentNumber( pageable, documentNumber );
    logger.info("total de fornecedores encontrado" + providers.getTotalElements());
    if( providers.getTotalElements() == 0 ){
      return new ResponseEntity<>(providers, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  providers, HttpStatus.OK );
  }

  @RequestMapping( value = "/legalName/{legalName}", method = RequestMethod.GET)
  @Transactional( readOnly = true )
  public ResponseEntity getProviderByLegalName( Pageable pageable, @PathVariable("legalName") String legalName ){
    logger.info("Buscando cliente pelo legalName " + legalName );
    Page<Provider> providers = providerService.getProvidersByLegalName( pageable, legalName );
    logger.info("total de fornecedores encontrado" + providers.getTotalElements());
    if( providers.getTotalElements() == 0 ){
      return new ResponseEntity<>(providers, HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(  providers, HttpStatus.OK );
  }

  @RequestMapping( value = "/fantasyName/{fantasyName}", method = RequestMethod.GET)
  @Transactional( readOnly = true )
  public ResponseEntity getProviderByFantasyName( Pageable pageable, @PathVariable("fantasyName") String fantasyName ){
    logger.info("Buscando cliente pelo fantasyName " + fantasyName );
    Page<Provider> providers = providerService.getProvidersByFantasyName( pageable, fantasyName );
    logger.info("total de fornecedores encontrado" + providers.getTotalElements());
    if( providers.getTotalElements() == 0 ){
      return new ResponseEntity<>(providers, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  providers, HttpStatus.OK );
  }

  @RequestMapping( value = "/json", method = RequestMethod.GET )
  public ResponseEntity getJsonProvider( ){

    Provider provider = new Provider();
    provider.setAddress(new Address());
    provider.setContacts(new ArrayList<>());
    provider.setCreatedAt(new Date());
    provider.setUpdatedAt(new Date());

    return new ResponseEntity<>(provider, HttpStatus.OK);
  }
}
