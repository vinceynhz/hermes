package app.ve.hermes.io;

import app.ve.hermes.model.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;

/**
 * @author vic on 2023-09-23
 */
@org.springframework.stereotype.Controller
@Slf4j
public class Controller {
  private final SimpMessagingTemplate messagingTemplate;

  @Autowired
  public Controller(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  @MessageMapping("/pub")
  public void sendMessage(Message message) {
    log.debug("Message received! " + message.getChannel() + " " + message.getData());
    this.messagingTemplate.convertAndSend("/topic/sub/" + message.getChannel(), message);
  }
}
