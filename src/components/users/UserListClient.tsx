"use client";

import { useState } from "react";
import { Plus, Search, Shield, User, Mail, CheckCircle, XCircle, Loader2, X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createUserAction, updateUserAction, toggleUserStatusAction, deleteUserAction } from "@/actions/userActions";
import { ROLE_LABELS } from "@/constants";
import { formatTanggal } from "@/lib/utils";
import { Role } from "@prisma/client";

interface UserItem {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserListClientProps {
  users: UserItem[];
  currentUserId: string;
}

export function UserListClient({ users, currentUserId }: UserListClientProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add User Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("BENDAHARA");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Edit User Form State
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<Role>("BENDAHARA");
  const [editPassword, setEditPassword] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState("");

  // Delete User Confirmation State
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

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

  const openEditModal = (u: UserItem) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditPassword("");
    setEditErrorMessage("");
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsEditLoading(true);
    setEditErrorMessage("");

    const formData = new FormData();
    formData.append("id", editingUser.id);
    formData.append("name", editName);
    formData.append("email", editEmail);
    formData.append("role", editRole);
    if (editPassword.trim()) {
      formData.append("password", editPassword.trim());
    }

    const res = await updateUserAction(formData);
    setIsEditLoading(false);

    if (res.success) {
      setEditingUser(null);
    } else {
      setEditErrorMessage(res.error || res.message);
    }
  };

