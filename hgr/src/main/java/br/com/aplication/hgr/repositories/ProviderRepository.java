package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Provider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

  Provider findByDocumentNumber(String documentNumber );

  Page<Provider> findByDocumentNumber(String documentNumber, Pageable pageable );

  Page<Provider> findByLegalNameLikeAllIgnoreCase( String legalName, Pageable pageable );

  Page<Provider> findByFantasyNameLikeAllIgnoreCase( String fantasyName,  Pageable pageable );
}
