import { CurrentUserData } from './current-user.interface';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging with Express.User requires an interface, not a type alias
    interface User extends CurrentUserData {}
  }
}
