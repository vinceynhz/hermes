package app.ve.hermes.model;

import lombok.*;

/**
 * @author vic on 2023-09-23
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
  private String channel;
  private String data;
}
