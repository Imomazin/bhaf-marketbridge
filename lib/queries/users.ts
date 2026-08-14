import { prisma, DB_ENABLED } from "@/lib/db";
import type { Role, UserStatus, Prisma } from "@prisma/client";

const PAGE_SIZE = 20;

export interface UserListFilters {
  q?: string;
  role?: Role;
  status?: UserStatus;
  page?: number;
}

export interface UserListRow {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
}

export interface UserListResult {
  rows: UserListRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function listUsers(filters: UserListFilters): Promise<UserListResult> {
  const page = Math.max(1, filters.page ?? 1);
  if (!DB_ENABLED || !prisma) {
    return { rows: [], total: 0, page, pageSize: PAGE_SIZE, totalPages: 0 };
  }

  const where: Prisma.UserWhereInput = {
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: "insensitive" } },
            { email: { contains: filters.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);

  return { rows, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
