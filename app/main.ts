// Librarys
import express from "express";
import cors from "cors";
// Modules
import {
    deleteLink,
    getAllLinks,
    getLinkById,
    saveLink,
} from "./database_connection.js";

import {
    HOME_URL,
    HOST,
    PORT,
    VITE_AUTH_TOKEN,
} from "./utils/globalVariables.js";

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

// Hook to handle the authorization
app.use((req, res, next) => {
    const PRIVATE_ROUTES = ["/get/links", "/delete", "/create"];

    // Extrai a URL atual
    const currentURL = req.url;

    // Verifica se a URL atual corresponde a algum padrão na lista
    const isAccessingPrivateRoutes = PRIVATE_ROUTES.some((route) => {
        return currentURL.includes(route);
    });

    if (isAccessingPrivateRoutes) {
        const auth = req.headers.authorization;

        if (auth === VITE_AUTH_TOKEN) {
            next();
        } else {
            return res.status(401).send();
        }
    }
    next();
});

// Endpoint to get all the links with limit
app.get("/get/links", async (req, res) => {
    const limit = req.query.limit;

    const links = await getAllLinks(Number(limit));
    if (links) {
        return res.status(200).send(links);
    } else {
        return res.status(404).send(null);
    }
});

// Endpoint to get one link
app.get("/get/links/:id", async (req, res) => {
    const { id } = req.params as { id: string };

    const link = await getLinkById(id);
    if (link) {
        return res.status(200).send(link);
    } else {
        return res.status(404).send(null);
    }
});

// Endpoint to create a link
app.post("/create", async (req, res) => {
    const { originalLink } = req.body as {
        originalLink: string;
    };

    if (!originalLink) {
        return res.status(400).send(null);
    }

    const link = await saveLink(originalLink);
    if (link) {
        return res.status(201).send(link);
    } else {
        return res.status(500).send(null);
    }
});

// Endpoint to delete a link
app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params as { id: string };

    const link = await deleteLink(id);
    if (!link) {
        return res.status(404).send(null);
    } else {
        return res.status(204).send();
    }
});

// Endpoint to redirect
app.get("/r/:id", async (req, res) => {
    const { id } = req.params as { id: string };

    const link = await getLinkById(id);
    return res.status(307).redirect(link?.original_link ?? HOME_URL);
});

app.listen(PORT, HOST, () => {
    console.log(`Server started at ${HOST}:${PORT}`);
});
