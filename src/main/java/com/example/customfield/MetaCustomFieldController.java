package com.example.customfield;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/meta")
public class MetaCustomFieldController {

    @Autowired
    private MetaCustomFieldRepository repo;

    @GetMapping
    public ResponseEntity<List<MetaCustomField>> findAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    public ResponseEntity<MetaCustomField> create(@RequestBody MetaCustomField meta) {
        return ResponseEntity.ok(repo.save(meta));
    }

}
