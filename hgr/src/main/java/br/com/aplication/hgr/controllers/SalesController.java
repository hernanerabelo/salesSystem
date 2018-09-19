package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.models.*;
import br.com.aplication.hgr.services.SalesService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

@RestController
@RequestMapping("/sales")
@SuppressWarnings("unused")
public class SalesController {

  private static final Logger logger = LogManager.getLogger(ProviderController.class);

  @Autowired
  private SalesService salesService;

  @RequestMapping( value = "/{id}", method = RequestMethod.GET)
  @Transactional( readOnly = true )
  public ResponseEntity findById( @PathVariable("id") Long id ){
    logger.info("Buscando vendas pelo id do cliente: " + id );

    Sales sales = salesService.findById( id );
    if( sales == null ){
      logger.warn("Não foi encontrado venda para o id " + id );
      return new ResponseEntity<>(sales, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  sales, HttpStatus.OK );
  }

  @RequestMapping( method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity save( @RequestBody Sales sales ){
    try {
      salesService.save( sales );
      logger.info("Criado venda " + sales.getId() );
    }catch ( Exception e ){
      logger.error("Erro ao salvar a venda", e);
      throw e;
    }
    return new ResponseEntity<>( sales , HttpStatus.CREATED);
  }

  @RequestMapping( method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(rollbackFor = Exception.class)
  public ResponseEntity update( @RequestBody Sales sales ){
    try {
      logger.info("Atualizando venda " + sales.getId()  );
      salesService.update( sales );
      logger.info("Atualizado venda " + sales.getId() );
    }catch ( Exception e ){
      logger.error("Erro ao salvar a venda", e);
      throw e;
    }
    return new ResponseEntity<>( sales , HttpStatus.CREATED);
  }

  @RequestMapping( value = "/customerdocument/{documentNumber}", method = RequestMethod.GET)
  @Transactional( readOnly = true )
  public ResponseEntity getSalesByCustomerDocumentNumber( Pageable pageable,
                                                          @PathVariable("documentNumber") String documentNumber,
                                                          @RequestParam(value = "start", required = false ) Long startDate,
                                                          @RequestParam(value = "finish", required = false ) Long finishDate,
                                                          @RequestParam(value = "status", required = false ) String status,
                                                          @RequestParam(value = "createdBy", required = false ) String createdBy ){
    logger.info("Buscando vendas pelo documentNumber do cliente: " + documentNumber );

    Filter filter = getFilter(startDate, finishDate, status, createdBy);
    filter.getColumn().put( "DOCUMENT_NUMBER", documentNumber );

    Page<Sales> sales = salesService.getSalesByCustomerUsingFilter( pageable, filter );
    logger.info("total de vendas encontradas " + sales.getTotalElements() );
    if( sales.getTotalElements() == 0 ){
      return new ResponseEntity<>(sales, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  sales, HttpStatus.OK );
  }

  @RequestMapping( value = "/customerfantasy/{fantasyName}", method = RequestMethod.GET)
  @Transactional( readOnly = true )
  public ResponseEntity getSalesByCustomerFantasyName(Pageable pageable,
                                                      @PathVariable("fantasyName") String fantasyName,
                                                      @RequestParam(value = "start", required = false ) Long startDate,
                                                      @RequestParam(value = "finish", required = false ) Long finishDate,
                                                      @RequestParam(value = "status", required = false ) String status,
                                                      @RequestParam(value = "createdBy", required = false ) String createdBy  ){
    logger.info("Buscando vendas pelo nome fantasia do cliente: " + fantasyName );
    Filter filter = getFilter(startDate, finishDate, status, createdBy);
    filter.getColumn().put( "FANTASY_NAME", fantasyName );

    Page<Sales> sales = salesService.getSalesByCustomerUsingFilter( pageable, filter );
    logger.info("total de vendas encontradas " + sales.getTotalElements() );
    if( sales.getTotalElements() == 0 ){
      return new ResponseEntity<>(sales, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  sales, HttpStatus.OK );
  }

  @RequestMapping( value = "/providerdocument/{documentNumber}", method = RequestMethod.GET)
  @Transactional( readOnly = true )
  public ResponseEntity getSalesByProviderDocumentNumber(Pageable pageable,
                                                         @PathVariable("documentNumber") String documentNumber,
                                                         @RequestParam(value = "start", required = false ) Long startDate,
                                                         @RequestParam(value = "finish", required = false ) Long finishDate,
                                                         @RequestParam(value = "status", required = false ) String status,
                                                         @RequestParam(value = "createdBy", required = false ) String createdBy  ){
    logger.info("Buscando vendas pelo documentNumber do fornecedor: " + documentNumber );
    Filter filter = getFilter(startDate, finishDate, status, createdBy);
    filter.getColumn().put( "DOCUMENT_NUMBER", documentNumber );

    Page<Sales> sales = salesService.getSalesByProviderUsingFilter( pageable, filter );
    logger.info("total de vendas encontradas " + sales.getTotalElements() );
    if( sales.getTotalElements() == 0 ){
      return new ResponseEntity<>(sales, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  sales, HttpStatus.OK );
  }

  @RequestMapping( value = "/providerfantasy/{fantasyName}", method = RequestMethod.GET)
  @Transactional( readOnly = true )
  public ResponseEntity getSalesByProviderFantasyName(Pageable pageable,
                                                      @PathVariable("fantasyName") String fantasyName,
                                                      @RequestParam(value = "start", required = false ) Long startDate,
                                                      @RequestParam(value = "finish", required = false ) Long finishDate,
                                                      @RequestParam(value = "status", required = false ) String status,
                                                      @RequestParam(value = "createdBy", required = false ) String createdBy  ){
    logger.info("Buscando vendas pelo nome fantasia do fornecedor: " + fantasyName );

    Filter filter = getFilter(startDate, finishDate, status, createdBy);
    filter.getColumn().put( "FANTASY_NAME", fantasyName );

    Page<Sales> sales = salesService.getSalesByProviderUsingFilter( pageable, filter );
    logger.info("total de vendas encontradas " + sales.getTotalElements() );
    if( sales.getTotalElements() == 0 ){
      return new ResponseEntity<>(sales, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  sales, HttpStatus.OK );
  }

  private Filter getFilter( Long startDate, Long finishDate, String status, String createdBy) {
    Filter filter = new Filter();
    filter.setColumn( new HashMap<>() );
    if( !StringUtils.isEmpty( startDate ) ){
      filter.setStart( new Date( startDate ) );
    }
    if( !StringUtils.isEmpty( finishDate ) ){
      filter.setFinish( new Date( finishDate + ( 24 * 60 * 60 * 1000 ) ) );
    }
    if( !StringUtils.isEmpty( status ) ){
      filter.setStatus( status );
    }
    if( !StringUtils.isEmpty( createdBy ) ){
      filter.setCreatedBy( createdBy );
    }
    return filter;
  }

  @RequestMapping( value = "/json", method = RequestMethod.GET )
  public ResponseEntity getJsonProvider( ){

    Sales sales = new Sales();
    sales.setAddress( new Address() );
    sales.setCarrier( new Carrier() );
    sales.setCustomer( new Customer() );
    sales.setProvider( new Provider() );
    sales.setContacts( new ArrayList<>() );
    sales.getContacts().add(new Contact());
    sales.setCreatedAt( new Date() );
    sales.setUpdatedAt (new Date() );

    return new ResponseEntity<>(sales, HttpStatus.OK);
  }
}
