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

  @Column({ unique: true, nullable: true})
  email: string;

  @Column({nullable: true})
  username: string;

  @Column({ nullable: true })
  passwordhash: string;

  @Column({ default: 'viewer' }) // 'admin' | 'editor' | 'viewer'
  role: string;

  @CreateDateColumn()
  createdat: Date;
}
