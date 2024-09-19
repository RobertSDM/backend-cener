import { PrismaClient } from "@prisma/client";
import { SERVER_URL } from "./utils/globalVariables.js";

const prisma = new PrismaClient();

const LOWER_UPPER_CASE = [
    { min: 65, max: 90 },
    { min: 97, max: 122 },
];
let chossen_spectrum;

// SUID (Small Unique ID)
const generateSUID = (link: string): string => {
    let sid = "";

    const splitedLink = link.split("/");
    const halfLenLink = Math.floor(
        (splitedLink[splitedLink.length - 1].length +
            splitedLink[splitedLink.length - 2].length) /
            2
    );

    sid += Math.floor(Math.random() * (99 - halfLenLink) + halfLenLink);

    sid +=
        splitedLink[2][
            Math.floor(Math.random() * splitedLink[2].length)
        ].toUpperCase();

    sid +=
        splitedLink[splitedLink.length - 1][
            Math.floor(Math.random() * splitedLink.length)
        ] +
        splitedLink[splitedLink.length - 1][
            Math.floor(Math.random() * splitedLink.length)
        ];

    chossen_spectrum = LOWER_UPPER_CASE[Math.floor(Math.random() * 2)];

    sid += String.fromCodePoint(Math.floor(Math.random() * (57 - 48) + 48));

    sid += String.fromCodePoint(
        Math.floor(
            Math.random() * (chossen_spectrum.max - chossen_spectrum.min) +
                chossen_spectrum.min
        )
    );

    chossen_spectrum = LOWER_UPPER_CASE[Math.floor(Math.random() * 2)];
    sid += String.fromCodePoint(
        Math.floor(
            Math.random() * (chossen_spectrum.max - chossen_spectrum.min) +
                chossen_spectrum.min
        )
    );

    return sid;
};

const getAllLinks = async (limit: number) => {
    try {
        const links = await prisma.links.findMany({
            take: limit || 10,
        });
        return links;
    } catch {
        return null;
    }
};

const getLinkById = async (id: string) => {
    try {
        const link = await prisma.links.findUnique({
            where: {
                id: id,
            },
        });
        return link;
    } catch {
        return null;
    }
};

const saveLink = async (link: string) => {
    const generatedId = generateSUID(link);
    try {
        const createdLink = prisma.links.create({
            data: {
                id: generatedId,
                shortened_link: `${SERVER_URL}/r/${generatedId}`,
                original_link: link,
            },
        });
        return createdLink;
    } catch {
        return null;
    }
};

const deleteLink = async (id: string) => {
    try {
        const deletedLink = await prisma.links.delete({
            where: {
                id: id,
            },
        });
        return deletedLink;
    } catch (err) {
        return null;
    }
};

export { getLinkById, getAllLinks, saveLink, deleteLink };
