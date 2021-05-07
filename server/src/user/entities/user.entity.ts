import { Card } from 'src/card/entities/card.entity';
import { Log } from 'src/log/entities/log.entity';
import { Waiting } from 'src/waiting/entities/waiting.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  constructor(id: number, name: string) {
    this.userId = id;
    this.userName = name;
  }

  @PrimaryGeneratedColumn()
  private _id: number;

  @Column()
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

  @CreateDateColumn()
  private createdAt: Date;

  @UpdateDateColumn()
  private updatedAt: Date;

  @DeleteDateColumn()
  private deletedAt: Date;

  @OneToOne(() => Waiting, (waiting) => waiting.getUser())
  private waiting: Waiting;

  public getId() {
    return this._id;
  }
  public getUserId() {
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
  public getWaiting() {
    return this.waiting;
  }
}
