package com.earlyflag.dto;

public class StudentProfileDTO {
    private String id;
    private String name;
    private String className;
    private String section;

    public StudentProfileDTO() {
    }

    public StudentProfileDTO(String id, String name, String className, String section) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.section = section;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }
}
