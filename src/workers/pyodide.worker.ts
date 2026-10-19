/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pyodide Web Worker Engine
 * Runs Python code (NumPy, Scikit-learn, Pandas, SciPy, Matplotlib) client-side in a WebAssembly thread
 * without blocking the main React / MUI UI rendering thread.
 */

declare function importScripts(...urls: string[]): void;
declare const loadPyodide: (config?: any) => Promise<any>;

interface WorkerMessageData {
    id: string;
    type: "INIT" | "EXECUTE" | "RUN_CODE" | "RESET" | "INSTALL_PACKAGE" | "WRITE_FILE";
    code?: string;
    packages?: string[];
    packageName?: string;
    filename?: string;
    fileContent?: string;
}

let pyodideInstance: any = null;
let isInitializing = false;

const PYODIDE_CDN_VERSION = "v0.26.4";
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_CDN_VERSION}/full/`;

const DEFAULT_PACKAGES = ["numpy", "pandas", "scipy", "scikit-learn", "matplotlib"];

async function initializePyodideEngine(packages: string[] = DEFAULT_PACKAGES) {
    if (pyodideInstance) {
        return pyodideInstance;
    }
    if (isInitializing) {
        while (isInitializing) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return pyodideInstance;
    }

    isInitializing = true;
    self.postMessage({
        type: "INIT_PROGRESS",
        status: "loading_runtime",
        message: "Mengunduh runtime WebAssembly Pyodide...",
    });

    try {
        // Load Pyodide bootstrap script into Worker context
        importScripts(`${PYODIDE_BASE_URL}pyodide.js`);

        pyodideInstance = await loadPyodide({
            indexURL: PYODIDE_BASE_URL,
        });

        self.postMessage({
            type: "INIT_PROGRESS",
            status: "loading_packages",
            message: `Memuat paket ilmiah dasar (${packages.join(", ")})...`,
        });

        // Load core scientific packages
        if (packages.length > 0) {
            await pyodideInstance.loadPackage(packages);
        }

        // Setup Python stdout & stderr capturing environment with warning suppression
        await pyodideInstance.runPythonAsync(`
import sys
import io
import warnings

# Suppress pandas / sklearn pyarrow deprecation notices
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", message=".*Pyarrow.*")
warnings.filterwarnings("ignore", message=".*pyarrow.*")

class WebWorkerOutputBuffer:
    def __init__(self):
        self.stdout_buffer = io.StringIO()
        self.stderr_buffer = io.StringIO()

    def start_capture(self):
        import warnings
        warnings.filterwarnings("ignore", category=DeprecationWarning)
        warnings.filterwarnings("ignore", category=FutureWarning)
        warnings.filterwarnings("ignore", message=".*Pyarrow.*")
        warnings.filterwarnings("ignore", message=".*pyarrow.*")
        self.stdout_buffer = io.StringIO()
        self.stderr_buffer = io.StringIO()
        sys.stdout = self.stdout_buffer
        sys.stderr = self.stderr_buffer

    def get_stdout(self):
        return self.stdout_buffer.getvalue()

    def get_stderr(self):
        raw_stderr = self.stderr_buffer.getvalue()
        if not raw_stderr:
            return ""
        # Filter out pyarrow deprecation / pandas warning if emitted
        lines = raw_stderr.split("\\n")
        filtered = [
            line for line in lines
            if not any(k in line for k in [
                "Pyarrow will become a required dependency",
                "pandas/issues/54466",
                "performant data types",
                "Arrow string type",
                "next major release of pandas",
                "but was not found to be installed",
                "If this would cause problems for you",
                "please provide us feedback at"
            ])
        ]
        clean_text = "\\n".join(filtered).strip()
        # Clean orphan DeprecationWarning headers
        if clean_text.endswith("DeprecationWarning:") or "DeprecationWarning:" in clean_text and len(clean_text) < 40:
            return ""
        return clean_text

    def reset_capture(self):
        sys.stdout = sys.__stdout__
        sys.stderr = sys.__stderr__

_worker_buffer = WebWorkerOutputBuffer()

# Configure Matplotlib for headless WebWorker execution
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.show = lambda *args, **kwargs: None
except Exception:
    pass
`);

        isInitializing = false;
        self.postMessage({
            type: "INIT_SUCCESS",
            status: "ready",
            message: "Pyodide WebAssembly Engine siap dijalankan.",
        });

        return pyodideInstance;
    } catch (err: any) {
        isInitializing = false;
        self.postMessage({
            type: "INIT_ERROR",
            status: "error",
            error: err?.message || String(err),
        });
        throw err;
    }
}

async function resetKernel(id: string) {
    try {
        if (pyodideInstance) {
            await pyodideInstance.runPythonAsync(`
