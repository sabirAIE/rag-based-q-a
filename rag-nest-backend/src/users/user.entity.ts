import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false})
  email: string;

  @Column({nullable: false})
  username: string;

  @Column({ nullable: false })
  passwordhash: string;

  @Column({ default: 'viewer' }) // 'admin' | 'editor' | 'viewer'
  role: string;

  @CreateDateColumn()
  created_at: Date;
}
