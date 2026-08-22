import z from 'zod';

export const kandidatSchema = z.object({
    nama: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter'),

    tinggi: z.coerce.number().positive('Tinggi harus lebih dari 0'),

    berat_badan: z.coerce.number().positive('Berat badan harus lebih dari 0'),

    umur: z.coerce.number().int('Umur harus berupa bilangan bulat').positive('Umur harus lebih dari 0'),

    tgllahir: z.string().min(1, 'Tanggal lahir wajib diisi'),

    tujuan: z.string().min(1, 'Tujuan wajib diisi'),

    pendidikan: z.string().min(1, 'Pendidikan wajib diisi'),

    asal: z.string().min(1, 'Asal wajib diisi'),

    telephone: z.string().min(1, 'Nomor telfon wajib diisi'),

    dana: z.string().min(1, 'Dana wajib diisi'),

    bidang_pekerjaan: z.string().optional(),

    pic: z.string().optional(),

    keterangan: z.string().optional(),

    status: z.string().optional(),

    ojk: z.string().optional(),
});

export const upateKandidatSchema = kandidatSchema.partial();
