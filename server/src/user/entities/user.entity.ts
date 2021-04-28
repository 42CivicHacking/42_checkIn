import { Card } from 'src/card/entities/card.entity';
import { Log } from 'src/log/entities/log.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
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

  @RelationId((user: User) => user.card)
  private cardId: number;

  @Column({ default: false })
  private isAdmin: boolean;

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
  public getIsAdmin() {
    return this.isAdmin;
  }
}
