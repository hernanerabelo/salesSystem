package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Provider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.transaction.Transactional;

public interface ProviderService {

  Page<Provider> listAllByPage(Pageable pageable, String fantasyName  );

  Provider findById( Long id );

  Provider update( Provider provider );

  @Transactional(rollbackOn = Exception.class)
  void save( Provider provider );

  Page<Provider> getProviderByDocumentNumber( Pageable pageable, String documentNumber );

  Page<Provider> getProvidersByLegalName( Pageable pageable, String name );

  Page<Provider> getProvidersByFantasyName( Pageable pageable, String fantasyName );
}
