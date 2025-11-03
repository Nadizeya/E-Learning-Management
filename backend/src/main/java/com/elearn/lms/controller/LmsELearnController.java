package com.elearn.lms.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class LmsELearnController {
    @GetMapping("hello")
    public String SayHello() {
        return "Helloooooooo";
    }

    @GetMapping("hi")
    public String SayHi() {
        return "Hello From Asher";
    }
}
