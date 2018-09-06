package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository  extends JpaRepository<Product, Long> {

  Page<Product> findByDescriptionLikeIgnoreCase( String description, Pageable pageable );

  Page<Product> findByCodeLikeIgnoreCase( String code, Pageable pageable );

  @Query( value="SELECT PR.* " +
      "FROM HBR_PRODUCT PR, HBR_PROVIDER PROV " +
      "WHERE PR.PROVIDER_ID = PROV.ID " +
      "AND PROV.DOCUMENT_NUMBER = ?1", nativeQuery = true)
  List<Product> findByProviderDocument(String providerDocument );

}