import sys
# Keep fundamental infrastructure variables and wipe user defined objects
_keep = {'sys', 'io', 'WebWorkerOutputBuffer', '_worker_buffer', '__name__', '__doc__', '__package__', '__loader__', '__spec__', '__annotations__', '__builtins__'}
_user_keys = [k for k in list(globals().keys()) if not k.startswith('_') and k not in _keep]
for k in _user_keys:
    del globals()[k]

# Close any open matplotlib plots
try:
    import matplotlib.pyplot as plt
    plt.close('all')
except Exception:
    pass
`);
        }
        self.postMessage({
            id,
            type: "RESET_SUCCESS",
            status: "ready",
            message: "Python kernel namespace berhasil di-reset.",
        });
    } catch (err: any) {
        self.postMessage({
            id,
            type: "RESET_ERROR",
            status: "ready",
            error: err?.message || String(err),
        });
    }
}

function ensureVfsDirAndWrite(fs: any, filePath: string, content: string) {
    try {
        const dir = filePath.substring(0, filePath.lastIndexOf("/"));
        if (dir) {
            const parts = dir.split("/").filter(Boolean);
            let current = filePath.startsWith("/") ? "" : ".";
            for (const part of parts) {
                current = (current === "." ? "" : current) + "/" + part;
                try {
                    fs.mkdir(current);
                } catch {
                    // directory already exists
                }
            }
        }
        fs.writeFile(filePath, content, { encoding: "utf8" });
    } catch (err) {
        console.warn("[Pyodide Worker] FS write error for:", filePath, err);
    }
}

async function autoMountReferencedDatasets(code: string) {
    if (!pyodideInstance || !pyodideInstance.FS) return;

    // Detect all dataset paths like '/datasets/...', 'datasets/...', or './datasets/...'
    const matches = Array.from(code.matchAll(/['"](\.?\/?datasets\/[^'"]+)['"]/g), (m) => m[1]);
    if (!matches || matches.length === 0) return;

    const uniqueNormalized = Array.from(
        new Set(matches.map((p) => p.replace(/^(\.\/|\/)+/, "")))
    );

    for (const normalized of uniqueNormalized) {
        const absPath = "/" + normalized;
        const homePath = "/home/pyodide/" + normalized;
        const relPath = normalized;

        let alreadyMounted = false;
        try {
            pyodideInstance.FS.stat(absPath);
            alreadyMounted = true;
        } catch {
            alreadyMounted = false;
        }

        if (!alreadyMounted) {
            try {
                const origin = typeof location !== "undefined" ? location.origin : "";
                const url = origin ? `${origin}/${normalized}` : `/${normalized}`;
                const response = await fetch(url);
                if (response.ok) {
                    const text = await response.text();
                    ensureVfsDirAndWrite(pyodideInstance.FS, absPath, text);
                    ensureVfsDirAndWrite(pyodideInstance.FS, homePath, text);
                    ensureVfsDirAndWrite(pyodideInstance.FS, relPath, text);
                }
            } catch (err) {
                console.warn("[Pyodide Worker] Auto-mount dataset failed:", normalized, err);
            }
        }
    }
}

async function executePythonCode(id: string, code: string) {
    const startTime = performance.now();

    try {
        if (!pyodideInstance) {
            await initializePyodideEngine();
        }

        // Auto-mount any referenced CSV datasets before execution
        await autoMountReferencedDatasets(code);

        // Start capturing stdout & stderr in Python
        await pyodideInstance.runPythonAsync("_worker_buffer.start_capture()");

        // Execute user python script
        await pyodideInstance.runPythonAsync(code);

        // Retrieve captured outputs
        const stdout = await pyodideInstance.runPythonAsync("_worker_buffer.get_stdout()");
        const stderr = await pyodideInstance.runPythonAsync("_worker_buffer.get_stderr()");

        // Reset capture hooks back
        await pyodideInstance.runPythonAsync("_worker_buffer.reset_capture()");

        // Check if any matplotlib figures were generated
        const plots: string[] = [];
        try {
            const hasMatplotlib = await pyodideInstance.runPythonAsync("'matplotlib' in sys.modules");
            if (hasMatplotlib) {
                const plotData = await pyodideInstance.runPythonAsync(`
import io
import base64

_plots = []
try:
    import matplotlib.pyplot as plt
    if plt.get_fignums():
        for fig_num in plt.get_fignums():
            fig = plt.figure(fig_num)
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
            buf.seek(0)
            img_b64 = base64.b64encode(buf.read()).decode('utf-8')
            _plots.append(f"data:image/png;base64,{img_b64}")
