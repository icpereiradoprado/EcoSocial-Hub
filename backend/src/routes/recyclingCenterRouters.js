import { Router } from 'express'
import RecyclingCenterController from '../controller/RecyclingCenterController.js';
import AuthService from '../services/AuthService.js';


const router = Router();

//Rotas GET
router.get('/', AuthService.checkToken, RecyclingCenterController.getAllRecyclingCenter);

//Rotas POST
router.post('/register', AuthService.checkToken, RecyclingCenterController.registerRecyclingCenter);
router.delete('/delete/:id', AuthService.checkToken, RecyclingCenterController.deleteRecyclingCenter);

//Rotas PATCH
router.patch('/edit/:id', AuthService.checkToken, RecyclingCenterController.editRecyclingCenter);

export { router };