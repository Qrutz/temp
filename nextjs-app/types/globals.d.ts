export {};

// Create a type for the roles
export type Roles = 'admin' | 'employee';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
