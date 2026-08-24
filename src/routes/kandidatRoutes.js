import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
    checkKandidat,
    createKandidat,
    downloadKandidatFile,
    modifyKandidat,
    removeKandidat,
    seeAllKandidat,
    seeAllKandidatCalon,
    seeOneKandidat,
    submitPersyaratandanDp,
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

router.post('/simpan-persyaratan/:id', authMiddleware, submitPersyaratandanDp);

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
router.get('/check', checkKandidat);
router.get('/calon-pekerja', authMiddleware, seeAllKandidatCalon);
router.get('/:id', authMiddleware, seeOneKandidat);
router.get('/:id/download/:field', authMiddleware, downloadKandidatFile);

export default router;
