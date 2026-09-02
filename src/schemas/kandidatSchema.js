import z from 'zod';

export const statusEnum = z.enum(['DRAFT', 'TERVERIFIKASI', 'PERBAIKAN', 'MUNDUR']);
export const statusOjkEnum = z.enum(['BELUM', 'CHECKING', 'LOLOS', 'TIDAK_LOLOS', 'MANDIRI']);
export const danaEnum = z.enum(['MANDIRI', 'TALANG']);
export const pembayaranPelatihanEnum = z.enum(['BELUM', 'DP', 'BULAN_1', 'BULAN_2', 'BULAN_3', 'BULAN_4', 'LUNAS']);
export const suratPernyataanEnum = z.enum(['SUDAH', 'BELUM']);
export const agamaEnum = z.enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KONGHUCU']);
export const pernikahanEnum = z.enum(['BELUM', 'MENIKAH', 'CERAI_HIDUP', 'CERAI_MATI'])

export const kandidatSchema = z.object({
    nama: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter'),

    tinggi: z.coerce.number().positive('Tinggi harus lebih dari 0'),

    berat_badan: z.coerce.number().positive('Berat badan harus lebih dari 0'),

    provinsiId: z.string().min(1, 'Provinsi wajib diisi'),

    kabupatenId: z.string().min(1, 'Kabupaten wajib diisi'),

    tgllahir: z.string().min(1, 'Tanggal lahir wajib diisi'),

    tujuan: z.string().min(1, 'Tujuan wajib diisi'),

    pendidikan: z.string().min(1, 'Pendidikan wajib diisi'),

    telephone: z.string().min(1, 'Nomor telfon wajib diisi'),

    agama: agamaEnum,

    pernikahan: pernikahanEnum,
    
    tempatLahir: z.string().min(1, 'Tempat lahir wajib diisi'),

    telephone_sekunder: z.string().optional(),

    dana: danaEnum,

    bidang_pekerjaan: z.string().optional(),

    pic: z.string().optional(),

    keterangan: z.string().optional(),

    status: statusEnum.optional(),

    ojk: statusOjkEnum.optional(),
});

export const updateKandidatSchema = kandidatSchema.partial();

export const updateCalonSchema = z.object({
    biayaPelatihan: pembayaranPelatihanEnum.optional(),
    suratPernyataan: suratPernyataanEnum.optional(),
});