except Exception:
    pass
finally:
    try:
        import matplotlib.pyplot as plt
        plt.close('all')
    except Exception:
        pass
_plots
`);
                if (plotData && Array.isArray(plotData)) {
                    plots.push(...plotData);
                } else if (plotData && typeof plotData.toJs === "function") {
                    plots.push(...plotData.toJs());
                }
            }
        } catch {
            // Matplotlib plot extraction is optional fallback
        }

        const executionTime = Math.round(performance.now() - startTime);

        let cleanStderr = stderr ? String(stderr).trim() : "";
        if (cleanStderr.includes("Pyarrow") || cleanStderr.includes("DeprecationWarning")) {
            const lines = cleanStderr.split("\n").filter((line) => {
                const l = line.toLowerCase();
                return !(
                    l.includes("pyarrow") ||
                    l.includes("pandas/issues/54466") ||
                    l.includes("performant data types") ||
                    l.includes("arrow string type") ||
                    l.includes("next major release of pandas") ||
                    l.includes("but was not found to be installed") ||
                    l.includes("if this would cause problems for you") ||
                    (l.includes("deprecationwarning") && (l.includes("<exec>") || l.length < 40))
                );
            });
            cleanStderr = lines.join("\n").trim();
        }

        self.postMessage({
            id,
            type: "RUN_SUCCESS",
            output: {
                stdout: stdout || "",
                stderr: cleanStderr,
                executionTime,
                plots,
                status: "success",
            },
        });
    } catch (err: any) {
        const executionTime = Math.round(performance.now() - startTime);

        // Salvage any stdout or stderr already produced before the error
        let capturedStdout = "";
        let capturedStderr = "";
        try {
            capturedStdout = await pyodideInstance?.runPythonAsync("_worker_buffer.get_stdout()");
            capturedStderr = await pyodideInstance?.runPythonAsync("_worker_buffer.get_stderr()");
            await pyodideInstance?.runPythonAsync("_worker_buffer.reset_capture()");
        } catch {
            // Ignore reset error
        }

        const rawError = err?.message || String(err);
        const fullTraceback = err?.stack || "";
        const errorDetails = fullTraceback && fullTraceback.includes("Traceback")
            ? fullTraceback
            : rawError;

        const combinedStderr = capturedStderr
            ? `${capturedStderr}\n${errorDetails}`
            : errorDetails;

        self.postMessage({
            id,
            type: "RUN_ERROR",
            output: {
                stdout: capturedStdout || "",
                stderr: combinedStderr,
                executionTime,
                plots: [],
                status: "error",
                errorDetails,
            },
        });
    }
}

async function installPackage(id: string, packageName: string) {
    try {
        if (!pyodideInstance) {
            await initializePyodideEngine();
        }

        await pyodideInstance.loadPackage("micropip");
        const micropip = pyodideInstance.pyimport("micropip");
        await micropip.install(packageName);

        self.postMessage({
            id,
            type: "INSTALL_SUCCESS",
            packageName,
            message: `Paket '${packageName}' berhasil diinstal.`,
        });
    } catch (err: any) {
        self.postMessage({
            id,
            type: "INSTALL_ERROR",
            packageName,
            error: err?.message || String(err),
        });
    }
}

async function writeFile(id: string, filename: string, content: string) {
    try {
        if (!pyodideInstance) {
            await initializePyodideEngine();
        }

        // Write directly to Pyodide Emscripten Virtual File System
        pyodideInstance.FS.writeFile(filename, content, { encoding: "utf8" });

        self.postMessage({
            id,
            type: "WRITE_FILE_SUCCESS",
            filename,
            message: `File '${filename}' berhasil disimpan di virtual filesystem.`,
        });
    } catch (err: any) {
        self.postMessage({
            id,
            type: "WRITE_FILE_ERROR",
            filename,
            error: err?.message || String(err),
        });
    }
}

// Worker message router
self.onmessage = async (event: MessageEvent<WorkerMessageData>) => {
    const { id, type, code, packages, packageName, filename, fileContent } = event.data;

    switch (type) {
        case "INIT":
            await initializePyodideEngine(packages);
            break;
        case "EXECUTE":
        case "RUN_CODE":
            if (code) {
                await executePythonCode(id, code);
            }
            break;
        case "RESET":
            await resetKernel(id);
            break;
        case "INSTALL_PACKAGE":
            if (packageName) {
                await installPackage(id, packageName);
            }
            break;
        case "WRITE_FILE":
            if (filename && fileContent !== undefined) {
                await writeFile(id, filename, fileContent);
            }
            break;
        default:
            console.warn("[Pyodide Worker] Unknown message type:", type);
    }
};

export {};
