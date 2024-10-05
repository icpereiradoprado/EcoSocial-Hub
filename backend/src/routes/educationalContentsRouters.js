import { Router } from 'express'
import EducationalContentsController from '../controller/EducationalContentsController.js';
import AuthService from '../services/AuthService.js';


const router = Router();

//Rotas GET
router.get('/', AuthService.checkToken, EducationalContentsController.getAllEducationalContent);

//Rotas POST
router.post('/register', AuthService.checkToken, EducationalContentsController.registerEducationalContent);
router.delete('/delete/:id', AuthService.checkToken, EducationalContentsController.deleteEducationalContent);

export { router };