import prisma from '../config/prisma.js';
import { deleteFromCloudinary, uploadToCloudinary, downloadFromCloudinary, privateFileUrl } from '../S3/s3Service.js';
import compressToWebp from '../utils/compressWebp.js';

export const addKandidat = async ({
    nama,
    tinggi,
    berat_badan,
    umur,
    tgllahir,
    tujuan,
    status,
    pendidikan,
    asal,
    bidang_pekerjaan,
    pic,
    keterangan,
    telephone,
    dana,
    cvBuffer,
    kkBuffer,
    ktpBuffer,
    ktp_pendampingBuffer,
    ijazahBuffer,
    sertifikatBuffer,
}) => {
    if (!nama) {
        throw new Error('Nama Wajib di Isi');
    }
    if (!tinggi && tinggi !== 0) {
        throw new Error('Tinggi Wajib di Isi');
    }
    if (!berat_badan && berat_badan !== 0) {
        throw new Error('Berat Badan Wajib di Isi');
    }
    if (!umur && umur !== 0) {
        throw new Error('Umur Wajib di Isi');
    }
    if (!tgllahir) {
        throw new Error('Tanggal Lahir Wajib di Isi');
    }
    if (!cvBuffer) {
        throw new Error('CV Wajib di Isi');
    }
    if (!kkBuffer) {
        throw new Error('KK Wajib di Isi');
    }
    if (!ktpBuffer) {
        throw new Error('Ktp Wajib di Isi');
    }
    if (!ktp_pendampingBuffer) {
        throw new Error('Ktp Orang Tua / pendamping Wajib di Isi');
    }
    if (!ijazahBuffer) {
        throw new Error('Ijazah Wajib di Isi');
    }
    if (!tujuan) {
        throw new Error('Tujuan Wajib di Isi');
    }
    if (!telephone) {
        throw new Error('Telephone Wajib di Isi');
    }
    if (!dana) {
        throw new Error('Dana Wajin di Isi');
    }

    // konversi
    const tinggiFloat = parseFloat(tinggi);
    if (isNaN(tinggiFloat)) {
        throw new Error('Tinggi Wajib Angka');
    }

    const beratBadanFloat = parseFloat(berat_badan);
    if (isNaN(beratBadanFloat)) {
        throw new Error('Berat Badan Wajib Angka');
    }

    const umurInt = parseInt(umur);
    if (isNaN(umurInt)) {
        throw new Error('Umur Wajib Angka');
    }

    const tanggalLahirDate = new Date(tgllahir);
    if (isNaN(tanggalLahirDate.getTime())) {
        throw new Error('Format Tanggal Lahir Tidak Valid');
    }

    // kompress gambar
    const compressedKK = await compressToWebp(kkBuffer, `KK-${nama}`);
    const compressedKtp = await compressToWebp(ktpBuffer, `ktp-${nama}`);
    const compressedKtpPendamping = await compressToWebp(ktp_pendampingBuffer, `ktp-pendamping-${nama}`);
    const compressedIjazah = await compressToWebp(ijazahBuffer, `ijazah-${nama}`);

    const uploadKK = await uploadToCloudinary(compressedKK, {
        folder: 'Kandidat/KK',
        publicId: `KK-${nama}-${Date.now()}`,
        resourceType: 'image',
    });

    const uploadKtp = await uploadToCloudinary(compressedKtp, {
        folder: 'Kandidat/Ktp',
        publicId: `ktp-${nama}-${Date.now()}`,
        resourceType: 'image',
    });

    const uploadKtpPendamping = await uploadToCloudinary(compressedKtpPendamping, {
        folder: 'Kandidat/Ktp-Pendamping',
        publicId: `ktp-pendamping-${nama}-${Date.now()}`,
        resourceType: 'image',
    });

    const uploadIjazah = await uploadToCloudinary(compressedIjazah, {
        folder: 'Kandidat/Ijazah',
        publicId: `ijazah-${nama}-${Date.now()}`,
        resourceType: 'image',
    });

    // upload pdf
    const uploadCv = await uploadToCloudinary(cvBuffer, {
        folder: 'Kandidat/Cv',
        publicId: `cv-${nama}-${Date.now()}.pdf`,
        resourceType: 'raw',
    });

    // karna sertifikat todak wajib
    let uploadSertifikat = null;

    if (sertifikatBuffer) {
        uploadSertifikat = await uploadToCloudinary(sertifikatBuffer, {
            folder: 'Kandidat/Sertifikat',
            publicId: `sertifikat-${nama}-${Date.now()}.pdf`,
            resourceType: 'raw',
        });
    }

    const statusOJK = dana === 'MANDIRI' ? 'MANDIRI' : dana === 'TALANG' ? 'LOLOS' : 'BELUM';
    const addKandidat = await prisma.kandidat.create({
        data: {
            nama,
            tinggi: tinggiFloat,
            berat_badan: beratBadanFloat,
            umur: umurInt,
            tgllahir: tanggalLahirDate,
            ...(status && { status }),
            tujuan,
            pendidikan,
            asal,
            bidang_pekerjaan,
            pic,
            keterangan,
            telephone,
            ...(dana && { dana }),

            ojk: statusOJK,

            cvUrl: uploadCv.url,
            cvPublicId: uploadCv.publicId,

            kkUrl: uploadKK.url,
            kkPublicId: uploadKK.publicId,

            ktpUrl: uploadKtp.url,
            ktpPublicId: uploadKtp.publicId,

            ktp_pendampingUrl: uploadKtpPendamping.url,
            ktp_pendampingPublicId: uploadKtpPendamping.publicId,

            ijazahUrl: uploadIjazah.url,
            ijazahPublicId: uploadIjazah.publicId,

            sertifikatUrl: uploadSertifikat?.url ?? null,
            sertifikatPublicId: uploadSertifikat?.publicId ?? null,
        },
    });

    return addKandidat;
};

