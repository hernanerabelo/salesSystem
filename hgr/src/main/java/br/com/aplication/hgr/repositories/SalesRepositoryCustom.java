package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Filter;
import br.com.aplication.hgr.models.Sales;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SalesRepositoryCustom {
  Page<Sales> getSalesUsingFilterJoinCustomer(Pageable pageable, Filter filter );

  Page<Sales> getSalesUsingFilterJoinProvider(Pageable pageable, Filter filter );
}
