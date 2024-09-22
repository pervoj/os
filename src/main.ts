import { addRepository } from "./utils/repos";

console.log("Adding Docker Repository...");
await addRepository("https://download.docker.com/linux/fedora/docker-ce.repo");
