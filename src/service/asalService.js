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
                },
            },
        },
    });

    return result;
};
