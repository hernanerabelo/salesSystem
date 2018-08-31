package br.com.aplication.hgr.controllers;

import br.com.aplication.hgr.models.Sales;
import br.com.aplication.hgr.services.SalesService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sales")
@SuppressWarnings("unused")
public class SalesController {

  private static final Logger logger = LogManager.getLogger(ProviderController.class);

  @Autowired
  private SalesService salesService;

  @RequestMapping( value = "/customerdocument/{documentNumber}", method = RequestMethod.GET)
  public ResponseEntity getSalesByCustomerDocumentNumber(Pageable pageable, @PathVariable("documentNumber") String documentNumber ){
    logger.info("Buscando vendas pelo documentNumber do cliente: " + documentNumber );

    Page<Sales> sales = salesService.getSalesByCustomerDocumentNumber( pageable, documentNumber );
    logger.info("total de vendas encontradas " + sales.getTotalElements() );
    if( sales.getTotalElements() == 0 ){
      return new ResponseEntity<>(sales, HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(  sales, HttpStatus.OK );
  }
}
