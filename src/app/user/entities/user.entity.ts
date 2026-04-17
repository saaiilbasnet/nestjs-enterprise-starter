import { CommonFields } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';
import { UserRoleENUM } from '../user.type';

@Entity()
export class User extends CommonFields {
  @Column({ nullable: false, type: 'text' })
  fullname!: string;

  @Column({ nullable: false, type: 'text', unique: true })
  email!: string;

  @Column({ nullable: false, type: 'text' })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRoleENUM,
    default: UserRoleENUM.USER,
  })
  role!: UserRoleENUM;
}
