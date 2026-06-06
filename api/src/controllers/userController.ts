import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';

export const getUsers = async (req: Request, res: Response) => {
  const { name, positionId } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          name ? {
            OR: [
              { firstName: { contains: String(name), mode: 'insensitive' } },
              { lastName: { contains: String(name), mode: 'insensitive' } },
            ],
          } : {},
          positionId ? { positionId: String(positionId) } : {},
        ],
      },
      include: {
        position: true,
        team: true,
        manager: {
          select: { id: true, firstName: true, lastName: true }
        },
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        position: true,
        team: true,
        manager: {
          select: { id: true, firstName: true, lastName: true }
        },
        reportees: {
          select: { id: true, firstName: true, lastName: true, position: true }
        },
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { 
    email, password, role, firstName, lastName, sex, 
    dateOfBirth, address, positionId, teamId, managerId 
  } = req.body;

  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
        sex,
        dateOfBirth: new Date(dateOfBirth),
        address,
        photoUrl,
        positionId: positionId || null,
        teamId: teamId || null,
        managerId: managerId || null,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = { ...req.body };

  if (req.file) {
    data.photoUrl = `/uploads/${req.file.filename}`;
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  
  if (data.dateOfBirth) {
    data.dateOfBirth = new Date(data.dateOfBirth);
  }

  // Ensure these are null if empty string
  if (data.positionId === '') data.positionId = null;
  if (data.teamId === '') data.teamId = null;
  if (data.managerId === '') data.managerId = null;

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
