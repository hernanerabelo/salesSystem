package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.models.Sales;
import br.com.aplication.hgr.repositories.SalesRepository;
import br.com.aplication.hgr.services.SalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SalesServiceImpl implements SalesService {

  @Autowired
  private SalesRepository salesRepository;

  @Override
  public Page<Sales> getSalesByCustomerDocumentNumber(Pageable pageable, String documentNumber) {
    return salesRepository.findAll(pageable);
  }

  @Override
  public void save(Sales sales) {
    //todo se tiver id no endereço ou no contato subir erro
    salesRepository.save(sales);
  }
}