export const updateKandidat = async (
    id,
    {
        userId,
        userRole,
        nama,
        tinggi,
        berat_badan,
        umur,
        telephone,
        tgllahir,
        status,
        dana,
        pendidikan,
        asal,
        bidang_pekerjaan,
        pic,
        keterangan,
        cvBuffer,
        kkBuffer,
        ktpBuffer,
        ktp_pendampingBuffer,
        ijazahBuffer,
        sertifikatBuffer,
        tujuan,
        ojk,
    },
) => {
    if (!userId) {
        throw new Error('User Tidak Ter Autentikasi');
    }
    const existing = await prisma.kandidat.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new Error('Kandidat Tidak Ditemukan');
    }

    const isAdmin = userRole === 'Admin' || userRole === 'SuperAdmin';
    const nextStatus = isAdmin && status !== undefined ? status : existing.status;
    const nextDana = dana ?? existing.dana;

    const derivedOjk = nextDana === 'MANDIRI' ? 'MANDIRI' : nextDana === 'TALANG' ? 'LOLOS' : existing.ojk;

    const nextOjk = isAdmin && ojk !== undefined ? ojk : derivedOjk;

    let tinggiFloat = existing.tinggi;
    if (tinggi !== undefined) {
        tinggiFloat = parseFloat(tinggi);
        if (isNaN(tinggiFloat)) {
            throw new Error('Tinggi Wajib Angka');
        }
    }

    let beratBadanFloat = existing.berat_badan;
    if (berat_badan !== undefined) {
        beratBadanFloat = parseFloat(berat_badan);
        if (isNaN(beratBadanFloat)) {
            throw new Error('Berat Badan Wajib Angka');
        }
    }

    let umurInt = existing.umur;
    if (umur !== undefined) {
        umurInt = parseInt(umur);
        if (isNaN(umurInt)) {
            throw new Error('Umur Wajib Angka');
        }
    }

    let tanggalLahirDate = existing.tgllahir;
    if (tgllahir !== undefined) {
        tanggalLahirDate = new Date(tgllahir);
        if (isNaN(tanggalLahirDate.getTime())) {
            throw new Error('Format Tanggal Lahir Tidak Valid');
        }
    }

    // upload file baru kalo di kirim
    let newCvUpload = null;
    let newKkUpload = null;
    let newKtpUpload = null;
    let newKtpPendampingUpload = null;
    let newIjazahUpload = null;
    let newSertifikatUpload = null;

    try {
        if (cvBuffer) {
            newCvUpload = await uploadToCloudinary(cvBuffer, {
                folder: 'Kandidat/Cv',
                publicId: `cv-${existing.nama}-${Date.now()}.pdf`,
                resourceType: 'raw',
            });
        }

        if (kkBuffer) {
            const compressedKK = await compressToWebp(kkBuffer, `KK-${existing.nama}`);
            newKkUpload = await uploadToCloudinary(compressedKK, {
                folder: 'Kandidat/KK',
                publicId: `KK-${existing.nama}-${Date.now()}`,
                resourceType: 'image',
            });
        }

        if (ktpBuffer) {
            const compressedKtp = await compressToWebp(ktpBuffer, `ktp-${existing.nama}`);
            newKtpUpload = await uploadToCloudinary(compressedKtp, {
                folder: 'Kandidat/Ktp',
                publicId: `ktp-${existing.nama}-${Date.now()}`,
                resourceType: 'image',
            });
        }

        if (ktp_pendampingBuffer) {
            const compressedKtpPendamping = await compressToWebp(
                ktp_pendampingBuffer,
                `ktp-pendamping-${existing.nama}`,
            );
            newKtpPendampingUpload = await uploadToCloudinary(compressedKtpPendamping, {
                folder: 'Kandidat/Ktp-Pendamping',
                publicId: `ktp-pendamping-${existing.nama}-${Date.now()}`,
                resourceType: 'image',
            });
        }

        if (ijazahBuffer) {
            const compressedIjazah = await compressToWebp(ijazahBuffer, `ijazah-${existing.nama}`);
            newIjazahUpload = await uploadToCloudinary(compressedIjazah, {
                folder: 'Kandidat/Ijazah',
                publicId: `ijazah-${existing.nama}-${Date.now()}`,
                resourceType: 'image',
            });
        }

        if (sertifikatBuffer) {
            newSertifikatUpload = await uploadToCloudinary(sertifikatBuffer, {
                folder: 'Kandidat/Sertifikat',
                publicId: `sertifikat-${existing.nama}-${Date.now()}.pdf`,
                resourceType: 'raw',
            });
        }

        const updated = await prisma.kandidat.update({
            where: { id },
            data: {
                nama: nama ?? existing.nama,
                tinggi: tinggiFloat,
                berat_badan: beratBadanFloat,
                umur: umurInt,
                tgllahir: tanggalLahirDate,
                status: nextStatus,
                userId,
                tujuan: tujuan ?? existing.tujuan,
                dana: nextDana,
                ojk: nextOjk,
                pendidikan: pendidikan ?? existing.pendidikan,
                asal: asal ?? existing.asal,
                bidang_pekerjaan: bidang_pekerjaan ?? existing.bidang_pekerjaan,
                pic: pic ?? existing.pic,
                keterangan: keterangan ?? existing.keterangan,
                telephone: telephone ?? existing.telephone,

                cvUrl: newCvUpload?.url ?? existing.cvUrl,
                cvPublicId: newCvUpload?.publicId ?? existing.cvPublicId,

                kkUrl: newKkUpload?.url ?? existing.kkUrl,
                kkPublicId: newKkUpload?.publicId ?? existing.kkPublicId,

                ktpUrl: newKtpUpload?.url ?? existing.ktpUrl,
                ktpPublicId: newKtpUpload?.publicId ?? existing.ktpPublicId,

                ktp_pendampingUrl: newKtpPendampingUpload?.url ?? existing.ktp_pendampingUrl,
                ktp_pendampingPublicId: newKtpPendampingUpload?.publicId ?? existing.ktp_pendampingPublicId,

                ijazahUrl: newIjazahUpload?.url ?? existing.ijazahUrl,
                ijazahPublicId: newIjazahUpload?.publicId ?? existing.ijazahPublicId,

                sertifikatUrl: newSertifikatUpload?.url ?? existing.sertifikatUrl,
                sertifikatPublicId: newSertifikatUpload?.publicId ?? existing.sertifikatPublicId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        // hapus file lama
        if (newCvUpload && existing.cvPublicId) {
            await deleteFromCloudinary(existing.cvPublicId, { resourceType: 'raw' });
        }
        if (newKkUpload && existing.kkPublicId) {
            await deleteFromCloudinary(existing.kkPublicId, { resourceType: 'image' });
        }
        if (newKtpUpload && existing.ktpPublicId) {
            await deleteFromCloudinary(existing.ktpPublicId, { resourceType: 'image' });
        }
        if (newKtpPendampingUpload && existing.ktp_pendampingPublicId) {
            await deleteFromCloudinary(existing.ktp_pendampingPublicId, { resourceType: 'image' });
        }
        if (newIjazahUpload && existing.ijazahPublicId) {
            await deleteFromCloudinary(existing.ijazahPublicId, { resourceType: 'image' });
        }
        if (newSertifikatUpload && existing.sertifikatPublicId) {
            await deleteFromCloudinary(existing.sertifikatPublicId, { resourceType: 'raw' });
        }

        return updated;
    } catch (error) {
        // hapus file baru kalau update gagal
        if (newCvUpload) await deleteFromCloudinary(newCvUpload.publicId, { resourceType: 'raw' });
        if (newKkUpload) await deleteFromCloudinary(newKkUpload.publicId, { resourceType: 'image' });
        if (newKtpUpload) await deleteFromCloudinary(newKtpUpload.publicId, { resourceType: 'image' });
        if (newKtpPendampingUpload)
            await deleteFromCloudinary(newKtpPendampingUpload.publicId, { resourceType: 'image' });
        if (newIjazahUpload) await deleteFromCloudinary(newIjazahUpload.publicId, { resourceType: 'image' });
        if (newSertifikatUpload) await deleteFromCloudinary(newSertifikatUpload.publicId, { resourceType: 'raw' });

        throw error;
    }
};

export const deleteKandidat = async (id) => {
    const existingKandidat = await prisma.kandidat.findUnique({
        where: { id },
    });

    if (!existingKandidat) {
        throw new Error('Kandidat Tidak Ditemukan');
    }

    const removedKandidat = await prisma.kandidat.delete({
        where: { id },
    });

    await deleteFromCloudinary(existingKandidat.cvPublicId, { resourceType: 'raw' });
    await deleteFromCloudinary(existingKandidat.kkPublicId, { resourceType: 'image' });
    await deleteFromCloudinary(existingKandidat.ktpPublicId, { resourceType: 'image' });
    await deleteFromCloudinary(existingKandidat.ktp_pendampingPublicId, { resourceType: 'image' });
    await deleteFromCloudinary(existingKandidat.ijazahPublicId, { resourceType: 'image' });

    if (existingKandidat.sertifikatPublicId) {
        await deleteFromCloudinary(existingKandidat.sertifikatPublicId, { resourceType: 'raw' });
    }

    return removedKandidat;
};

export const getAllkandidat = async (page = 1, limit = 10, search = '') => {
    const skip = (page - 1) * limit;

    const where = search.trim()
        ? {
              OR: [
                  {
                      nama: {
                          contains: search.trim(),
                          mode: 'insensitive',
                      },
                  },
                  {
                      tujuan: {
                          contains: search.trim(),
                          mode: 'insensitive',
                      },
                  },
                  {
                      pendidikan: {
                          contains: search.trim(),
                          mode: 'insensitive',
                      },
                  },
                  {
                      asal: {
                          contains: search.trim(),
                          mode: 'insensitive',
                      },
                  },
                  {
                      bidang_pekerjaan: {
                          contains: search.trim(),
                          mode: 'insensitive',
                      },
                  },
                  {
                      telephone: {
                          contains: search.trim(),
                      },
                  },
              ],
          }
        : {};

    const [kandidat, totalKandidat, kandidatDraft, kandidatVerifikasi, kandidatPerbaikan] = await prisma.$transaction([
        prisma.kandidat.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                nama: true,
                tinggi: true,
                berat_badan: true,
                umur: true,
                tgllahir: true,
                status: true,
                tujuan: true,
                ojk: true,
                pendidikan: true,
                asal: true,
                bidang_pekerjaan: true,
                pic: true,
                keterangan: true,
                telephone: true,
                dana: true,
                createdAt: true,
                updatedAt: true,

                cvUrl: true,
                kkUrl: true,
                ktpUrl: true,
                ktp_pendampingUrl: true,
                ijazahUrl: true,
                sertifikatUrl: true,
                cvPublicId: true,
                kkPublicId: true,
                ktpPublicId: true,
                ktp_pendampingPublicId: true,
                ijazahPublicId: true,
                sertifikatPublicId: true,
                user: { select: { id: true, username: true } },
            },
        }),

        prisma.kandidat.count({
            where,
        }),

        prisma.kandidat.count({
            where: {
                ...where,
                status: 'DRAFT',
            },
        }),

        prisma.kandidat.count({
            where: {
                ...where,
                status: 'TERVERIFIKASI',
            },
        }),

        prisma.kandidat.count({
            where: {
                ...where,
                status: 'PERBAIKAN',
            },
        }),
    ]);

    return {
        kandidat,
        data: {
            page,
            limit,
            total: totalKandidat,
            kandidatDraft,
            kandidatVerifikasi,
            kandidatPerbaikan,
            totalPages: Math.ceil(totalKandidat / limit),
        },
    };
};

