import z from "zod";

export const roleEnum = z.enum(["Admin", "SuperAdmin"]);

export const registerSchema = z.object({
    username: z.string().min(1, "Username Wajib diisi").max(32, "Username Maksimal 32 Karakter"),

    email: z.string().min(1, "Email Wajib diisi").email("Email Tidak Valid"),

    password: z.string().min(6, "Password Minimal 6 Karakter").max(100, "Password Maksimal 100 Karakter"),
});

export const updateUserSchema = z.object({
    username: z.string().optional(),
    email: z.string().email("Email Tidak Valid").optional(),
    password: z.string().min(6, "Password Minimal 6 Karakter").max(100, "Password Maksimal 100 Karakter").optional(),
    role: roleEnum.optional(),
});
