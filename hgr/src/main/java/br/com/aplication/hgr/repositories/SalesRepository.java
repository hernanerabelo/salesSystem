package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Sales;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesRepository extends JpaRepository<Sales, Long>, SalesRepositoryCustom {


  @Query(
      value = "SELECT * FROM " +
          "HBR_SALES S, " +
          "HBR_CUSTOMER C " +
          "WHERE S.CUSTOMER_ID = C.ID " +
          "AND C.DOCUMENT_NUMBER LIKE :documentNumber " +
          "ORDER BY ?#{#pageable}",
      countQuery = "SELECT count(*) FROM " +
          "HBR_SALES S, " +
          "HBR_CUSTOMER C " +
          "WHERE S.CUSTOMER_ID = C.ID " +
          "AND C.DOCUMENT_NUMBER LIKE :documentNumber " +
          "ORDER BY ?#{#pageable}",
      nativeQuery = true)
  Page<Sales> getSalesByCustomerDocumentNumber( Pageable pageable, @Param("documentNumber") String documentNumber );

  @Query(
      value = "SELECT * FROM " +
          "HBR_SALES S, " +
          "HBR_PROVIDER C " +
          "WHERE S.PROVIDER_ID = C.ID " +
          "AND C.DOCUMENT_NUMBER LIKE :documentNumber " +
          "ORDER BY ?#{#pageable}",
      countQuery = "SELECT count(*) " +
          "FROM HBR_SALES S, " +
          "HBR_PROVIDER C " +
          "WHERE S.PROVIDER_ID = C.ID " +
          "AND C.DOCUMENT_NUMBER LIKE :documentNumber " +
          "ORDER BY ?#{#pageable}",
      nativeQuery = true)
  Page<Sales> getSalesByProviderDocumentNumber( Pageable pageable, @Param("documentNumber") String documentNumber );

  @Query(
      value = "SELECT * FROM " +
          "HBR_SALES S, " +
          "HBR_CUSTOMER C " +
          "WHERE S.CUSTOMER_ID = C.ID " +
          "AND C.FANTASY_NAME LIKE :fantasyName " +
          "ORDER BY ?#{#pageable}",
      countQuery = "SELECT count(*) " +
          "FROM HBR_SALES S, " +
          "HBR_CUSTOMER C " +
          "WHERE S.CUSTOMER_ID = C.ID " +
          "AND C.FANTASY_NAME LIKE :fantasyName " +
          "ORDER BY ?#{#pageable}",
      nativeQuery = true)
  Page<Sales> getSalesByCustomerFantasyName(Pageable pageable, @Param("fantasyName") String fantasyName );

  @Query(
      value = "SELECT * FROM " +
          "HBR_SALES S, " +
          "HBR_PROVIDER C " +
          "WHERE S.PROVIDER_ID = C.ID " +
          "AND C.FANTASY_NAME LIKE :fantasyName " +
          "ORDER BY ?#{#pageable}",
      countQuery = "SELECT count(*) " +
          "FROM HBR_SALES S, " +
          "HBR_PROVIDER C " +
          "WHERE S.PROVIDER_ID = C.ID " +
          "AND C.FANTASY_NAME LIKE :fantasyName " +
          "ORDER BY ?#{#pageable}",
      nativeQuery = true)
  Page<Sales> getSalesByProviderFantasyName(Pageable pageable, @Param("fantasyName") String documentNumber );

}
