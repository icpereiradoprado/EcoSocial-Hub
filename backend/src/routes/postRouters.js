import { Router } from "express";
import PostController from "../controller/PostController.js";
import AuthService from "../services/AuthService.js";

const router = Router();

//GET
router.get('/:offset', AuthService.checkToken, PostController.getAllPost);

//POST
router.post('/register', AuthService.checkToken, PostController.registerPost);
router.post('/up', AuthService.checkToken, PostController.upVote);
router.post('/down', AuthService.checkToken, PostController.downVote);

//DELETE
router.delete('/delete/:id', AuthService.checkToken, PostController.deletePost);

//PATCH
router.patch('/edit/:id', AuthService.checkToken, PostController.editPost);

export { router }