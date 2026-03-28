package com.quizapp.backend.controllers;

import com.quizapp.backend.models.Question;
import com.quizapp.backend.models.Quiz;
import com.quizapp.backend.models.QuizAttempt;
import com.quizapp.backend.models.User;
import com.quizapp.backend.repositories.AttemptAnswerRepository;
import com.quizapp.backend.repositories.QuestionRepository;
import com.quizapp.backend.repositories.QuizAttemptRepository;
import com.quizapp.backend.repositories.QuizRepository;
import com.quizapp.backend.repositories.UserRepository;
import com.quizapp.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import com.quizapp.backend.dto.TeacherAnalyticsDTO;
import com.quizapp.backend.dto.StudentProgressDTO;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import com.quizapp.backend.models.Category;

import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private AttemptAnswerRepository attemptAnswerRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow();
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<Quiz>> getTeacherQuizzes() {
        User teacher = getCurrentUser();
        return ResponseEntity.ok(quizRepository.findByTeacherId(teacher.getId()));
    }

    @PostMapping("/quiz")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        User teacher = getCurrentUser();
        quiz.setTeacher(teacher);
        
        if (quiz.getQuestions() != null) {
            for (Question q : quiz.getQuestions()) {
                q.setQuiz(quiz);
                if (q.getOptions() != null) {
                    q.getOptions().forEach(o -> o.setQuestion(q));
                }
            }
        }
        
        Quiz savedQuiz = quizRepository.save(quiz);
        return ResponseEntity.ok(savedQuiz);
    }
    
    @DeleteMapping("/quiz/{id}")
    @Transactional
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        User teacher = getCurrentUser();
        Quiz quiz = quizRepository.findById(id).orElse(null);
        
        if (quiz == null || !quiz.getTeacher().getId().equals(teacher.getId())) {
            return ResponseEntity.badRequest().body("Quiz not found or unauthorized");
        }
        
        List<QuizAttempt> attempts = quizAttemptRepository.findByQuizId(id);
        for(QuizAttempt attempt : attempts) {
            attemptAnswerRepository.deleteAll(attemptAnswerRepository.findByAttemptId(attempt.getId()));
        }
        quizAttemptRepository.deleteAll(attempts);
        
        quizRepository.delete(quiz);
        return ResponseEntity.ok().body("Quiz deleted successfully");
    }

    @GetMapping("/analytics")
    public ResponseEntity<TeacherAnalyticsDTO> getAnalytics() {
        User teacher = getCurrentUser();
        List<Quiz> quizzes = quizRepository.findByTeacherId(teacher.getId());
        
        int totalQuizzes = quizzes.size();
        int activeStudents = 0;
        double averageScore = 0;
        
        Map<Category, Double> categoryAccuracy = new HashMap<>();
        
        if (totalQuizzes > 0) {
            List<Long> quizIds = quizzes.stream().map(Quiz::getId).collect(Collectors.toList());
            List<QuizAttempt> allAttempts = new ArrayList<>();
            for (Long qId : quizIds) {
                allAttempts.addAll(quizAttemptRepository.findByQuizId(qId));
            }
            
            activeStudents = (int) allAttempts.stream()
                .map(a -> a.getUser().getId())
                .distinct()
                .count();
                
            if (!allAttempts.isEmpty()) {
                averageScore = allAttempts.stream()
                    .mapToInt(QuizAttempt::getScore)
                    .average()
                    .orElse(0.0);
            }
            
            Map<Category, int[]> categoryStats = new HashMap<>();
            for (QuizAttempt attempt : allAttempts) {
                if (attempt.getQuiz() != null && attempt.getQuiz().getCategory() != null) {
                    Category cat = attempt.getQuiz().getCategory();
                    categoryStats.putIfAbsent(cat, new int[]{0, 0});
                    categoryStats.get(cat)[0] += attempt.getScore();
                    categoryStats.get(cat)[1] += attempt.getTotalQuestions();
                }
            }
            for (Map.Entry<Category, int[]> entry : categoryStats.entrySet()) {
                double accuracy = entry.getValue()[1] > 0 ? ((double) entry.getValue()[0] / entry.getValue()[1]) * 100.0 : 0.0;
                categoryAccuracy.put(entry.getKey(), Math.round(accuracy * 10.0) / 10.0);
            }
        }
        
        return ResponseEntity.ok(new TeacherAnalyticsDTO(totalQuizzes, activeStudents, Math.round(averageScore * 10.0) / 10.0, categoryAccuracy));
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentProgressDTO>> getStudentsProgress() {
        User teacher = getCurrentUser();
        List<Quiz> quizzes = quizRepository.findByTeacherId(teacher.getId());
        
        Map<Long, StudentProgressDTO> studentMap = new HashMap<>();
        
        for (Quiz quiz : quizzes) {
            List<QuizAttempt> attempts = quizAttemptRepository.findByQuizId(quiz.getId());
            for (QuizAttempt attempt : attempts) {
                Long studentId = attempt.getUser().getId();
                String studentName = attempt.getUser().getUsername();
                
                StudentProgressDTO dto = studentMap.getOrDefault(studentId, 
                    new StudentProgressDTO(studentId, studentName, 0, 0));
                    
                dto.setQuizzesTaken(dto.getQuizzesTaken() + 1);
                dto.setTotalScore(dto.getTotalScore() + attempt.getScore());
                
                studentMap.put(studentId, dto);
            }
        }
        
        return ResponseEntity.ok(new ArrayList<>(studentMap.values()));
    }
}
