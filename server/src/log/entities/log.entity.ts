import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Card } from '../../card/entities/card.entity';

@Entity()
export class Log {
  constructor(user: User, card: Card, type: string) {
    this.user = user;
    this.card = card;
    this.type = type;
  }

  @PrimaryGeneratedColumn()
  private logId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  private user: User;

  @ManyToOne(() => Card)
  @JoinColumn()
  private card: Card;

  @Column()
  private type: string;

  @CreateDateColumn()
  private createdAt: Date;

  @UpdateDateColumn()
  private updatedAt: Date;
}
