import jwt from 'jsonwebtoken';
import { RoleTypeEnum } from '@/modules/user/enums/role';
import { NextFunction, Response } from 'express';
import { UserJWT } from '@/modules/user/data/dtos/user.jwt.dto';

export const checkToken = async (
  req: any,
  res: Response,
  next: NextFunction
)=> {
  try {
    if (!req.headers.authorization) throw new Error();
    const token = req.headers.authorization.split(' ')[1];
    req.userData = jwt.verify(token, process.env.SECRET!) as UserJWT;
    next();
  } catch (error) {
     res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }
};

export const checkAdmin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userData || req.userData.role !== RoleTypeEnum.ADMIN) {
      throw new Error('Unauthorized');
    }
    next();
  } catch (error) {
    res.status(403).json({
      message: 'Forbidden',
    });
    return 
  }
};

export const checkServiceProvider = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userData || req.userData.role !== RoleTypeEnum.OWNER)
      throw new Error('Unauthorized');
    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }
};

export const checkAdminOrServiceProvider = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !req.userData ||
      (req.userData.role != RoleTypeEnum.OWNER &&
        req.userData.role != RoleTypeEnum.ADMIN)
    )
      throw new Error('Unauthorized');
    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }
};

export const checkUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !req.userData ||
      req.userData.role !== RoleTypeEnum.USER ||
      req.userData.userId === req.params.id
    )
      throw new Error('Unauthorized');
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