const FILE_FIELD_CONFIG = {
    cvUrl: { publicIdField: 'cvPublicId', resourceType: 'raw', format: 'pdf' },
    sertifikatUrl: { publicIdField: 'sertifikatPublicId', resourceType: 'raw', format: 'pdf' },
    kkUrl: { publicIdField: 'kkPublicId', resourceType: 'image', format: 'webp' },
    ktpUrl: { publicIdField: 'ktpPublicId', resourceType: 'image', format: 'webp' },
    ktp_pendampingUrl: { publicIdField: 'ktp_pendampingPublicId', resourceType: 'image', format: 'webp' },
    ijazahUrl: { publicIdField: 'ijazahPublicId', resourceType: 'image', format: 'webp' },
};

export const getKandidatFile = async (id, field) => {
    const config = FILE_FIELD_CONFIG[field];
    if (!config) {
        throw new Error('Jenis file tidak valid');
    }

    const kandidat = await prisma.kandidat.findUnique({
        where: {
            id,
        },
        select: {
            nama: true,
            [config.publicIdField]: true,
        },
    });

    if (!kandidat) {
        throw new Error('Kandidat tidak ditemukan');
    }

    const publicId = kandidat[config.publicIdField];
    if (!publicId) {
        throw new Error('File tidak tersedia');
    }

    const signedUrl = privateFileUrl(publicId, config.resourceType, config.format);
    const file = await downloadFromCloudinary(signedUrl);

    return {
        nama: kandidat.nama,
        ...file,
    };
};

