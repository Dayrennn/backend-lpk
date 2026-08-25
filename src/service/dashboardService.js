import prisma from '../config/prisma.js';

export const getAllkandidatDashboard = async (page = 1, limit = 10, search = '') => {
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
                telephone: true,
                tujuan: true,
                createdAt: true,

                status: true,
                ojk: true,
                dana: true,
            },
            orderBy: { createdAt: 'desc' },
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
