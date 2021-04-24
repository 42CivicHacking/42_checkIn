import { Card } from 'src/card/entities/card.entity';
import { Log } from 'src/log/entities/log.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  constructor(id: number, name: string) {
    this.userId = id;
    this.userName = name;
  }
  @PrimaryColumn()
  private userId: number;

  @Column()
  private userName: string;

  @JoinColumn({ name: 'cardId' })
  @OneToOne(() => Card)
  private card: Card;

  public getId() {
    return this.userId;
  }
  public getName() {
    return this.userName;
  }
  public getCard() {
    return this.card;
  }
  public cardSet(card: Card) {
    this.card = card;
  }
}
