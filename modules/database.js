//throws errors if something messes up
"use strict";
//require bettter sqlite
const Database = require("better-sqlite3");
const db = new Database("log.db");

//initialize a Database
function initDatabase() {
    //const stmt = db.prepare(`SELECT NAME FROM sqlite_master WHERE type='table' and name='accesslog';`);
    const createTable = `CREATE TABLE IF NOT EXISTS accesslog (
                            remoteaddr TEXT,
                            remoteuser TEXT,
                            time INTEGER,
                            method TEXT,
                            url TEXT,
                            protocol TEXT,
                            httpversion TEXT,
                            status INTEGER,
                            referer TEXT,
                            useragent TEXT
                        );`;
    db.exec(createTable);
}

function insertRow(logdata) {
    const insert = `INSERT INTO accesslog (
                        remoteaddr,
                        remoteuser,
                        time,
                        method,
                        url,
                        protocol,
                        httpversion,
                        status,
                        referer,
                        useragent
                    ) VALUES (
                        '${logdata.remoteaddr}',
                        '${logdata.remoteuser}',
                        ${logdata.time},
                        '${logdata.method}',
                        '${logdata.url}',
                        '${logdata.protocol}',
                        '${logdata.httpversion}',
                        ${logdata.status},
                        '${logdata.referer}',
                        '${logdata.useragent}'
                    );`;
    db.exec(insert);
}

// Get all rows for download
function getAll() {
    const select = db.prepare(`SELECT * FROM accesslog`);
    return select.all();
}

// Export functions
module.exports = { initDatabase, insertRow, getAll };