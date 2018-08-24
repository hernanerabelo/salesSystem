package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.exceptions.CustomerException;
import br.com.aplication.hgr.models.Address;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.services.CustomerService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {
  private static final Logger logger = LogManager.getLogger(CustomerController.class);
  @Autowired
  CustomerService customerService;

  @RequestMapping( method = RequestMethod.GET )
  public ResponseEntity findAll( ){

    List<Customer> customeres = customerService.findAll();
    if( customeres == null || customeres.isEmpty() ){
      return new ResponseEntity<List<Customer>>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(customeres, HttpStatus.OK);
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
    if( retorno == null ){
        throw new CustomerException( "Não foi encontrado cliente para atualizar" );
    }
    return new ResponseEntity<>(retorno, HttpStatus.ACCEPTED);
  }

  @RequestMapping( method = RequestMethod.POST )
  public ResponseEntity save( @RequestBody Customer customer ){
    customerService.save( customer );
    return new ResponseEntity<>( customer , HttpStatus.CREATED);
  }

  @RequestMapping( value = "/document/{documentNumber}", method = RequestMethod.GET)
  public ResponseEntity getCustomerByDocumentNumber( @PathVariable("documentNumber") String documentNumber ){
    Customer customer = customerService.getCustomerByDocumentNumber( documentNumber );
    if( customer == null){
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  customer, HttpStatus.OK );
  }

  @RequestMapping( value = "/json", method = RequestMethod.GET )
  public ResponseEntity getJsonCustomer( ){

    Customer customer = new Customer();
    customer.setAddress(new Address());
    customer.setCreatedAt(new Date());
    customer.setUpdatedAt(new Date());

    return new ResponseEntity<>(customer, HttpStatus.OK);
  }

}
