import prisma from "../config/prisma.js";

export const getAllProvinsi = async () => {
    const result = await prisma.provinsi.findMany({
        select: {
            id: true,
            namaProvinsi: true,
            kabupaten: {
                select: {
                    id: true,
                    namaKabupaten: true,
                    provinsiId: true,
                    kacamatan: {
                        select: {
                            id: true,
                            namaKacamatan: true,
                            kabupatenId: true,
                            kelurahan: {
                                select: {
                                    id: true,
                                    namaKelurahan: true,
                                    kacamatanId: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return result;
};
