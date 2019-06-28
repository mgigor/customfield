package com.example.customfield;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface MetaCustomFieldRepository extends JpaRepository<MetaCustomField, Integer> {

    @Modifying
    @Transactional
    void deleteById(String id);
}
