package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.models.Measurement;
import br.com.aplication.hgr.models.Product;
import br.com.aplication.hgr.services.ProductService;
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
import java.util.Date;

@RestController
@RequestMapping("/product")
@SuppressWarnings("unused")
public class ProductController {

  private static final Logger logger = LogManager.getLogger(ProductController.class);
  @Autowired
  private ProductService productService;

  @RequestMapping( method = RequestMethod.GET )
  public ResponseEntity list(Pageable pageable ) {

    Page<Product> products = productService.listAllByPage( pageable );

    return new ResponseEntity<>(products, HttpStatus.OK);
  }

  @RequestMapping( value = "/{id}", method = RequestMethod.GET )
  public ResponseEntity findById( @PathVariable("id") Long id ){

    Product product = productService.findById( id );
    if( product == null){
      return new ResponseEntity<Product>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>( product, HttpStatus.OK );
  }

  @RequestMapping(  method = RequestMethod.PUT )
  public ResponseEntity update( @RequestBody Product product ){

    Product retorno = productService.update( product );

    return new ResponseEntity<>(retorno, HttpStatus.ACCEPTED);
  }

  @RequestMapping( method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity save( @RequestBody Product product ){
    logger.info("Salvando producto " + product.getCode() );
    productService.save( product );
    return new ResponseEntity<>( product , HttpStatus.CREATED);
  }

  @RequestMapping( value = "/description/{description}", method = RequestMethod.GET)
  public ResponseEntity getProductByDescription( Pageable pageable, @PathVariable("description") String description ){
    logger.info("Buscando produto pela description " + description );

    Page<Product> products = productService.getByDescription( pageable, description );
    logger.info("total encontrados = " + products.getTotalElements());
    if( products.getTotalElements() == 0){
      return new ResponseEntity<>(  products, HttpStatus.NOT_FOUND );
    }
    return new ResponseEntity<>(  products, HttpStatus.OK );
  }

  @RequestMapping( value = "/code/{code}", method = RequestMethod.GET)
  public ResponseEntity getProductByCode( Pageable pageable, @PathVariable("code") String code ){
    logger.info("Buscando produto pelo code " + code );
    Page<Product> products = productService.getByCode( pageable, code );
    logger.info("total encontrados = " + products.getTotalElements());
    if( products.getTotalElements() == 0){
      return new ResponseEntity<>(  products, HttpStatus.NOT_FOUND );
    }
    return new ResponseEntity<>(  products, HttpStatus.OK );
  }

  @RequestMapping( value = "/json", method = RequestMethod.GET )
  public ResponseEntity getJsonProduct( ){

    Product product = new Product();
    product.setMeasurement(new Measurement());
    product.setCreatedAt(new Date());
    product.setUpdatedAt(new Date());

    return new ResponseEntity<>(product, HttpStatus.OK);
  }
}
