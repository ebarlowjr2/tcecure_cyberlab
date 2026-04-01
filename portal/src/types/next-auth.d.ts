import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    permissions?: string[];
    userId?: string;
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      permissions?: string[];
      userId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    permissions?: string[];
    userId?: string;
  }
}
