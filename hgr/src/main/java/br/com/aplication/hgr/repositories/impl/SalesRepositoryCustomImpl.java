package br.com.aplication.hgr.repositories.impl;

import br.com.aplication.hgr.models.Filter;
import br.com.aplication.hgr.models.Sales;
import br.com.aplication.hgr.repositories.SalesRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public class SalesRepositoryCustomImpl implements SalesRepositoryCustom {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Page<Sales> getSalesUsingFilter(Pageable pageable, Filter filter) {
    return null;
  }
}
