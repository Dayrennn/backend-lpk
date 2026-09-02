import { getAllProvinsi } from "../service/asalService.js";

export const seeAllProvinsi = async (req, res) => {
    try {
        const result = await getAllProvinsi();
        res.status(200).json({
            message: "Berhasil ambil data provinsi dan kabupaten",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
