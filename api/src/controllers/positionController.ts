import { Request, Response } from 'express';
import { prisma } from '../index';

export const getPositions = async (req: Request, res: Response) => {
  try {
    const positions = await prisma.position.findMany();
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching positions' });
  }
};

export const createPosition = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const position = await prisma.position.create({ data: { name } });
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error creating position' });
  }
};

export const updatePosition = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const position = await prisma.position.update({ where: { id }, data: { name } });
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error updating position' });
  }
};

export const deletePosition = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.position.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting position' });
  }
};
