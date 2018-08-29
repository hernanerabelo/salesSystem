package br.com.aplication.hgr.repositories;

import br.com.aplication.hgr.models.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@SuppressWarnings("unused")
public interface MeasurementRepository extends JpaRepository<Measurement, Long> {

  Measurement findByTypeIgnoreCase( String type );
}
