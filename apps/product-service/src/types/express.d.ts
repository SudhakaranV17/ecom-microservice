declare global {
  namespace Express {
    interface Request {
      userId?: string; // MongoDB _id as string, set by ProtectedRoute middleware
    }
  }
}

export {};
