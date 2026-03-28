package com.quizapp.backend.dto;

public class StudentProgressDTO {
    private Long studentId;
    private String studentName;
    private int quizzesTaken;
    private int totalScore;

    public StudentProgressDTO() {}

    public StudentProgressDTO(Long studentId, String studentName, int quizzesTaken, int totalScore) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.quizzesTaken = quizzesTaken;
        this.totalScore = totalScore;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public int getQuizzesTaken() { return quizzesTaken; }
    public void setQuizzesTaken(int quizzesTaken) { this.quizzesTaken = quizzesTaken; }

    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
}