export const getOneKandidat = async (id) => {
    const result = await prisma.kandidat.findFirst({
        where: { id },
        select: {
            id: true,
            nama: true,
            tinggi: true,
            berat_badan: true,
            umur: true,
            tgllahir: true,
            status: true,
            tujuan: true,
            ojk: true,
            pendidikan: true,
            asal: true,
            bidang_pekerjaan: true,
            pic: true,
            keterangan: true,
            telephone: true,
            dana: true,
            cvUrl: true,
            kkUrl: true,
            ktpUrl: true,
            ktp_pendampingUrl: true,
            ijazahUrl: true,
            sertifikatUrl: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};

export const getKandidatCalon = async (page = 1, limit = 10, search = '') => {
    const skip = (page - 1) * limit;

    const where = search.trim()
        ? {
              nama: {
                  contains: search.trim(),
                  mode: 'insensitive',
              },
          }
        : {};

    const kandidatWhere = { ...where, ojk: { in: ['LOLOS', 'MANDIRI'] } };

    const [kandidat, totalKandidat, totalTalang, totalMandiri] = await prisma.$transaction([
        prisma.kandidat.findMany({
            where: kandidatWhere,
            skip,
            take: limit,
            select: {
                id: true,
                nama: true,
                umur: true,
                telephone: true,
                pendidikan: true,
                asal: true,
                tujuan: true,
                ojk: true,
                dana: true,
                biayaPelatihan: true,
                suratPernyataan: true,
            },
        }),

        prisma.kandidat.count({ where: kandidatWhere }),

        prisma.kandidat.count({ where: { ...kandidatWhere, dana: 'TALANG' } }),

        prisma.kandidat.count({ where: { ...kandidatWhere, dana: 'MANDIRI' } }),
    ]);

    return {
        kandidat,
        data: {
            page,
            limit,
            total: totalKandidat,
            totalTalang,
            totalMandiri,
            totalPages: Math.ceil(totalKandidat / limit),
        },
    };
};

export const inputPersyaratandanDp = async ({ id, biayaPelatihan, suratPernyataan }) => {
    // const calon = await prisma.kandidat.findUnique({
    //     where: { id },
    // });

    // if (!calon) {
    //     throw new Error('Data Calon Tidak di Temukan');
    // }

    const input = await prisma.kandidat.update({
        where: { id },
        data: {
            biayaPelatihan,
            suratPernyataan,
        },
        select: {
            id: true,
            nama: true,
            biayaPelatihan: true,
            suratPernyataan: true,
        },
    });

    return input;
};
