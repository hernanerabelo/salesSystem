package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.exceptions.CustomerException;
import br.com.aplication.hgr.models.Customer;
import br.com.aplication.hgr.services.impl.CustomerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    CustomerServiceImpl customerServiceImpl;

    @RequestMapping( method = RequestMethod.GET )
    public ResponseEntity findAll( ){

        List<Customer> customeres = customerServiceImpl.findAll();
        if( customeres == null || customeres.isEmpty() ){
            return new ResponseEntity<List<Customer>>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(customeres, HttpStatus.OK);
    }

    @RequestMapping( value = "/{id}", method = RequestMethod.GET )
    public ResponseEntity findById( @PathVariable("id") Long id ){

        Customer customer = customerServiceImpl.findById( id );
        if( customer == null){
            return new ResponseEntity<Customer>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(  customer, HttpStatus.OK );
    }

    @RequestMapping(  method = RequestMethod.PUT )
    public ResponseEntity update( @RequestBody Customer customer ){

        Customer retorno = customerServiceImpl.update( customer );
        if( retorno == null ){
            throw new CustomerException( "Não foi encontrado cliente para atualizar" );
        }
        return new ResponseEntity<>(retorno, HttpStatus.ACCEPTED);
    }

    @RequestMapping( method = RequestMethod.POST )
    public ResponseEntity save( @RequestBody Customer customer ){

        Customer retorno = customerServiceImpl.save( customer );
        if( retorno == null ){
            return new ResponseEntity<Customer>( HttpStatus.BAD_REQUEST );
        }

        return new ResponseEntity<>( retorno , HttpStatus.CREATED);
    }

    @RequestMapping( value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteById( @PathVariable("id") String id ){
        Long id2;
        try{
            id2 = new Long(id);
        }catch (Exception e){
            return new ResponseEntity<Customer>(HttpStatus.BAD_REQUEST);
        }
        Customer customer = new Customer();
        customer.setId(id2);
        customerServiceImpl.delete( customer );

        return new ResponseEntity<Customer>(HttpStatus.OK);
    }

    @RequestMapping( value = "/json", method = RequestMethod.GET )
    public ResponseEntity getJsonCustomer( ){

        Customer customer = new Customer();
        customer.setCreatedAt(new Date());
        customer.setUpdatedAt(new Date());

        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

}
