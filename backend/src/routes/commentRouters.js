import { Router } from "express";
import AuthService from "../services/AuthService.js";
import CommentCotroller from "../controller/CommentController.js";

const router = Router();

//POST
router.post('/register', AuthService.checkToken, CommentCotroller.registerComment);

//PATCH
router.patch('/edit/:id', AuthService.checkToken, CommentCotroller.editComment);

//DELETE
router.delete('/delete/:id', AuthService.checkToken, CommentCotroller.deleteComment);

//GET
router.get('/:postId', AuthService.checkToken, CommentCotroller.getAllComment);

export { router }