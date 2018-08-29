package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.models.Address;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.services.CustomerService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;

@RestController
@RequestMapping("/customer")
@SuppressWarnings("unused")
public class CustomerController {
  private static final Logger logger = LogManager.getLogger(CustomerController.class);
  @Autowired
  private CustomerService customerService;

  @RequestMapping( method = RequestMethod.GET )
  public ResponseEntity list( Pageable pageable, @RequestParam("fantasyName") String fantasyName ) {

    Page<Customer> customers = customerService.listAllByPage( pageable, fantasyName );
    if( customers.getTotalElements() == 0 ){
      return new ResponseEntity<>(customers, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(customers, HttpStatus.OK);
  }

  @RequestMapping( value = "/{id}", method = RequestMethod.GET )
  public ResponseEntity findById( @PathVariable("id") Long id ){

    Customer customer = customerService.findById( id );
    if( customer == null){
      return new ResponseEntity<Customer>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  customer, HttpStatus.OK );
  }

  @RequestMapping(  method = RequestMethod.PUT )
  public ResponseEntity update( @RequestBody Customer customer ){

    Customer retorno = customerService.update( customer );

    return new ResponseEntity<>(retorno, HttpStatus.ACCEPTED);
  }

  @RequestMapping( method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity save( @RequestBody Customer customer ){
    customerService.save( customer );
    return new ResponseEntity<>( customer , HttpStatus.CREATED);
  }

  @RequestMapping( value = "/document/{documentNumber}", method = RequestMethod.GET)
  public ResponseEntity getCustomerByDocumentNumber( Pageable pageable, @PathVariable("documentNumber") String documentNumber ){
    logger.info("Buscando cliente pelo documentNumber " + documentNumber );

    Page<Customer> customers = customerService.getCustomerByDocumentNumber( pageable, documentNumber );
    if( customers.getTotalElements() == 0 ){
      return new ResponseEntity<>(customers, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  customers, HttpStatus.OK );
  }

  @RequestMapping( value = "/legalName/{legalName}", method = RequestMethod.GET)
  public ResponseEntity getCustomerByLegalName( Pageable pageable, @PathVariable("legalName") String legalName ){
    logger.info("Buscando cliente pelo legalName " + legalName );
    Page<Customer> customers = customerService.getCustomersByLegalName( pageable, legalName );
    logger.info("total de cliente encontrado" + customers.getTotalElements());
    if( customers.getTotalElements() == 0 ){
      return new ResponseEntity<>(customers, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  customers, HttpStatus.OK );
  }

  @RequestMapping( value = "/fantasyName/{fantasyName}", method = RequestMethod.GET)
  public ResponseEntity getCustomerByFantasyName( Pageable pageable, @PathVariable("fantasyName") String fantasyName ){
    logger.info("Buscando cliente pelo fantasyName " + fantasyName );
    Page<Customer> customers = customerService.getCustomersByFantasyName( pageable, fantasyName );
    logger.info("total de cliente encontrado" + customers.getTotalElements());
    if( customers.getTotalElements() == 0 ){
      return new ResponseEntity<>(customers, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  customers, HttpStatus.OK );
  }

  @RequestMapping( value = "/json", method = RequestMethod.GET )
  public ResponseEntity getJsonCustomer( ){

    Customer customer = new Customer();
    customer.setAddress(new Address());
    customer.setContacts(new ArrayList<>());
    customer.setCreatedAt(new Date());
    customer.setUpdatedAt(new Date());

    return new ResponseEntity<>(customer, HttpStatus.OK);
  }

}
