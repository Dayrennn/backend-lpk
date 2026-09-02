import { kandidatSchema, updateCalonSchema, updateKandidatSchema } from "../schemas/kandidatSchema.js";
import {
    addKandidat,
    deleteKandidat,
    getAllkandidat,
    getKandidatFile,
    getOneKandidat,
    updateKandidat,
    getKandidatCalon,
    inputPersyaratandanDp,
    getFromKodeRegistrasi,
    getKandidatForClass,
    addSiswaToClass,
    getKandidatKelasInggris,
    getKandidatKelasJepang,
    getKandidatMundur,
} from "../service/kandidatService.js";

export const createKandidat = async (req, res) => {
    try {
        // validasi body
        const result = kandidatSchema.safeParse(req.body);
        // format error
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;

            return res.status(400).json({
                message: "Validasi Gagal",
                errors,
            });
        }

        const { nama, tinggi, berat_badan, tgllahir, tujuan, status, pendidikan, provinsiId, kabupatenId, bidang_pekerjaan, pic, keterangan, telephone, telephone_sekunder, dana, agama, pernikahan, email, tempatLahir } = result.data;

        const files = req.files;

        const cvBuffer = files?.cv?.[0]?.buffer;
        const kkBuffer = files?.kk?.[0]?.buffer;
        const ktpBuffer = files?.ktp?.[0]?.buffer;
        const ktp_pendampingBuffer = files?.ktp_pendamping?.[0]?.buffer;
        const ijazahBuffer = files?.ijazah?.[0]?.buffer;
        const sertifikatBuffer = files?.sertifikat?.[0]?.buffer ?? null;

        const kandidat = await addKandidat({
            nama,
            tinggi,
            berat_badan,
            tgllahir,
            tujuan,
            status,
            pendidikan,
            provinsiId,
            kabupatenId,
            bidang_pekerjaan,
            pic,
            keterangan,
            telephone,
            telephone_sekunder,
            dana,
            agama,
            pernikahan, 
            email,
            tempatLahir,

            cvBuffer,
            kkBuffer,
            ktpBuffer,
            ktp_pendampingBuffer,
            ijazahBuffer,
            sertifikatBuffer,
        });

        return res.status(201).json({
            message: "Kandidat berhasil ditambahkan",
            data: kandidat,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const modifyKandidat = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const result = updateKandidatSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;

            return res.status(400).json({
                message: "Validasi Gagal",
                errors,
            });
        }

        const { nama, tinggi, berat_badan, tgllahir, tujuan, status, ojk, pendidikan, provinsiId, kabupatenId, bidang_pekerjaan, pic, keterangan, telephone, telephone_sekunder, dana, agama, pernikahan, email, tempatLahir } = result.data;

        const files = req.files;

        const cvBuffer = files?.cv?.[0]?.buffer;
        const kkBuffer = files?.kk?.[0]?.buffer;
        const ktpBuffer = files?.ktp?.[0]?.buffer;
        const ktp_pendampingBuffer = files?.ktp_pendamping?.[0]?.buffer;
        const ijazahBuffer = files?.ijazah?.[0]?.buffer;
        const sertifikatBuffer = files?.sertifikat?.[0]?.buffer ?? null;

        const kandidat = await updateKandidat(id, {
            nama,
            tinggi,
            berat_badan,
            tgllahir,
            userId,
            userRole: req.user?.role,
            tujuan,
            status,
            ojk,
            pendidikan,
            provinsiId,
            kabupatenId,
            bidang_pekerjaan,
            pic,
            keterangan,
            telephone,
            telephone_sekunder,
            dana,
            agama,
            pernikahan,
            email,
            tempatLahir,

            cvBuffer,
            kkBuffer,
            ktpBuffer,
            ktp_pendampingBuffer,
            ijazahBuffer,
            sertifikatBuffer,
        });

        return res.status(201).json({
            message: `Kandidat telah di update oleh ${kandidat.user?.username}`,
            data: kandidat,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const removeKandidat = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteKandidat(id);

        res.status(200).json({
            message: "Berhasil Hapus Kandidat",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const seeAllKandidat = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search = "" } = req.query;

        const result = await getAllkandidat(page, limit, search);
        res.status(200).json({
            message: "Berhasil Mengambil Data Kandidat",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const downloadKandidatFile = async (req, res) => {
    try {
        const { id, field } = req.params;

        const file = await getKandidatFile(id, field);

        res.setHeader("Content-Type", file.contentType || "application/octet-stream");

        res.setHeader("Content-Disposition", `attachment; filename="${field}-${file.nama}"`);

        file.stream.pipe(res);
    } catch (error) {
        console.error("Download File Error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

export const seeOneKandidat = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getOneKandidat(id);
        res.status(200).json({
            message: "Berhasil Mengambil Saty Data Kandidat",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const seeAllKandidatCalon = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search = "" } = req.query;

        const result = await getKandidatCalon(page, limit, search);
        res.status(200).json({
            message: "Berhasil Mengambil Data Kandidat Calon",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const submitPersyaratandanDp = async (req, res) => {
    try {
        const { id } = req.params;
        // validasi body
        const result = updateCalonSchema.safeParse(req.body);
        // format error
        if (!result.success) {
            console.log("FULL ERROR:", result.error.flatten()); // tambahkan ini
            console.log("REQ BODY:", req.body); // tambahkan ini juga
            const errors = result.error.flatten().fieldErrors;

            return res.status(400).json({
                message: "Validasi Gagal",
                errors,
            });
        }

        const { biayaPelatihan, suratPernyataan } = result.data;
        const input = await inputPersyaratandanDp({ id, biayaPelatihan, suratPernyataan });
        res.status(200).json({
            message: "Berhasil Input Persyaratan Data Kandidat Calon",
            data: input,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const checkKandidat = async (req, res) => {
    try {
        const { kodeRegistrasi } = req.body;
        console.log("MASUK GA: ", kodeRegistrasi);
        const result = await getFromKodeRegistrasi(kodeRegistrasi);

        res.status(200).json({
            message: "Berhasil Ambil Data Dari Kode",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const seeKandidatForClass = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search = "" } = req.query;
        const result = await getKandidatForClass(page, limit, search);
        res.status(200).json({
            message: "Berhasil Ambil Data Kandidat Untuk Masuk Kelas",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const createKandidatToClass = async (req, res) => {
    try {
        const { kandidatId } = req.params;
        const { tipeKelas } = req.body;

        const result = await addSiswaToClass({ kandidatId, tipeKelas });
        res.status(200).json({
            message: "Kandidat Berhasil ditambahkan ke Kelas",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const seeAllKandidatInggris = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search = "" } = req.query;

        const result = await getKandidatKelasInggris(page, limit, search);
        res.status(200).json({
            message: "Berhasil Ambil Data Kandidat Kelas Inggris",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const seeAllKandidatJepang = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search = "" } = req.query;

        const result = await getKandidatKelasJepang(page, limit, search);
        res.status(200).json({
            message: "Berhasil Ambil Data Kandidat Kelas Inggris",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const seeKandidatMundur = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search = "" } = req.query;

        const result = await getKandidatMundur(page, limit, search);
        res.status(200).json({
            message: "Berhasil Ambil Data Kandidat Mundur",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
