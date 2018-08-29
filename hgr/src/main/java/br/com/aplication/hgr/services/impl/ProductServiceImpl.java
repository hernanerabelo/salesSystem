package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.ProductException;
import br.com.aplication.hgr.models.Product;
import br.com.aplication.hgr.repositories.ProductRepository;
import br.com.aplication.hgr.services.MeasurementService;
import br.com.aplication.hgr.services.ProductService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import org.springframework.transaction.annotation.Transactional;
import java.util.Date;

@Service
@SuppressWarnings("unused")
public class ProductServiceImpl implements ProductService {

  private static final Logger logger = LogManager.getLogger(ProductServiceImpl.class);

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private MeasurementService measurementService;

  @Override
  public Page<Product> listAllByPage(Pageable pageable  ){
    return productRepository.findAll( pageable );
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Product findById( Long id ){
    logger.info("Buscando produto com id " + id );
    Product product = productRepository.findOne( id );
    if( product != null ){
      return product;
    }else{
      logger.warn("Product not found for id " + id );
    }
    return null;
  }


  @Override
  @Transactional(rollbackFor = Exception.class)
  public Product update( Product product ){
    if( productRepository.exists( product.getId() ) ){
      updateInformationDate( product );

      if( product.getMeasurement() != null ){
        measurementService.save( product.getMeasurement() );
      }

      productRepository.save( product );
      return product;
    }else{
      throw new ProductException( "Produto não encontrado" );
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void save( Product product ){

    if( product.getId() == null ){
      updateInformationDate( product );

      if( product.getMeasurement() != null ){
        measurementService.save( product.getMeasurement() );
      }
      productRepository.save( product );
      logger.info("Criado product " + product );

    }else{
      throw new ProductException( "Produto não pode ter id para ser salvo." );
    }
  }


  @Override
  @Transactional(rollbackFor = Exception.class)
  public Page<Product> getByDescription( Pageable pageable ,String description ) {
    if( !StringUtils.isEmpty( description ) && !StringUtils.isEmpty( description.trim() ) ){
      return productRepository.findByDescriptionLikeIgnoreCase( description, pageable );
    }else {
      throw new ProductException("Code com valor vazio");
    }
  }

  @Override
  public Page<Product> getByCode( Pageable pageable, String code ) {
    if( !StringUtils.isEmpty( code ) && !StringUtils.isEmpty( code.trim() ) ){
      return productRepository.findByCodeLikeIgnoreCase( code, pageable );
    }else {
      throw new ProductException("Code com valor vazio");
    }
  }

  private void updateInformationDate(Product product ){
    if( product.getCreatedAt() == null ){
      product.setCreatedBy("criar autenticacao");
      product.setCreatedAt(new Date());
    }else {
      product.setUpdatedBy("criar autenticacao");
      product.setUpdatedAt(new Date());
    }
  }
}
