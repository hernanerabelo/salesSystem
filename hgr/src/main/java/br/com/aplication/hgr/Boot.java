package br.com.aplication.hgr;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.stereotype.Controller;

@SpringBootApplication
@Controller
public class Boot
{
   private static final Logger logger = LogManager.getLogger(Boot.class);

   public static void main(String[] args)
   {
      SpringApplication.run(Boot.class, args);
      logger.info("Log4j running");
   }

   @RequestMapping("")
   public String home() {
      return "index";
   }
}
