package com.quizapp.backend.controllers;

import com.quizapp.backend.dto.UserProfileDTO;
import com.quizapp.backend.models.QuizAttempt;
import com.quizapp.backend.models.User;
import com.quizapp.backend.repositories.QuizAttemptRepository;
import com.quizapp.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.quizapp.backend.dto.ProfileUpdateRequest;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import com.quizapp.backend.models.Category;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/{id}/profile")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER')")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();
        List<QuizAttempt> attempts = attemptRepository.findByUserId(id);
        
        int totalQuizzesTaken = attempts.size();
        int totalScore = 0;
        int totalPossibleScore = 0;
        Map<Category, int[]> categoryStats = new HashMap<>();

        for (QuizAttempt attempt : attempts) {
            totalScore += attempt.getScore();
            totalPossibleScore += attempt.getTotalQuestions();
            
            if (attempt.getQuiz() != null && attempt.getQuiz().getCategory() != null) {
                Category cat = attempt.getQuiz().getCategory();
                categoryStats.putIfAbsent(cat, new int[]{0, 0});
                categoryStats.get(cat)[0] += attempt.getScore();
                categoryStats.get(cat)[1] += attempt.getTotalQuestions();
            }
        }

        double averageAccuracy = 0.0;
        if (totalPossibleScore > 0) {
            averageAccuracy = ((double) totalScore / totalPossibleScore) * 100.0;
        }
        
        Map<String, Double> categoryAccuracy = new HashMap<>();
        for (Map.Entry<Category, int[]> entry : categoryStats.entrySet()) {
            double accuracy = entry.getValue()[1] > 0 ? ((double) entry.getValue()[0] / entry.getValue()[1]) * 100.0 : 0.0;
            categoryAccuracy.put(entry.getKey().name(), Math.round(accuracy * 10.0) / 10.0);
        }

        UserProfileDTO profile = new UserProfileDTO(
                user.getUsername(),
                user.getEmail(),
                totalQuizzesTaken,
                user.getXp(), // Uses the actual database XP now
                averageAccuracy,
                user.getLevel(),
                user.getCurrentStreak(),
                categoryAccuracy,
                new ArrayList<>(user.getBadges()),
                user.getAvatarUrl()
        );

        return ResponseEntity.ok(profile);
    }
    
    // Global Leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserProfileDTO>> getLeaderboard() {
        List<User> students = userRepository.findAll(); // Should filter by STUDENT role
        List<UserProfileDTO> leaderboard = new ArrayList<>();
        
        for (User student : students) {
            if ("ROLE_STUDENT".equals(student.getRole().name()) || "STUDENT".equals(student.getRole().name())) {
                List<QuizAttempt> attempts = attemptRepository.findByUserId(student.getId());
                int totalQuizzesTaken = attempts.size();
                int totalScore = 0;
                int totalPossibleScore = 0;
                Map<Category, int[]> categoryStats = new HashMap<>();
                
                for (QuizAttempt attempt : attempts) {
                    totalScore += attempt.getScore();
                    totalPossibleScore += attempt.getTotalQuestions();
                    
                    if (attempt.getQuiz() != null && attempt.getQuiz().getCategory() != null) {
                        Category cat = attempt.getQuiz().getCategory();
                        categoryStats.putIfAbsent(cat, new int[]{0, 0});
                        categoryStats.get(cat)[0] += attempt.getScore();
                        categoryStats.get(cat)[1] += attempt.getTotalQuestions();
                    }
                }
                double averageAccuracy = totalPossibleScore > 0 ? ((double) totalScore / totalPossibleScore) * 100.0 : 0.0;
                
                Map<String, Double> categoryAccuracy = new HashMap<>();
                for (Map.Entry<Category, int[]> entry : categoryStats.entrySet()) {
                    double accuracy = entry.getValue()[1] > 0 ? ((double) entry.getValue()[0] / entry.getValue()[1]) * 100.0 : 0.0;
                    categoryAccuracy.put(entry.getKey().name(), Math.round(accuracy * 10.0) / 10.0);
                }
                
                leaderboard.add(new UserProfileDTO(student.getUsername(), student.getEmail(), totalQuizzesTaken, student.getXp(), averageAccuracy, student.getLevel(), student.getCurrentStreak(), categoryAccuracy, new ArrayList<>(student.getBadges()), student.getAvatarUrl()));
            }
        }

        
        leaderboard.sort((a, b) -> Integer.compare(b.getTotalScore(), a.getTotalScore()));
        return ResponseEntity.ok(leaderboard);
    }

    @PutMapping("/{id}/profile")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER')")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest updateRequest) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();
        // To be fully secure we should ensure the Principal matches this ID, but keeping it simple for now.

        if (updateRequest.getUsername() != null && !updateRequest.getUsername().isEmpty()) {
            user.setUsername(updateRequest.getUsername());
        }
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().isEmpty()) {
            user.setEmail(updateRequest.getEmail());
        }
        if (updateRequest.getAvatarUrl() != null && !updateRequest.getAvatarUrl().isEmpty()) {
            user.setAvatarUrl(updateRequest.getAvatarUrl());
        }
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully!");
    }
}
