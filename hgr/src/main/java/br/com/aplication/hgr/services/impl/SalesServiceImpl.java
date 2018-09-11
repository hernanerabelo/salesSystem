package br.com.aplication.hgr.services.impl;

import br.com.aplication.hgr.exceptions.*;
import br.com.aplication.hgr.models.*;
import br.com.aplication.hgr.repositories.SalesRepository;
import br.com.aplication.hgr.services.SalesService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;

@Service
public class SalesServiceImpl implements SalesService {

  private static final Logger logger = LogManager.getLogger(SalesServiceImpl.class);

  @Autowired
  private SalesRepository salesRepository;

  @Override
  public Page<Sales> getSalesByCustomerDocumentNumber(Pageable pageable, String documentNumber) {
    return salesRepository.findAll(pageable);
  }

  @Override
  public void save(Sales sales) {

    updateInformationDate( sales );

    validSalesAddress(sales.getAddress());

    validSalesContact( sales.getContacts() );

    validSalesCustomer( sales.getCustomer() );

    validSalesProvider( sales.getProvider() );

    validCarrierSales( sales.getType(), sales.getCarrier() );

      //todo se tiver id no endereço ou no contato subir erro
    salesRepository.save(sales);

  }

  private void validCarrierSales( String type, Carrier carrier ){
    if( !StringUtils.isEmpty( type ) && !StringUtils.isEmpty( type ) ){
      if( "FOB".equals( type ) ){
        if( carrier != null ){
          if( carrier.getId() !=null ){
            return;
          }else{
            logger.error("Transportadora sem id " + carrier.getName() );
            throw new CarrierException( "Transportadora sem id" );
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
    //todo validar provider
    if( provider != null ){

    }else{
      throw new ProviderException( "Inserir informações do fornecedor" );
    }
  }

  private void validSalesCustomer( Customer customer ){
    //todo validar o cliente
    if( customer != null ){


    }else{
      throw new CustomerException( "Inserir informações do cliente" );
    }
  }

  private void validSalesContact( List contacts ){
    if( contacts != null && contacts.size() > 0 ){
      Contact contact = (Contact) contacts.get(0);
      if( !StringUtils.isEmpty( contact.getName() ) ||
          !StringUtils.isEmpty( contact.getEmail() ) ||
          !StringUtils.isEmpty( contact.getObservation() ) ||
          !StringUtils.isEmpty( contact.getPhone() ) ){
        return;
      }else {
        throw new ContactException( "Pelo menos um valor tem que ser inserido no contato" );
      }
    }else{
      throw new ContactException( "Não foi inserido contato para a venda" );
    }
  }

  private void validSalesAddress( Address address ){
    if( address != null ){
      if( StringUtils.isEmpty( address.getStreet() ) || StringUtils.isEmpty( address.getStreet().trim() ) ){
        throw new AddressException( "Não foi inserido nome da rua para o endereço" );
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
