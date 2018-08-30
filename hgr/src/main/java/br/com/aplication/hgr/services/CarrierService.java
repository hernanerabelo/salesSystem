package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Carrier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CarrierService {

  Page<Carrier> listAllByPage(Pageable pageable  );

  Carrier findById( Long id );

  Carrier update( Carrier carrier );

  void save( Carrier carrier );

  Page<Carrier> getByName( Pageable pageable, String name );
}
