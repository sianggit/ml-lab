import { ExecutionOutput } from "@/models/ml-lab/chapter.model";

export type PyodideStatus = "uninitialized" | "loading" | "ready" | "running" | "error";

export interface StatusUpdate {
    status: PyodideStatus;
    message?: string;
}

type StatusListener = (update: StatusUpdate) => void;

class PyodideBridgeService {
    private worker: Worker | null = null;
    private status: PyodideStatus = "uninitialized";
    private statusMessage = "Engine belum diinisialisasi";
    private listeners: Set<StatusListener> = new Set();
    private pendingRuns: Map<
        string,
        {
            resolve: (output: ExecutionOutput) => void;
            reject: (err: Error) => void;
        }
    > = new Map();
    private pendingInstalls: Map<
        string,
        {
            resolve: (msg: string) => void;
            reject: (err: Error) => void;
        }
    > = new Map();
    private pendingResets: Map<
        string,
        {
            resolve: () => void;
            reject: (err: Error) => void;
        }
    > = new Map();
    private pendingWrites: Map<
        string,
        {
            resolve: () => void;
            reject: (err: Error) => void;
        }
    > = new Map();
    private initPromise: Promise<void> | null = null;

    /**
     * Subscribe to engine status changes (e.g. for Topbar badges, execution spinners)
     */
    public subscribe(listener: StatusListener): () => void {
        this.listeners.add(listener);
        listener({ status: this.status, message: this.statusMessage });
        return () => {
            this.listeners.delete(listener);
        };
    }

    public getStatus(): PyodideStatus {
        return this.status;
    }

    public getStatusMessage(): string {
        return this.statusMessage;
    }

    private updateStatus(newStatus: PyodideStatus, message?: string) {
        this.status = newStatus;
        if (message) {
            this.statusMessage = message;
        }
        const payload: StatusUpdate = { status: this.status, message: this.statusMessage };
        this.listeners.forEach((listener) => {
            try {
                listener(payload);
            } catch (err) {
                console.error("[PyodideBridge] Error in status listener:", err);
            }
        });
    }

    /**
     * Lazy-inits the Web Worker instance
     */
    public async init(packages: string[] = ["numpy", "pandas", "scipy", "scikit-learn", "matplotlib"]): Promise<void> {
        if (typeof window === "undefined") {
            return;
        }

        if (this.status === "ready") {
            return;
        }

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise<void>((resolve, reject) => {
            this.updateStatus("loading", "Memulai Pyodide WebAssembly Worker...");

            try {
                if (!this.worker) {
                    this.worker = new Worker(
                        new URL("../../workers/pyodide.worker.ts", import.meta.url),
                        { type: "module" }
                    );

                    this.worker.onmessage = this.handleWorkerMessage.bind(this);
                    this.worker.onerror = (err) => {
                        this.initPromise = null;
                        console.error("[Pyodide Worker Error]", err);
                        this.updateStatus("error", "Terjadi kesalahan fatal pada Web Worker.");
                        reject(new Error(err.message || "Worker error"));
                    };
                }

                // Send INIT message
                const initId = "init_" + Date.now();
                const initHandler = (event: MessageEvent) => {
                    const data = event.data;
                    if (data?.type === "INIT_SUCCESS") {
                        this.updateStatus("ready", "Pyodide WebAssembly Engine Siap");
                        this.worker?.removeEventListener("message", initHandler);
                        resolve();
                    } else if (data?.type === "INIT_ERROR") {
                        this.initPromise = null;
                        this.updateStatus("error", data.error || "Gagal memuat Pyodide.");
                        this.worker?.removeEventListener("message", initHandler);
                        reject(new Error(data.error || "Failed to load Pyodide"));
                    }
                };

                this.worker.addEventListener("message", initHandler);
                this.worker.postMessage({
                    id: initId,
                    type: "INIT",
                    packages,
                });
            } catch (err) {
                this.initPromise = null;
                const message = err instanceof Error ? err.message : String(err);
                this.updateStatus("error", `Gagal menginisialisasi Worker: ${message}`);
                reject(err);
            }
        });

        return this.initPromise;
    }

