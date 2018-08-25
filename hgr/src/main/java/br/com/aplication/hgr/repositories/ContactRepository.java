package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

  @Query(value = "SELECT * FROM HBR_ADDRESS WHERE PARENT_ID = ?1 AND PARENT_TYPE = ?2", nativeQuery = true)
  List<Contact> findByParentIdAndParentType(Long parentId, String parentType );

  @Query(value = "SELECT count(1) FROM HBR_ADDRESS WHERE PARENT_ID = ?1 AND PARENT_TYPE = ?2 AND ID = ?3", nativeQuery = true)
  long exists( Long parentId, String parentType, Long id );
}
