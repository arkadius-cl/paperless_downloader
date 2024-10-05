const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { Command } = require("commander");

const program = new Command();

program
  .option("-u, --url <type>", "Paperless instance URL")
  .option("-t, --token <type>", "API token")
  .option(
    "-d, --documents <ids>",
    "Document IDs to download, separated by commas",
    (value) => value.split(",").map(Number)
  );

program.parse(process.argv);

const options = program.opts();

if (!options.url) {
  console.error("Paperless instance URL is required.");
  program.help();
  process.exit(1);
}

if (!options.token) {
  console.error("API token is required.");
  program.help();
  process.exit(1);
}

async function getDocumentCount() {
  try {
    const response = await axios.get(`${options.url}/api/documents/`, {
      headers: {
        Authorization: `Token ${options.token}`,
      },
    });
    return response.data.count;
  } catch (error) {
    console.error("Error fetching document count:", error.message);
    process.exit(1);
  }
}

async function downloadFiles() {
  const documentCount = options.documents
    ? options.documents.length
    : await getDocumentCount();
  const documentIds =
    options.documents || Array.from({ length: documentCount }, (_, i) => i + 1);

  for (let document_id of documentIds) {
    const url = `${options.url}/api/documents/${document_id}/download/`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${options.token}`,
        },
        responseType: "arraybuffer",
      });

      const contentDisposition = response.headers["content-disposition"];
      let filename = `document_${document_id}.pdf`;

      if (contentDisposition) {
        const filenameStarMatch = contentDisposition.match(
          /filename\*=[^']*''([^;]+)/
        );
        const filenameMatch = contentDisposition.match(
          /filename="?(.+?)"?(\s|$)/
        );

        if (filenameStarMatch && filenameStarMatch[1]) {
          filename = decodeURIComponent(filenameStarMatch[1]);
        } else if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const filePath = path.resolve("./downloads/", filename);
      fs.writeFileSync(filePath, response.data, "binary");

      console.log(`Downloaded ${filename} as document ${document_id}`);
    } catch (error) {
      console.error(
        `Error downloading document ${document_id}: ${error.message}`
      );
    }
  }
}

downloadFiles();
