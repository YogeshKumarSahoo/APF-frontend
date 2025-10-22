const { google } = require('googleapis');

// Environment variables - these should be set in your .env file
const GOOGLE_SHEETS_SERVICE_ACCOUNT = "apf-branch-reg@project-apf-gs.iam.gserviceaccount.com";
const GOOGLE_SHEETS_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJCj0qFLulj5te\nG6lTofcXewIfPg1pMPuEkyUjkFVXURjeBSa5HjARQkhQKpmr2Eew+pYm0fwntjOY\n7SnmRJUaqreVyI6K8h4be9FQYbcqJMgXnaeaUCjkznRvyGvTAfkEun3Ku3sBKlj+\n076ZkbpsAyS48CEJm6VELigAmAUUBL39oIEX2T9uaUt5xlYKdevuXVovaQZKl8CL\n82C9Q3SJ17TG2RE9sTM5bGSPQ5NSHR2QeoPrKlqp/xdhyyZ/alasURGowxEKioZd\nid5ScZZIPfV5T/DhRxHrIR3Kv/BxQhrc4TNEwKpAC50SBGqbTOKqcAsEH3Yhioeu\nl414MZQzAgMBAAECggEAE03lY6YMArDQdW/oiXxS8rFAGenmdcRbUnaiqVCRsUm7\nPo52Em6ApRedQ/1jNioVcDwPsPiW4uVO/Q9A57iMLLxZ1oskjNkE5RS1m6dWZDiV\n8haUYm/yDU55xcYT/HYDCF4z+ASaohkD5KxGcA6bPQXsP8nnEjoc23gnJS9zxWEn\nn7shD0Ch6irysnZZ2vA9T4xNBwaY9yWxy1dr0fpKxlIqq2HYi6QOEDtVmJNsjfhC\n1tUODnKGgRP7qc2+qUokxWVeMh1c/iqGu5v2qckheUFrPlQhEAq6fvnM5IwIdujh\nJelmYGuFXQpuOACyvrRevnL2g5+O59dSAAvIMYqQwQKBgQDjYGPd4OCNrWaFJ9aI\nDK3N3AVsD6G9639uJnlEje574JkDdFiwwhVq8KyGBDicHraKHlVLEcjhRvkhaMOD\n4uhCSsWqa+at9ZjVI4JEJNwFnLPadVSSKUIxGxQ4VzXdksvSbIJcS6J9RRrKa1Nb\nfl7avebQOmBdYrqs72amCWDX4QKBgQDiWRuSuUhMbYpyyX5gJKsFYzDQK5dHz/Sb\nam5jPKE3SJdgLwxRxwu0lVV/b8lNd6D1r0BRzmoE2rmdYVEqe0fIU/OkcRJIqKxW\nOECLGI+dgmAk3tNn/Keoe5Ydnc8bftmKRJOMqGmlaUYJgtCtgUhx0lmYP0S1l3cO\nZUv8vHFekwKBgQCB5xXnM4zXJJQHywTT4XqCvAsU+7FKUfsRsUVjFzuC5oRE5vms\nspWN7UaDonG9MAbVzhKoutZrbiLzJWleNgq/pPxdKxw1krToQEsyJ2TUh/xw+MuC\nXbQFXhUlQx3xIubzpy6rEEMbEpoFv192TDJhAlGV8WQQtlE0b+nTPlRnwQKBgBfG\njGLpG3MLvpM4HxIyR9SVCreTHJzqdyMsFtRNthF8iooL5xtf8RbS6Nwt/dMpUbr8\n4aC2MeS4pO6nHkN8F5ovV1RanDUNoqyb1AvIVK2S2E6HKWWu4F2OPcJ2pR6aQHeJ\npIYN2qsJV9X/67ON9PIfylF3s9vvQQ4+DbFKig4JAoGBAK2/okUp+MJ7whCbiQRY\noYbS+cBoLUovfgnuOf/xmEFwICrL69/ct+IEHB+c9Llulijo+MSMJP3H8EzvWoJ0\n1WU+8XAeiWO5N/g2gC2d0NRVhoFBNv2uPFH7+2MInawPWiXl1b5t5R+Rf9iPHwSI\nqOI41ehj0OPUDVQTQ4PG/StH\n-----END PRIVATE KEY-----\n";
const SPREADSHEET_ID = "1o8G61BSMP7guS1ymM5cMk9CL8VDrvsMD2ex4x7Mwj48";
const SHEET_NAME = 'BranchLocations';

// Validate required environment variables
function validateEnvironment() {
    const required = [
        'GOOGLE_SHEETS_SERVICE_ACCOUNT',
        'GOOGLE_SHEETS_PRIVATE_KEY',
        'SPREADSHEET_ID'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

// Get Google Sheets client using service account
function getGoogleSheetsClient() {
    validateEnvironment();
    
    // Format the private key properly
    let privateKey = GOOGLE_SHEETS_PRIVATE_KEY;
    
    // Clean up the private key format
    privateKey = privateKey.trim();
    
    // Remove leading quote
    if (privateKey.startsWith('"')) {
        privateKey = privateKey.substring(1);
    }
    
    // Remove trailing quote and comma
    if (privateKey.endsWith('",')) {
        privateKey = privateKey.substring(0, privateKey.length - 2);
    } else if (privateKey.endsWith('"')) {
        privateKey = privateKey.substring(0, privateKey.length - 1);
    }
    
    // Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // Clean up any remaining whitespace
    privateKey = privateKey.trim();

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_SHEETS_SERVICE_ACCOUNT,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return google.sheets({ version: 'v4', auth });
    } catch (error) {
        console.error('Error creating Google Auth:', error);
        throw new Error(`Failed to create Google Auth: ${error.message}`);
    }
}

// Append row to Google Sheet using googleapis library
async function appendRowToSheet(rowData) {
    try {
        const sheets = getGoogleSheetsClient();
        
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:H`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowData]
            },
        });

        console.log(`${response.data.updates.updatedCells} cells appended.`);
        return response.data;
        
    } catch (error) {
        console.error('Error appending to sheet:', error);
        throw new Error(`Failed to append to sheet: ${error.message}`);
    }
}

module.exports = {
    appendRowToSheet,
    validateEnvironment
};
