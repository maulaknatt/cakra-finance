"use client";

import { useState } from "react";
import { Plus, Search, Shield, User, Mail, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createUserAction, toggleUserStatusAction } from "@/actions/userActions";
import { ROLE_LABELS } from "@/constants";
import { formatTanggal } from "@/lib/utils";
import { Role } from "@prisma/client";

interface UserListClientProps {
  users: {
    id: string;
    name: string;
    email: string;
    username: string;
    role: Role;
    avatarUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
  currentUserId: string;
}

export function UserListClient({ users, currentUserId }: UserListClientProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("BENDAHARA");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("role", role);

    const res = await createUserAction(formData);
    setIsLoading(false);

    if (res.success) {
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
    } else {
      setErrorMessage(res.error || res.message);
    }
  };

  const handleToggleStatus = async (id: string, status: boolean) => {
    await toggleUserStatusAction(id, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Manajemen Pengguna & Pengaturan Hak Akses
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola data akun pengguna, penetapan peran (Admin, Bendahara, Ketua), dan status aktifitas
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pengguna Baru
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari pengguna berdasarkan nama, username, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3.5">Pengguna</th>
                <th className="px-4 py-3.5">Username</th>
                <th className="px-4 py-3.5">Peran (Role)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Tanggal Terdaftar</th>
                <th className="px-4 py-3.5 text-center">Aksi Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                    @{u.username}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={u.role === "ADMIN" ? "destructive" : u.role === "BENDAHARA" ? "income" : "secondary"}>
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle className="h-3.5 w-3.5" /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                        <XCircle className="h-3.5 w-3.5" /> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {formatTanggal(u.createdAt, "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {u.id !== currentUserId ? (
                      <Button
                        variant={u.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(u.id, u.isActive)}
                        className="text-xs h-8"
                      >
                        {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Akun Anda</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 dark:border-slate-800">
              <CardTitle className="text-lg font-bold">Tambah Pengguna Baru</CardTitle>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              {errorMessage && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/60 dark:text-red-300">
                  ⚠️ {errorMessage}
                </div>
              )}
              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Lengkap *</label>
                  <Input placeholder="Contoh: Andi Wijaya" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Email *</label>
                  <Input type="email" placeholder="andi@cakra.org" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Username *</label>
                  <Input placeholder="andi.wijaya" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Password *</label>
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Peran (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <option value="BENDAHARA">Bendahara (CRUD Transaksi & Cetak Laporan)</option>
                    <option value="KETUA">Ketua (Read-Only & Cetak Laporan)</option>
                    <option value="ADMIN">Admin (Akses Penuh Seluruh Sistem)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t dark:border-slate-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan User"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
