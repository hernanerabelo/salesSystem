package br.com.aplication.hgr.repositories.impl;

import br.com.aplication.hgr.models.Filter;
import br.com.aplication.hgr.models.Sales;
import br.com.aplication.hgr.repositories.SalesRepositoryCustom;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Repository
public class SalesRepositoryCustomImpl implements SalesRepositoryCustom {
  private static final Logger logger = LogManager.getLogger(SalesRepositoryCustomImpl.class);

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Page<Sales> getSalesUsingFilterJoinCustomer( Pageable pageable, Filter filter ) {
    StringBuilder queryBuilder = new StringBuilder("");
    queryBuilder.append( "SELECT S.* FROM HBR_SALES S, HBR_CUSTOMER C WHERE S.CUSTOMER_ID = C.ID " );

    createConditions( filter, queryBuilder );
    logger.debug("query = " + queryBuilder.toString() );
    Query query = entityManager.createNativeQuery( queryBuilder.toString(), Sales.class );
    replaceConditions(filter, query);
    query.setFirstResult(pageable.getOffset());
    query.setMaxResults(pageable.getPageSize());

    List sales = query.getResultList();
    if (pageable == null ) {
      return new PageImpl<Sales>(sales);
    }

    Page<Sales> page = new PageImpl<Sales>( sales, pageable, sales.size() );

    return page;
  }

  @Override
  public Page<Sales> getSalesUsingFilterJoinProvider( Pageable pageable, Filter filter ) {
    StringBuilder queryBuilder = new StringBuilder("");
    queryBuilder.append( "SELECT S.* FROM HBR_SALES S, HBR_PROVIDER C WHERE S.PROVIDER_ID = C.ID " );

    createConditions( filter, queryBuilder );
    logger.debug("query = " + queryBuilder.toString() );
    Query query = entityManager.createNativeQuery( queryBuilder.toString(), Sales.class );
    replaceConditions(filter, query);
    query.setFirstResult(pageable.getOffset());
    query.setMaxResults(pageable.getPageSize());

    List sales = query.getResultList();
    if (pageable == null ) {
      return new PageImpl<Sales>(sales);
    }

    Page<Sales> page = new PageImpl<Sales>( sales, pageable, sales.size() );

    return page;
  }

  private void replaceConditions( Filter filter, Query query ) {
    if( filter.getStart() != null ){
      query.setParameter( "start", filter.getStart().getTime() );
    }
    if( filter.getFinish() != null ){
      query.setParameter( "finish", filter.getFinish().getTime() );
    }
    if( !StringUtils.isEmpty( filter.getStatus() ) ){
      query.setParameter( "status", filter.getStatus() );
    }
    if(  filter.getColumn() != null ) {
      for ( String key : filter.getColumn().keySet() ) {
        query.setParameter( "column_" + key.toLowerCase(), filter.getColumn().get( key ) );
      }
    }
  }

  private void createConditions( Filter filter, StringBuilder queryBuilder ) {
    if( filter.getStart() != null ){
      queryBuilder.append( " AND (UNIX_TIMESTAMP(S.CREATED_AT)*1000) >= :start " );
    }
    if( filter.getFinish() != null ){
      queryBuilder.append( " AND (UNIX_TIMESTAMP(S.CREATED_AT)*1000) <= :finish " );
    }
    if( !StringUtils.isEmpty( filter.getStatus() ) ){
      queryBuilder.append( " AND S.STATUS = :status " );
    }
    if(  filter.getColumn() != null ) {
      for ( String key : filter.getColumn().keySet() ) {
        queryBuilder.append(" AND C.").append( key.toUpperCase() )
            .append(" like :column_").append( key.toLowerCase() );
      }
    }
  }
}
