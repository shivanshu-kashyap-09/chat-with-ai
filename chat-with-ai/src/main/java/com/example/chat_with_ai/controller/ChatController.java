package com.example.chat_with_ai.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chat")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController{

    private final ChatClient chatClient;

    @Autowired
    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }
    

    @GetMapping("/ai")
    public ResponseEntity<?> generate(@RequestParam String message) {
        try {
            String response = chatClient.prompt().user(message).call().content();
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
           log.error("Error occured in response : ",e);
        }
        
        return null;
    }
}