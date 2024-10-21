const path = require('path');
const fs = require('fs');
const query = require('./database');

async function sqlFileRunner() {
    try {
        const releasesFolder = path.join(__dirname, 'releases');
        const files = fs.readdirSync(releasesFolder);

        for (const file of files) {
            // Ensure we only read .sql files
            if (path.extname(file) === '.sql') {
                const data = await query(`SELECT * FROM releases WHERE file_name = ?`, [file]);
                // Only execute the file if it hasn't been executed before
                if (!data[0]?.file_name != file) {
                    const filePath = path.join(releasesFolder, file);
                    const sql = fs.readFileSync(filePath, 'utf8').trim();

                    console.log(`Executing ${file}...`);
                    await query(sql);

                    await query(`INSERT INTO releases(file_name) VALUES(?)`, [file]);
                    console.log(`${file} executed successfully.`);
                } else {
                    console.log(`${file} has already been executed.`);
                }
            }
        }
    } catch (error) {
        console.error('Error in sqlFileRunner:', error.message);
        throw new Error('Error executing SQL files');
    }
}

async function runReleases() {
    try {
        // Check if releases table exists and create it if not
        await query(`SELECT * FROM releases`);
        await sqlFileRunner();
        process.exit();
    } catch (error) {
        if (error.message.includes("table doesn't exist")) {
            console.log("Releases table doesn't exist, creating a new one.");
            await query(`
                CREATE TABLE releases (
                    file_id INT AUTO_INCREMENT PRIMARY KEY,
                    file_name VARCHAR(50) NOT NULL
                )
            `);
            await sqlFileRunner();
        } else {
            console.error('Error in runReleases:', error.message);
            throw new Error("Releases error");
        }
    }
}

runReleases();
