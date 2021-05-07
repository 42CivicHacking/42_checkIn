import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Waiting {
  @PrimaryGeneratedColumn()
  private waitingId: number;

  @JoinColumn({ name: 'userId' })
  @OneToOne(() => User, (user) => user.getWaiting())
  private user: User;

  @Column()
  private type: number;

  @Column()
  private deleteType: string;

  @Column()
  private timeOut: Date;

  @CreateDateColumn()
  private createdAt: Date;

  @UpdateDateColumn()
  private updatedAt: Date;

  @DeleteDateColumn()
  private deletedAt: Date;
  public getUser() {
    return this.user;
  }
}
