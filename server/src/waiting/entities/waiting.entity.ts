import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Waiting {
  constructor(user: User, type: number) {
    this.user = user;
    this.type = type;
  }

  @PrimaryGeneratedColumn()
  private waitingId: number;

  @JoinColumn()
  @ManyToOne(() => User)
  private user: User;

  @RelationId((waiting: Waiting) => waiting.user)
  private userId: number;

  @Column()
  private type: number;

  @Column({ default: null })
  private deleteType: string;

  @Column({ default: null })
  private timeOut: Date;

  @CreateDateColumn()
  private createdAt: Date;

  @UpdateDateColumn()
  private updatedAt: Date;

  @Column({ default: null })
  private deletedAt: Date;

  public setDeleted(type: string) {
    this.deletedAt = new Date();
    this.deleteType = type;
  }
  public setTimeOut() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    this.timeOut = now;
  }

  public getTimeOut() {
    return this.timeOut;
  }
  public getId() {
    return this.waitingId;
  }
  public getUserId() {
    return this.userId;
  }
  public getType() {
    return this.type;
  }
}
