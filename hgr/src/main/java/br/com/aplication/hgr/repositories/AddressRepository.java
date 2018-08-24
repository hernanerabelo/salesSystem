package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository  extends JpaRepository<Address, Long> {

  @Query(value = "SELECT * FROM HBR_ADDRESS WHERE PARENT_ID = ?1 AND PARENT_TYPE = ?2", nativeQuery = true)
  Address findByParentIdAndParentType( Long parentId, String parentType );

  @Query(value = "SELECT count(1) FROM HBR_ADDRESS WHERE PARENT_ID = ?1 AND PARENT_TYPE = ?2", nativeQuery = true)
  long exists( Long parentId, String parentType );
}
