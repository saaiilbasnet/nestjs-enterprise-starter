import { Request } from 'express';
import { User } from 'src/app/user/entities/user.entity';

export interface RequestWithUser extends Request {
  user: Partial<User>;
  restaurantFilter: string | null;
  cookies: Record<string, string>;
}
