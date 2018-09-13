package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.*;
import br.com.aplication.hgr.models.*;
import br.com.aplication.hgr.repositories.CarrierRepository;
import br.com.aplication.hgr.repositories.CustomerRepository;
import br.com.aplication.hgr.repositories.ProviderRepository;
import br.com.aplication.hgr.repositories.SalesRepository;
import br.com.aplication.hgr.services.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class SalesServiceImpl implements SalesService {

  private static final Logger logger = LogManager.getLogger(SalesServiceImpl.class);

  @Autowired
  private ProductService productService;

  @Autowired
  private SalesRepository salesRepository;

  @Autowired
  private ProviderRepository providerRepository;

  @Autowired
  private CustomerRepository customerRepository;

  @Autowired
  private CarrierRepository carrierRepository;

  @Override
  @Transactional( readOnly = true )
  public Page<Sales> getSalesByCustomerDocumentNumber(Pageable pageable, String documentNumber) {
    return salesRepository.getSalesByCustomerDocumentNumber( pageable, documentNumber );
  }

  @Override
  @Transactional( readOnly = true )
  public Page<Sales> getSalesByProviderDocumentNumber(Pageable pageable, String documentNumber) {
    return salesRepository.getSalesByProviderDocumentNumber( pageable, documentNumber );
  }

  @Override
  @Transactional( readOnly = true )
  public Page<Sales> getSalesByCustomerFantasyName(Pageable pageable, String fantasyName) {
    return salesRepository.getSalesByCustomerFantasyName( pageable, fantasyName );
  }

  @Override
  @Transactional( readOnly = true )
  public Page<Sales> getSalesByProviderFantasyName(Pageable pageable, String fantasyName) {
    return salesRepository.getSalesByProviderFantasyName( pageable, fantasyName );
  }

  @Override
  @Transactional( rollbackFor = Exception.class )
  public void save(Sales sales) {

    updateInformationDate( sales );
    sales.setStatus( Sales.WATING_FOR_APPROVAL );

    validSalesCustomer( sales.getCustomer() );

    validSalesAddress( sales );

    validSalesContact( sales );

    validCarrierSales( sales.getType(), sales.getCarrier() );

    validSalesProvider( sales.getProvider() );

    validProductSales( sales );

    calculateTotalPriceOfSales( sales );

    salesRepository.save(sales);

  }

  private void calculateTotalPriceOfSales( Sales sales ){
    BigDecimal total = new BigDecimal(0);
    for (ProductSales productSale : sales.getProductSales()) {
      total = total.add( productSale.getTotal() );
    }
    if( total.compareTo( new BigDecimal(0) ) >= 0 ){
      sales.setTotalPrice( total );
    }else{
      throw new RuntimeException( "Venda com o preço final não pode ser menor do que 0" );
    }
  }

  private void validProductSales( Sales sales ){
    List<ProductSales> productSales = sales.getProductSales();
    if( productSales != null && productSales.size() > 0 ){
      for ( ProductSales productSale : productSales ) {
        productSale.setSales( sales );
        Product product = productService.findById( productSale.getProductId() );
        if( product != null ){
          productSale.setProduct( product );

          calculateProductSalesValue(productSale);
        }else{
          throw new RuntimeException( "Não foi encontrado produto com o id " + productSale.getProductId() );
        }
      }
    }else{
      throw new SalesException( "Não foi selecionado nenhum produto para ser vendido" );
    }
  }

  private void calculateProductSalesValue(ProductSales productSale) {
    if( productSale.getCount() > 0 ){
      BigDecimal total =  productSale.getProduct().getValue().multiply( new BigDecimal( productSale.getCount() ) );

      if( productSale.getDiscount().compareTo( new BigDecimal(0 ) ) >= 0 ){
        total = total.subtract( productSale.getDiscount() );

        if( total.compareTo( new BigDecimal(0 ) ) >= 0 ){
          productSale.setTotal( total );
        }else {
          throw new SalesException( "Valor total do produto " + productSale.getProduct().getDescription() + " menor que 0" );
        }
      }else {
        throw new SalesException( "Quantidade do desconto do produto " + productSale.getProduct().getDescription() +
            " precisa ser maior ou igual a 0" );
      }
    }else {
      throw new SalesException( "Quantidade do produto " + productSale.getProduct().getDescription() +
          " precisa ser maior que 0" );
    }
  }

  private void validCarrierSales( String type, Carrier carrier ){
    if( !StringUtils.isEmpty( type ) && !StringUtils.isEmpty( type ) ){
      if( "FOB".equals( type ) ){
        if( carrier != null ){
          if( carrier.getId() != null ){
            if( carrierRepository.findOne( carrier.getId() ) == null ){
              throw new RuntimeException( "Não foi encontrado nenhuma transportadora no banco para a " +
                  "transportadora selecionada" );
            }
          }else{
            throw new CarrierException( "Transportadora sem id " + carrier.getName());
          }
        }else{
          throw new CarrierException( "Venda com transporte do tipo FOB exige uma transportadora" );
        }
      }else if( !"CIF".equals( type ) ){
        throw new CarrierException( "Tipo do transporte precisa ser FOB ou CIF" );
      }
    }else{
      throw new CarrierException( "Não foi inserido o tipo de transporte, FOB, CIF" );
    }
  }

  private void validSalesProvider(Provider provider ){
    if( provider != null ){
      if( provider.getId() != null ){
        if( providerRepository.findOne( provider.getId() ) == null ){
          throw new RuntimeException( "Não foi encontrado nenhum fornecedor no banco de dados para o cliente informado" );
        }
      }else {
        throw new ProviderException( "Fornecedor sem id" );
      }
    }else{
      throw new ProviderException( "Inserir informações do fornecedor" );
    }
  }

  private void validSalesCustomer( Customer customer ){
    if( customer != null ){
      if( customer.getId() != null ){
        if( customerRepository.findOne( customer.getId() ) == null ){
          throw new RuntimeException( "Não foi encontrado nenhum cliente no banco de dados para o cliente informado" );
        }
      }else{
        throw new CustomerException( "Cliente sem id" );
      }
    }else{
      throw new CustomerException( "Inserir informações do cliente" );
    }
  }

  private void validSalesContact( Sales sales ){
    List contacts = sales.getContacts();
    if( contacts != null && contacts.size() > 0 ){
      Contact contact = (Contact) contacts.get(0);
      if( contact.getId() == null ){
        if( !StringUtils.isEmpty( contact.getName() ) ||
            !StringUtils.isEmpty( contact.getEmail() ) ||
            !StringUtils.isEmpty( contact.getObservation() ) ||
            !StringUtils.isEmpty( contact.getPhone() ) ){
          contact.setSales( sales );
        }else {
          throw new ContactException( "Pelo menos um valor tem que ser inserido no contato" );
        }
      }else {
        throw new RuntimeException( "Contato não pode ter ID" );
      }
    }else{
      throw new ContactException( "Não foi inserido contato para a venda" );
    }
  }

  private void validSalesAddress( Sales sales ){
    Address address = sales.getAddress();
    if( address != null ){
      if( address.getId() == null ){
        if( StringUtils.isEmpty( address.getStreet() ) || StringUtils.isEmpty( address.getStreet().trim() ) ){
          throw new AddressException( "Não foi inserido nome da rua para o endereço" );
        }else {
          address.setSales( sales );
        }
      }else {
        throw new RuntimeException( "O endereço não pode possui ID" );
      }
    }else{
      throw new AddressException( "Não foi informado endereço para a venda" );
    }
  }

  private void updateInformationDate( Sales sales ){
    if( sales.getCreatedAt() == null ){
      sales.setCreatedBy("criar autenticacao");
      sales.setCreatedAt(new Date());
    }else {
      sales.setUpdatedBy("criar autenticacao");
      sales.setUpdatedAt(new Date());
    }
  }
}
