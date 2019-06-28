package com.example.customfield;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Entity
@Data
@SuppressWarnings("serial")
@IdClass(MetaCustomField.IdClass.class)
public class MetaCustomField { // MetaField

    @Id
    private String id;

    @Id
    @Enumerated(EnumType.STRING)
    private EntityType entity;

    @NotNull
    private Integer cols;

    @NotNull
    private Integer rows;

    @NotNull
    private Integer x;

    @NotNull
    private Integer y;

    @Enumerated(EnumType.STRING)
    @NotNull
    private FieldType type;

    private String options;

    private String label;

    @Data
    static class IdClass implements Serializable {
        private String id;
        private EntityType entity;
    }

}
