package com.salon.module.file.service.impl;

import com.salon.common.exception.AppException;
import com.salon.common.exception.ErrorCode;
import com.salon.module.file.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageServiceImpl() {
        this.fileStorageLocation = Paths.get("uploads", "images")
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Could not create the directory where the uploaded files will be stored.", ex);
            throw new RuntimeException("Could not create upload directory!");
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) {
            originalFileName = "unknown.jpg";
        }

        // Clean filename and add UUID to prevent duplicates
        String cleanFileName = org.springframework.util.StringUtils.cleanPath(originalFileName);
        String fileName = UUID.randomUUID().toString() + "_" + cleanFileName.replace(" ", "_");

        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return URI
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/images/")
                    .path(fileName)
                    .toUriString();
        } catch (IOException ex) {
            log.error("Could not store file " + fileName + ". Please try again!", ex);
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
}
