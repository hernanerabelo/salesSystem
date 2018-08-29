package br.com.aplication.hgr.services;


import br.com.aplication.hgr.models.Measurement;

import java.util.List;

public interface MeasurementService {

  void save(Measurement measurement);

  List findAll();

  Measurement findById(Long id);
}
