package br.com.aplication.hgr.services;

import br.com.aplication.hgr.models.Address;

public interface AddressService {

  void save( Address address );

  Address findByParentIdAndParentType( Long parentId, String parentType );

  void update( Address address );
}
