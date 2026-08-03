import { prisma } from "@/lib/prisma";
import { User, Role } from "@prisma/client";

export class UserRepository {
  static async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
        ],
      },
    });
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async findAll(): Promise<Omit<User, "password">[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createUser(data: {
    name: string;
    email: string;
    username: string;
    passwordHash: string;
    role: Role;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        username: data.username.toLowerCase(),
        password: data.passwordHash,
        role: data.role,
      },
    });
  }

  static async updateUser(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      username: string;
      role: Role;
      isActive: boolean;
      passwordHash: string;
    }>
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email.toLowerCase() }),
        ...(data.username && { username: data.username.toLowerCase() }),
        ...(data.role && { role: data.role }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.passwordHash && { password: data.passwordHash }),
      },
    });
  }

  static async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
