package com.quizapp.backend.controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "*", maxAge = 3600)
public class LiveQuizController {
    
    // Simple message wrapper for WebSocket payloads
    public static class ChatMessage {
        private String type; // e.g. "JOIN", "START", "QUESTION", "ANSWER", "LEADERBOARD"
        private String sender;
        private Object content;
        
        public ChatMessage() {}
        public ChatMessage(String type, String sender, Object content) {
            this.type = type;
            this.sender = sender;
            this.content = content;
        }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }
        public Object getContent() { return content; }
        public void setContent(Object content) { this.content = content; }
    }

    // A simple endpoint where a client can send a message to the lobby
    @MessageMapping("/quiz/{roomId}/sendMessage")
    @SendTo("/topic/quiz/{roomId}")
    public ChatMessage broadcastMessage(@DestinationVariable String roomId, @Payload ChatMessage chatMessage) {
        // Here we just broadcast the message exactly as it was received.
        // In a real scenario, the backend would validate state, e.g checking if the host sent it,
        // or calculating scores if it's an ANSWER type.
        return chatMessage;
    }
}