  const handleToggleStatus = async (id: string, status: boolean) => {
    await toggleUserStatusAction(id, status);
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsDeleteLoading(true);
    const res = await deleteUserAction(deletingUser.id);
    setIsDeleteLoading(false);

    if (res.success) {
      setDeletingUser(null);
    } else {
      alert(res.error || res.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Kelola User & Peran 👥
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-600 dark:text-slate-400">
            Kelola data akun pengguna, penetapan peran (Admin, Bendahara, Ketua), dan status aktifitas
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="default"
          size="default"
          className="font-extrabold text-xs gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Pengguna Baru
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="cartoon-card p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
          <Input
            placeholder="Cari pengguna berdasarkan nama, username, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="cartoon-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-extrabold">
            <thead className="bg-amber-300 text-slate-950 dark:bg-slate-950 dark:text-white border-b-[2.5px] border-slate-900 dark:border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Pengguna</th>
                <th className="px-4 py-3.5">Username</th>
                <th className="px-4 py-3.5">Peran (Role)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Tanggal Terdaftar</th>
                <th className="px-4 py-3.5 text-center">Aksi Pengelola</th>
              </tr>
            </thead>
            <tbody className="divide-y-[2px] divide-slate-900 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-amber-100/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-[2px] border-slate-900 bg-amber-400 text-slate-950 font-black text-xs shadow-[2px_2px_0px_0px_#0f172a]">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-950 dark:text-white">{u.name}</p>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                    @{u.username}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={u.role === "ADMIN" ? "destructive" : u.role === "BENDAHARA" ? "income" : "cyan"}>
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-slate-900 bg-emerald-300 px-2.5 py-0.5 text-[10px] font-black text-slate-950 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                        <CheckCircle className="h-3 w-3" /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-slate-900 bg-rose-300 px-2.5 py-0.5 text-[10px] font-black text-slate-950 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                        <XCircle className="h-3 w-3" /> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                    {formatTanggal(u.createdAt, "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {/* Edit Button */}
                      <Button
                        variant="yellow"
                        size="sm"
                        onClick={() => openEditModal(u)}
                        className="text-[11px] h-7 px-2.5 font-black gap-1"
                        title="Edit User"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>

                      {/* Status Toggle Button */}
                      {u.id !== currentUserId ? (
                        <Button
                          variant={u.isActive ? "outline" : "cyan"}
                          size="sm"
                          onClick={() => handleToggleStatus(u.id, u.isActive)}
                          className="text-[11px] h-7 px-2.5 font-black"
                        >
                          {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                      ) : null}

                      {/* Delete Button */}
                      {u.id !== currentUserId ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingUser(u)}
                          className="text-[11px] h-7 px-2 font-black gap-1"
                          title="Hapus User"
                        >
                          <Trash2 className="h-3 w-3" /> Hapus
                        </Button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 italic px-1">Akun Anda</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md border-[3px] border-slate-900 bg-white p-2 shadow-[6px_6px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between border-b-[2px] border-slate-900 pb-3 dark:border-slate-100">
              <CardTitle className="text-lg font-black text-slate-950 dark:text-white">Tambah Pengguna Baru ➕</CardTitle>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border-[2px] border-slate-900 p-1 text-slate-900 hover:bg-rose-200 dark:text-white dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              {errorMessage && (
                <div className="mb-4 rounded-xl border-[2px] border-slate-900 bg-rose-200 p-3 text-xs font-black text-rose-950 shadow-[2px_2px_0px_0px_#0f172a]">
                  ⚠️ {errorMessage}
                </div>
              )}
              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Nama Lengkap *</label>
                  <Input placeholder="Contoh: Andi Wijaya" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Email *</label>
                  <Input type="email" placeholder="andi@cakra.org" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Username *</label>
                  <Input placeholder="andi.wijaya" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Password *</label>
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Peran (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="flex h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 py-2 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
                  >
                    <option value="BENDAHARA">Bendahara (CRUD Transaksi & Cetak Laporan)</option>
                    <option value="KETUA">Ketua (Read-Only & Cetak Laporan)</option>
                    <option value="ADMIN">Admin (Akses Penuh Seluruh Sistem)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t-[2px] border-slate-900 dark:border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isLoading} variant="default">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan User"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md border-[3px] border-slate-900 bg-white p-2 shadow-[6px_6px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between border-b-[2px] border-slate-900 pb-3 dark:border-slate-100">
              <CardTitle className="text-lg font-black text-slate-950 dark:text-white">Edit Data Pengguna ✏️</CardTitle>
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-xl border-[2px] border-slate-900 p-1 text-slate-900 hover:bg-rose-200 dark:text-white dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              {editErrorMessage && (
                <div className="mb-4 rounded-xl border-[2px] border-slate-900 bg-rose-200 p-3 text-xs font-black text-rose-950 shadow-[2px_2px_0px_0px_#0f172a]">
                  ⚠️ {editErrorMessage}
                </div>
              )}
              <form onSubmit={handleUpdateUser} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Nama Lengkap *</label>
                  <Input placeholder="Nama Lengkap" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Email *</label>
                  <Input type="email" placeholder="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Username (Read-Only)</label>
                  <Input value={`@${editingUser.username}`} disabled className="bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Password Baru (Opsional)</label>
                  <Input type="password" placeholder="Kosongkan jika tidak ingin mengubah password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                  <p className="text-[10px] font-bold text-slate-500">Biarkan kosong jika tetap menggunakan password saat ini.</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">Peran (Role) *</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as Role)}
                    className="flex h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 py-2 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
                  >
                    <option value="BENDAHARA">Bendahara (CRUD Transaksi & Cetak Laporan)</option>
                    <option value="KETUA">Ketua (Read-Only & Cetak Laporan)</option>
                    <option value="ADMIN">Admin (Akses Penuh Seluruh Sistem)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t-[2px] border-slate-900 dark:border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isEditLoading} variant="default">
                    {isEditLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Perbarui User"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md border-[3px] border-slate-900 bg-white p-4 shadow-[6px_6px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b-[2px] border-slate-900 pb-3 dark:border-slate-100">
              <h3 className="text-lg font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> Hapus Akun Pengguna
              </h3>
              <button
                onClick={() => setDeletingUser(null)}
                className="rounded-xl border-[2px] border-slate-900 p-1 text-slate-900 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Apakah Anda yakin ingin menghapus akun pengurus <strong>{deletingUser.name}</strong> (@{deletingUser.username})?
              </p>
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                ⚠️ Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t-[2px] border-slate-900 dark:border-slate-100">
              <Button variant="outline" onClick={() => setDeletingUser(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleteLoading}>
                {isDeleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ya, Hapus User 🗑️"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
