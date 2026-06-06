import { Request, Response } from 'express';
import { prisma } from '../index';

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams' });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const team = await prisma.team.create({ data: { name } });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team' });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const team = await prisma.team.update({ where: { id }, data: { name } });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error updating team' });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team' });
  }
};
