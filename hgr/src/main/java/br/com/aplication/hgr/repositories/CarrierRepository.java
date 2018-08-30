package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Carrier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarrierRepository extends JpaRepository<Carrier, Long> {

  Page<Carrier> findByNameLikeAllIgnoreCase(String name, Pageable pageable );
}
