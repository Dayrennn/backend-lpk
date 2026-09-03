import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
    checkKandidat,
    createKandidat,
    createKandidatToClass,
    downloadKandidatFile,
    modifyKandidat,
    removeKandidat,
    seeAllKandidat,
    seeAllKandidatCalon,
    seeAllKandidatInggris,
    seeAllKandidatJepang,
    seeKandidatCPMI,
    seeKandidatForClass,
    seeKandidatMundur,
    seeOneKandidat,
    submitInterview,
    submitPersyaratandanDp,
    inputKandidatCPMI,
    seeOneCPMI
} from '../controller/kandidatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
    '/add-kandidat',
    upload.fields([
        { name: 'cv', maxCount: 1 },
        { name: 'kk', maxCount: 1 },
        { name: 'ktp', maxCount: 1 },
        { name: 'ktp_pendamping', maxCount: 1 },
        { name: 'ijazah', maxCount: 1 },
        { name: 'sertifikat', maxCount: 1 },
    ]),
    createKandidat,
);

router.post('/check', checkKandidat);
router.post('/simpan-persyaratan/:id', authMiddleware, submitPersyaratandanDp);
router.put('/input-interview/:id', authMiddleware, submitInterview);
router.put('/input-data-cpmi/:id', authMiddleware, inputKandidatCPMI);
router.post('/:kandidatId/kelas', authMiddleware, createKandidatToClass);

router.put(
    '/update-kandidat/:id',
    upload.fields([
        { name: 'cv', maxCount: 1 },
        { name: 'kk', maxCount: 1 },
        { name: 'ktp', maxCount: 1 },
        { name: 'ktp_pendamping', maxCount: 1 },
        { name: 'ijazah', maxCount: 1 },
        { name: 'sertifikat', maxCount: 1 },
    ]),
    authMiddleware,
    modifyKandidat,
);

router.delete('/delete-kandidat/:id', authMiddleware, removeKandidat);

router.get('/', authMiddleware, seeAllKandidat);

router.get('/kandidat-mundur', authMiddleware, seeKandidatMundur);
router.get('/calon-peserta', authMiddleware, seeAllKandidatCalon);
router.get('/data-cpmi', authMiddleware, seeKandidatCPMI)
router.get('/data-cpmi/:id', authMiddleware, seeOneCPMI)
router.get('/kandidat-kelas', authMiddleware, seeKandidatForClass);
router.get('/kelas-inggris', authMiddleware, seeAllKandidatInggris);
router.get('/kelas-jepang', authMiddleware, seeAllKandidatJepang);

router.get('/:id', authMiddleware, seeOneKandidat);
router.get('/:id/download/:field', authMiddleware, downloadKandidatFile);

export default router;
