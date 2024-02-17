export class AuthenticatedUser {
  id: number;
  name: string;
  permissions: string[];

  //private issuedAt: Date;
  private notBefore: Date;
  private expiresAt: Date;

  constructor(token: any) {
    this.id = parseInt(token.nameid);
    this.name = token.unique_name;

    if (token.role)
      this.permissions = Array.isArray(token.role) ? token.role : [token.role];

    //this.issuedAt = new Date(token.iat * 1000);
    this.notBefore = new Date(token.nbf * 1000);
    this.expiresAt = new Date(token.exp * 1000);
  }

  isTokenValid(): boolean {
    const curDateTime = new Date();

    return (curDateTime > this.notBefore && curDateTime < this.expiresAt);
  }
}
