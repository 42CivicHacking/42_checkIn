import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  constructor(type: number) {
    this.type = type;
  }
  @PrimaryGeneratedColumn()
  private cardId: number;

  @Column({ default: false })
  private using: boolean;

  @Column()
  private type: number;

  public getStatus() {
    return this.using;
  }
  public getId() {
    return this.cardId;
  }

  public useCard() {
    this.using = true;
  }
  public returnCard() {
    this.using = false;
  }
}
