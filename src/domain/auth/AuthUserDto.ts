export class AuthUserDto {
  id!: bigint;

  email!: string | null;

  name!: string | null;

  roles!: string[];

  constructor(data: AuthUserDto) {
    Object.assign(this, data);
  }
}
