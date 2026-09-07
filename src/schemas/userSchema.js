import z from "zod";

export const roleEnum = z.enum(["Admin", "SuperAdmin"]);

export const registerSchema = z.object({
    username: z.string().min(1, "Username Wajib diisi").max(32, "Username Maksimal 32 Karakter"),

    email: z.string().min(1, "Email Wajib diisi").email("Email Tidak Valid"),

    password: z.string().min(1, "Password Wajib diisi").max(12, "Username Maksimal 12 Karakter"),
});

export const updateUserSchema = z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    role: roleEnum,
});
