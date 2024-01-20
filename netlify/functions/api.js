import express, { Router } from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";

const api = express();
const router = Router();

const helloProxy = (req, res) => res.send("Hello World!");
const newsProxy = async (req, res, next) => {
  const apiKey = process.env.API_KEY;
  const apiUrl = process.env.API_URL;
  const country = req.query.country;
  const category = req.query.category;

  if (!country && !category) {
    res.status(404).json({ message: "No query found!" });
    return;
  }

  try {
    const response = await fetch(
      `${apiUrl}?country=${country}&category=${category}`,
      { headers: { Authorization: apiKey } }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message, 500);
    next(error);
  }
};

router.get("/news", newsProxy);
router.get("/hello", helloProxy);

api.use("/api/", router);

export const handler = serverless(api);
