package com.earlyflag.controller;

import com.earlyflag.dto.CsvUploadResponseDTO;
import com.earlyflag.service.CsvUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class CsvUploadController {

    private final CsvUploadService csvUploadService;

    public CsvUploadController(CsvUploadService csvUploadService) {
        this.csvUploadService = csvUploadService;
    }

    @PostMapping(value = "/attendance", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CsvUploadResponseDTO> uploadAttendanceCsv(@RequestParam("file") MultipartFile file) {
        CsvUploadResponseDTO response = csvUploadService.uploadAttendanceCsv(file);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping(value = "/marks", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CsvUploadResponseDTO> uploadMarksCsv(@RequestParam("file") MultipartFile file) {
        CsvUploadResponseDTO response = csvUploadService.uploadMarksCsv(file);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping(value = "/fees", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CsvUploadResponseDTO> uploadFeesCsv(@RequestParam("file") MultipartFile file) {
        CsvUploadResponseDTO response = csvUploadService.uploadFeesCsv(file);
        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
