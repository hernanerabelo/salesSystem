package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository  extends JpaRepository<Product, Long> {

  Page<Product> findByDescriptionLikeIgnoreCase( String type, Pageable pageable );

  Page<Product> findByCodeLikeIgnoreCase( String type, Pageable pageable );

  Page<Product> findByProviderDocument( String type, Pageable pageable );

}
