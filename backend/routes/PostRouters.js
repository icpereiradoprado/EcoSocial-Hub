import { Router } from "express";
import Post from "../models/Post.js";

const router = new Router();

router.put('/changetitle', Post.changeTitle);
router.get('/:id', Post.getPost);

export { router }