package e_learn_.lms_e_learn;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class LmsELearnController {
    @GetMapping("hello")
    public String SayHello() {
        return "Hello From E_Learn";
    }
    
}
