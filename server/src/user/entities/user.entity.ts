import { Card } from 'src/card/entities/card.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

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
  @JoinColumn()
  @OneToOne(() => Card)
  private card: Card;

  @Column()
  private code: string;

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
