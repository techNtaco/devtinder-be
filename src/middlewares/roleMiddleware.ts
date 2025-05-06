import { Request, Response, NextFunction } from 'express';

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user || !user.role) {
      res.status(403).json({ error: 'Access denied. No role assigned.' });
      return
    } else if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden. You are not authorized.' });
      return
    }

    next();
  };
};