    private handleWorkerMessage(event: MessageEvent) {
        const data = event.data;
        if (!data) return;

        const { id, type, output, message, error } = data;

        if (type === "INIT_PROGRESS") {
            this.updateStatus("loading", message);
            return;
        }

        if (type === "RUN_SUCCESS") {
            const pending = this.pendingRuns.get(id);
            if (pending) {
                this.pendingRuns.delete(id);
                this.updateStatus("ready", "Eksekusi selesai.");
                pending.resolve(output);
            }
            return;
        }

        if (type === "RUN_ERROR") {
            const pending = this.pendingRuns.get(id);
            if (pending) {
                this.pendingRuns.delete(id);
                this.updateStatus("ready", "Eksekusi menghasilkan error.");
                pending.resolve(output);
            }
            return;
        }

        if (type === "RESET_SUCCESS") {
            const pending = this.pendingResets.get(id);
            if (pending) {
                this.pendingResets.delete(id);
                this.updateStatus("ready", "Kernel berhasil di-reset.");
                pending.resolve();
            }
            return;
        }

        if (type === "RESET_ERROR") {
            const pending = this.pendingResets.get(id);
            if (pending) {
                this.pendingResets.delete(id);
                this.updateStatus("ready", "Gagal me-reset kernel.");
                pending.reject(new Error(error || "Gagal me-reset kernel"));
            }
            return;
        }

        if (type === "INSTALL_SUCCESS") {
            const pending = this.pendingInstalls.get(id);
            if (pending) {
                this.pendingInstalls.delete(id);
                this.updateStatus("ready", message);
                pending.resolve(message);
            }
            return;
        }

        if (type === "INSTALL_ERROR") {
            const pending = this.pendingInstalls.get(id);
            if (pending) {
                this.pendingInstalls.delete(id);
                this.updateStatus("ready", `Gagal install: ${error}`);
                pending.reject(new Error(error));
            }
            return;
        }

        if (type === "WRITE_FILE_SUCCESS") {
            const pending = this.pendingWrites.get(id);
            if (pending) {
                this.pendingWrites.delete(id);
                this.updateStatus("ready", message || "File berhasil dimuat.");
                pending.resolve();
            }
            return;
        }

        if (type === "WRITE_FILE_ERROR") {
            const pending = this.pendingWrites.get(id);
            if (pending) {
                this.pendingWrites.delete(id);
                this.updateStatus("ready", `Gagal memuat file: ${error}`);
                pending.reject(new Error(error || "Gagal menyimpan file ke virtual filesystem"));
            }
            return;
        }
    }

    /**
     * Executes Python source code asynchronously in the Web Worker
     */
    public async runCode(code: string): Promise<ExecutionOutput> {
        if (typeof window === "undefined") {
            return {
                stdout: "",
                stderr: "Pyodide hanya dapat dijalankan di lingkungan browser.",
                executionTime: 0,
                plots: [],
                status: "error",
            };
        }

        const runId = "run_" + Math.random().toString(36).slice(2, 9);
        this.updateStatus("running", "Menjalankan skrip Python...");

        if (this.status !== "ready") {
            await this.init();
            this.updateStatus("running", "Menjalankan skrip Python...");
        }

        return new Promise<ExecutionOutput>((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (this.pendingRuns.has(runId)) {
                    this.pendingRuns.delete(runId);
                    this.updateStatus("ready", "Waktu eksekusi habis (timeout).");
                    reject(
                        new Error(
                            "Eksekusi terhenti: Skrip Python melebihi batas waktu (timeout). Periksa kemungkinan infinite loop."
                        )
                    );
                }
            }, 120000); // 2 minutes maximum runtime safeguard

            this.pendingRuns.set(runId, {
                resolve: (output) => {
                    clearTimeout(timeout);
                    resolve(output);
                },
                reject: (err) => {
                    clearTimeout(timeout);
                    reject(err);
                },
            });

            this.worker?.postMessage({
                id: runId,
                type: "EXECUTE",
                code,
            });
        });
    }

    /**
     * Forcefully terminates the Web Worker to stop any running execution
     */
    public terminateWorker(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.initPromise = null;
        this.pendingRuns.forEach(({ reject }) => {
            reject(new Error("Eksekusi dibatalkan: Worker dihentikan paksa."));
        });
        this.pendingRuns.clear();
        this.pendingInstalls.clear();
        this.pendingResets.clear();
        this.pendingWrites.clear();
        this.updateStatus("uninitialized", "Kernel dihentikan oleh pengguna.");
    }

    /**
     * Clears Python user global variables and releases open plots
     */
    public async resetKernel(): Promise<void> {
        if (typeof window === "undefined" || !this.worker) {
            return;
        }

        const resetId = "rst_" + Math.random().toString(36).slice(2, 9);
        this.updateStatus("loading", "Mereset kernel Python...");

        return new Promise<void>((resolve, reject) => {
            this.pendingResets.set(resetId, { resolve, reject });

            this.worker?.postMessage({
                id: resetId,
                type: "RESET",
            });
        });
    }

    /**
     * Dynamically installs a pure-Python wheel via micropip
     */
    public async installPackage(packageName: string): Promise<string> {
        if (this.status !== "ready") {
            await this.init();
        }

        const installId = "inst_" + Math.random().toString(36).slice(2, 9);
        this.updateStatus("loading", `Menginstal paket ${packageName}...`);

        return new Promise<string>((resolve, reject) => {
            this.pendingInstalls.set(installId, { resolve, reject });

            this.worker?.postMessage({
                id: installId,
                type: "INSTALL_PACKAGE",
                packageName,
            });
        });
    }

    /**
     * Mounts a file (e.g. CSV dataset) directly into Pyodide virtual filesystem
     */
    public async mountFile(filename: string, content: string): Promise<void> {
        if (typeof window === "undefined") {
            return;
        }

        if (this.status !== "ready") {
            await this.init();
        }

        const writeId = "wr_" + Math.random().toString(36).slice(2, 9);
        this.updateStatus("loading", `Memuat data '${filename}' ke Pyodide runtime...`);

        return new Promise<void>((resolve, reject) => {
            this.pendingWrites.set(writeId, { resolve, reject });

            this.worker?.postMessage({
                id: writeId,
                type: "WRITE_FILE",
                filename,
                fileContent: content,
            });
        });
    }
}

// Export singleton instance
export const pyodideBridge = new PyodideBridgeService();
