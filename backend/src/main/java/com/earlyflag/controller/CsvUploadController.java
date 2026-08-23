package com.earlyflag.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.earlyflag.dto.UploadResultDTO;
import com.earlyflag.service.CsvUploadService;

@RestController
@RequestMapping("/api/upload")
public class CsvUploadController {

    private final CsvUploadService csvUploadService;

    public CsvUploadController(CsvUploadService csvUploadService) {
        this.csvUploadService = csvUploadService;
    }

    @PostMapping(value = "/attendance", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResultDTO> uploadAttendance(@RequestParam("file") MultipartFile file) {
        int inserted = csvUploadService.uploadAttendanceCsv(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadResultDTO(inserted));
    }

    @PostMapping(value = "/marks", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResultDTO> uploadMarks(@RequestParam("file") MultipartFile file) {
        int inserted = csvUploadService.uploadMarksCsv(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadResultDTO(inserted));
    }

    @PostMapping(value = "/fees", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResultDTO> uploadFees(@RequestParam("file") MultipartFile file) {
        int inserted = csvUploadService.uploadFeesCsv(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadResultDTO(inserted));
    }

    @PostMapping(value = "/engagement", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResultDTO> uploadEngagement(@RequestParam("file") MultipartFile file) {
        int inserted = csvUploadService.uploadEngagementCsv(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadResultDTO(inserted));
    }
}