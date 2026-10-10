"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { pyodideBridge, PyodideStatus } from "@/services/ml-lab/pyodide-bridge.service";
import { ExecutionOutput } from "@/models/ml-lab/chapter.model";

export type KernelState = "idle" | "loading_kernel" | "ready" | "executing" | "error";

export interface UsePyodideKernelReturn {
    status: KernelState;
    statusMessage: string;
    isReady: boolean;
    isExecuting: boolean;
    lastOutput: ExecutionOutput | null;
    runCode: (code: string) => Promise<ExecutionOutput>;
    resetKernel: () => Promise<void>;
    initKernel: () => Promise<void>;
}

export function usePyodideKernel(): UsePyodideKernelReturn {
    const [rawStatus, setRawStatus] = useState<PyodideStatus>(pyodideBridge.getStatus());
    const [statusMessage, setStatusMessage] = useState<string>(pyodideBridge.getStatusMessage());
    const [lastOutput, setLastOutput] = useState<ExecutionOutput | null>(null);
    const [isLocalExecuting, setIsLocalExecuting] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        const unsubscribe = pyodideBridge.subscribe((update) => {
            if (isMounted.current) {
                setRawStatus(update.status);
                if (update.message) {
                    setStatusMessage(update.message);
                }
            }
        });

        return () => {
            isMounted.current = false;
            unsubscribe();
        };
    }, []);

    const mapStatusToKernelState = (status: PyodideStatus): KernelState => {
        switch (status) {
            case "uninitialized":
                return "idle";
            case "loading":
                return "loading_kernel";
            case "ready":
                return "ready";
            case "running":
                return "executing";
            case "error":
                return "error";
            default:
                return "idle";
        }
    };

    const kernelState = isLocalExecuting ? "executing" : mapStatusToKernelState(rawStatus);

    const initKernel = useCallback(async () => {
        try {
            await pyodideBridge.init();
        } catch (err) {
            console.error("[usePyodideKernel] init error:", err);
        }
    }, []);

    const runCode = useCallback(async (code: string): Promise<ExecutionOutput> => {
        setIsLocalExecuting(true);
        try {
            const output = await pyodideBridge.runCode(code);
            if (isMounted.current) {
                setLastOutput(output);
            }
            return output;
        } catch (err: unknown) {
            const errStr = err instanceof Error ? err.message : String(err);
            const errOutput: ExecutionOutput = {
                stdout: "",
                stderr: errStr,
                executionTime: 0,
                plots: [],
                status: "error",
                errorDetails: errStr,
            };
            if (isMounted.current) {
                setLastOutput(errOutput);
            }
            return errOutput;
        } finally {
            if (isMounted.current) {
                setIsLocalExecuting(false);
            }
        }
    }, []);

    const resetKernel = useCallback(async () => {
        try {
            await pyodideBridge.resetKernel();
            if (isMounted.current) {
                setLastOutput(null);
            }
        } catch (err) {
            console.error("[usePyodideKernel] reset error:", err);
        }
    }, []);

    return {
        status: kernelState,
        statusMessage,
        isReady: rawStatus === "ready",
        isExecuting: rawStatus === "running" || isLocalExecuting,
        lastOutput,
        runCode,
        resetKernel,
        initKernel,
    };
}
