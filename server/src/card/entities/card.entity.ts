import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  private createdAt: Date;

  @UpdateDateColumn()
  private updatedAt: Date;

  @DeleteDateColumn()
  private deletedAt: Date;

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
