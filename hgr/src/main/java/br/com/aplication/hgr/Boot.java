package br.com.aplication.hgr;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.stereotype.Controller;

@SpringBootApplication
@Controller
public class Boot
{
   private static final Logger logger = LogManager.getLogger(Boot.class);

   public static void main(String[] args)
   {
      SpringApplication.run(Boot.class, args);
      logger.debug("Test - Debugging log");
      logger.info("Test - Info log");
      logger.warn("Test - Hey, This is a warning!");
      logger.error("Test - Oops! We have an Error. OK");
      logger.fatal("Test - Damn! Fatal error. Please fix me.");
   }

   @RequestMapping("")
   public String home() {
      return "index";
   }
}
