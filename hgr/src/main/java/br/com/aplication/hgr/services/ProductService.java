package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

  Page<Product> listAllByPage(Pageable pageable  );

  Product findById( Long id );

  Product update( Product product );

  void save( Product product );

  Page<Product> getByDescription( Pageable pageable, String description );

  Page<Product> getByCode( Pageable pageable, String code );

  List<Product> getByProviderDocument( String providerDocument );
}
