import { CommonFields } from 'src/common/base.entity';
import { Column, Entity, Index } from 'typeorm';
import { UserRoleENUM } from '../user.type';

@Entity('t_users')
export class User extends CommonFields {
  @Column({ nullable: false, type: 'varchar', length: 100 })
  fullname!: string;

  @Index('idx_user_email', { unique: true })
  @Column({ nullable: false, type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ nullable: false, type: 'text', select: false })
  password!: string;

  @Index('idx_user_role')
  @Column({
    type: 'enum',
    enum: UserRoleENUM,
    default: UserRoleENUM.USER,
  })
  role!: UserRoleENUM;
}
