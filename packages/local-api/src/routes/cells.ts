import express from "express";
import path from "path";
import { promises } from "fs";
const { readFile, writeFile } = promises;

interface Cell {
	id: string;
	content: string;
	type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
	const router = express.Router();
	router.use(express.json());

	const fullPath = path.join(dir, filename);

	router.get("/cells", async (req, res) => {
		try {
			const result = await readFile(fullPath, { encoding: "utf-8" });
			res.send(JSON.parse(result));
		} catch (err: any) {
			if (err.code === "ENOENT") {
				await writeFile(fullPath, "[]", "utf-8");
				res.send([]);
			} else {
				throw err;
			}
		}
	});

	router.post("/cells", async (req, res) => {
		const { cells }: { cells: Cell[] } = req.body;
		await writeFile(fullPath, JSON.stringify(cells), "utf-8");
		res.send({ status: "ok" });
	});

	return router;
};
