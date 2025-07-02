import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  name: string;

  @Column()
  filePath: string;

  @Column({ default: 'pending' }) // pending | processing | done | error
  status: string;

  @Column()
  type: string;

  @Column()
  size: string;

  @Column()
  pages: number;

  @Column({ unique: true, nullable: true })
  documentId: string; // Assuming this is the unique identifier for the document

  @CreateDateColumn()
  createdAt: Date;
}
