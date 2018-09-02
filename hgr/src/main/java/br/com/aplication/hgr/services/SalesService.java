package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Sales;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SalesService {

  Page<Sales> getSalesByCustomerDocumentNumber(Pageable pageable, String documentNumber );

  void save( Sales sales );
}
