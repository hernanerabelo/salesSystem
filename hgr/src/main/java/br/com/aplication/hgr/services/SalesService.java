package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Filter;
import br.com.aplication.hgr.models.Sales;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SalesService {

  Sales findById( Long id );

  void update( Sales sales );

  Page<Sales> getSalesByCustomerDocumentNumber(Pageable pageable, String documentNumber );

  Page<Sales> getSalesByProviderDocumentNumber(Pageable pageable, String documentNumber );

  Page<Sales> getSalesByCustomerFantasyName(Pageable pageable, String fantasyName );

  Page<Sales> getSalesByProviderFantasyName(Pageable pageable, String fantasyName );

  void save( Sales sales );

  Page<Sales> getSalesByCustomerUsingFilter( Pageable pageable, Filter filter );

  Page<Sales> getSalesByProviderUsingFilter( Pageable pageable, Filter filter );
}
