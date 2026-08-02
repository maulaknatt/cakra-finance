import { UserRepository } from "@/repositories/userRepository";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserListClient } from "@/components/users/UserListClient";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await UserRepository.findAll();

  return <UserListClient users={users} currentUserId={session.id} />;
}
