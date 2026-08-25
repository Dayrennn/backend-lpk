import { getAllkandidatDashboard } from '../service/dashboardService.js';

export const seeAllKandidatDashboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search = '' } = req.query;

        const result = await getAllkandidatDashboard(page, limit, search);
        res.status(200).json({
            message: 'Berhasil Mengambil Data Kandidat',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
