package com.example.customfield;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/funcionario")
@CrossOrigin
public class FuncionarioController {

    @Autowired
    private FuncionarioRepository repo;

    @Autowired
    private MetaCustomFieldRepository meta;

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name = "id") String id) {
        repo.deleteById(UUID.fromString(id));
    }

    @GetMapping("/fields")
    public ResponseEntity<List<String>> findFields() {
        List<String> fields = new ArrayList<>();
        fields.add("id");
        fields.add("name");
        fields.add("age");
        fields.addAll(meta.findAll().stream().map(m -> m.getLabel()).distinct().collect(Collectors.toList()));
        return ResponseEntity.ok(fields);
    }

    @GetMapping("/flat")
    public ResponseEntity<List<Map<String, String>>> findAllFlat() {
        List<Map<String, String>> func = new ArrayList<>();
        repo.findAll().forEach(f -> {
            Map<String, String> map = new HashMap<>();
            map.put("name", f.getName());
            map.put("age", String.valueOf(f.getAge()));
            map.put("id", f.getId().toString());
            f.getCustomFields().stream().forEach(c -> map.put(c.getMeta().getLabel(), c.getValue()));
            func.add(map);
        });
        return ResponseEntity.ok(func);
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> findAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    public ResponseEntity<Funcionario> create(@RequestBody Funcionario funcionario) {
        return ResponseEntity.ok(repo.save(funcionario));
    }

}
