const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PROJECT_EXE_PATH = path.resolve(__dirname, '../../project.exe');

app.post('/run', (req, res) => {
    const { input, seed, modSeed } = req.body;
    
    const args = [];
    if (seed !== undefined) args.push(seed.toString());
    if (modSeed !== undefined) args.push(modSeed.toString());

    console.log(`[Backend] Executing with BaseSeed: ${seed}`);
    console.log(`[Backend] Args: ${args.join(' ')}`);

    const child = spawn(PROJECT_EXE_PATH, args);
    
    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    child.stderr.on('data', (data) => {
        stderrData += data.toString();
    });

    child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
        res.json({ output: stdoutData, error: stderrData, exitCode: code });
    });

    // Write input to stdin
    try {
        if (input) {
            child.stdin.write(input);
        }
        child.stdin.end();
    } catch (err) {
        console.error('Error writing to stdin:', err);
        res.status(500).json({ error: 'Failed to write to process stdin' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Target executable: ${PROJECT_EXE_PATH}`);
});
