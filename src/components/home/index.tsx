"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import IconComponent from "@/shared/components/icon";
import { homeStyles } from "./home.styles";

/* ─── Seeded PRNG for Deterministic Motifs & Initial Particles ─── */
function rng(s: number) {
    return function () {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

/* ─── Procedural SVG Motifs ───────────────────────────────────── */
function SvgMotif1() {
    const r = rng(3);
    const cw = 26;
    const ch = 22;
    const cols = 14;
    const rows = 6;
    const ox = (420 - cols * cw) / 2;
    const oy = (190 - rows * ch) / 2;
    const rects: Array<{ x: number; y: number; isMissing: boolean; opacity?: number }> = [];

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const v = r();
            const x = ox + i * cw + 2;
            const y = oy + j * ch + 2;
            if (v < 0.09) {
                rects.push({ x, y, isMissing: true });
            } else {
                rects.push({ x, y, isMissing: false, opacity: +(0.05 + v * 0.4).toFixed(2) });
            }
        }
    }

    return (
        <svg viewBox="0 0 420 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {rects.map((rc, idx) =>
                rc.isMissing ? (
                    <rect
                        key={idx}
                        x={rc.x}
                        y={rc.y}
                        width={cw - 4}
                        height={ch - 4}
                        fill="none"
                        stroke="#43D9A3"
                        strokeDasharray="2 3"
                        strokeOpacity={0.8}
                    />
                ) : (
                    <rect
                        key={idx}
                        x={rc.x}
                        y={rc.y}
                        width={cw - 4}
                        height={ch - 4}
                        fill="#67D9FF"
                        fillOpacity={rc.opacity}
                    />
                )
            )}
        </svg>
    );
}

function SvgMotif2() {
    const r = rng(11);
    const points: Array<{ cx: number; cy: number; side: boolean }> = [];

    for (let i = 0; i < 46; i++) {
        const a = r() * 250 + 25;
        const b = r() * 140 + 25;
        const side = a * 0.62 + b > 165 + 22 * (r() - 0.5) * 2;
        points.push({ cx: a, cy: 190 - b, side });
    }

    return (
        <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <line x1={40} y1={165} x2={265} y2={25} stroke="#43D9A3" strokeWidth={1.2} strokeDasharray="5 4" />
            {points.map((pt, idx) => (
                <circle
                    key={idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={3}
                    fill={pt.side ? "#67D9FF" : "none"}
                    stroke={pt.side ? "none" : "#A3ADB9"}
                    strokeWidth={1.2}
                    opacity={0.9}
                />
            ))}
        </svg>
    );
}

function SvgMotif3() {
    const r = rng(5);
    const C: [number, number][] = [
        [80, 60],
        [210, 80],
        [130, 145],
    ];
    const O = ["#67D9FF", "#F5F7FA", "#A3ADB9"];

    const clusters = C.map((c, k) => {
        const pts: [number, number][] = [];
        for (let i = 0; i < 16; i++) {
            const a = r() * 6.28;
            const d = Math.sqrt(r()) * 40;
            pts.push([c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d]);
        }
        return { c, color: O[k], pts };
    });

    return (
        <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {clusters.map((cl, idx) => (
                <g key={idx}>
                    <circle
                        cx={cl.c[0]}
                        cy={cl.c[1]}
                        r={46}
                        fill="none"
                        stroke={cl.color}
                        strokeOpacity={0.18}
                        strokeDasharray="2 4"
                    />
                    {cl.pts.map((pt, pIdx) => (
                        <circle key={pIdx} cx={pt[0]} cy={pt[1]} r={2.2} fill={cl.color} opacity={0.8} />
                    ))}
                    <path
                        d={`M${cl.c[0] - 5} ${cl.c[1]}H${cl.c[0] + 5}M${cl.c[0]} ${cl.c[1] - 5}V${cl.c[1] + 5}`}
                        stroke="#43D9A3"
                        strokeWidth={1.6}
                    />
                </g>
            ))}
        </svg>
    );
}

function SvgMotif4() {
    const L = [4, 6, 6, 3];
    const xs = [70, 165, 260, 355];
    const pts: [number, number][][] = L.map((n, k) => {
        const a: [number, number][] = [];
        for (let i = 0; i < n; i++) {
            a.push([xs[k], 95 + (i - (n - 1) / 2) * 24]);
        }
        return a;
    });

    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (let k = 0; k < 3; k++) {
        pts[k].forEach((a) => {
            pts[k + 1].forEach((b) => {
                lines.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
            });
        });
    }

    return (
        <svg viewBox="0 0 420 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {lines.map((ln, idx) => (
                <line key={idx} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke="#67D9FF" strokeOpacity={0.16} />
            ))}
            {pts.map((layer, k) =>
                layer.map((p, pIdx) => (
                    <circle
                        key={`${k}-${pIdx}`}
                        cx={p[0]}
                        cy={p[1]}
                        r={4}
                        fill={k === 3 ? "#43D9A3" : "#090B0E"}
                        stroke={k === 3 ? "#43D9A3" : "#67D9FF"}
                        strokeWidth={1.3}
                    />
                ))
            )}
        </svg>
    );
}

export default function Home() {
    const heroRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const bgLayerRef = useRef<HTMLDivElement | null>(null);
    const cvLayerRef = useRef<HTMLDivElement | null>(null);
    const fgRef = useRef<HTMLDivElement | null>(null);
    const teleRef = useRef<HTMLUListElement | null>(null);

    // ─── Procedural Canvas & Multi-Layer Parallax ──────────────────────────────
    useEffect(() => {
        const cv = canvasRef.current;
        const hero = heroRef.current;
        const bgLayer = bgLayerRef.current;
        const cvLayer = cvLayerRef.current;
        const fg = fgRef.current;
        const tele = teleRef.current;

        if (!cv || !hero) return;

        const ctx = cv.getContext("2d");
        if (!ctx) return;

        const RM = window.matchMedia("(prefers-reduced-motion: reduce)");
        const FINE = window.matchMedia("(hover: hover) and (pointer: fine)");

        let W = 0;
        let H = 0;
        let N = 30;
        let M = 18;
        let K = 1;
        let parts: Array<{ x: number; y: number; z: number; p: number }> = [];
        let inView = true;
        let raf = 0;
        let sy = window.scrollY;
        let sched = 0;
        let px = 0;
        let py = 0;
        let tx = 0;
        let ty = 0;

        function size() {
            if (!cv || !ctx) return;
            W = cv.clientWidth;
            H = cv.clientHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            cv.width = W * dpr;
            cv.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const small = W < 700;
            const mid = W < 1000;
            N = small ? 14 : mid ? 22 : 32;
            M = small ? 9 : mid ? 14 : 20;
            K = Math.max(0.5, Math.min(1.1, W / 1300));

            const r = rng(7);
            const count = small ? 22 : mid ? 36 : 56;
            parts = [];
            for (let i = 0; i < count; i++) {
                parts.push({ x: r(), y: r(), z: 0.3 + r() * 0.7, p: r() * 6.28 });
            }
            draw(performance.now());
        }

        function draw(t: number) {
            if (!ctx) return;
            ctx.clearRect(0, 0, W, H);
            const cx = W * (W < 900 ? 0.5 : 0.64);
            const cy = H * (W < 900 ? 0.5 : 0.54);

            px += (tx - px) * 0.06;
            py += (ty - py) * 0.06;

            const A = RM.matches ? 0 : 1;
            const ry = px * 0.22 + Math.sin(t * 0.00011) * 0.1 * A;
            const rx = 1.02 + py * 0.07 + Math.min(sy, 800) * 0.0002;
            const cr = Math.cos(ry);
            const sr = Math.sin(ry);
            const cp = Math.cos(rx);
            const sp = Math.sin(rx);
            const T = t * A;
            const P: number[][][] = [];

            for (let i = 0; i <= N; i++) {
                P[i] = [];
                for (let j = 0; j <= M; j++) {
                    const x = ((i / N) - 0.5) * 980 * K;
                    const z = ((j / M) - 0.5) * 640 * K;
                    const y =
                        (Math.sin(x * 0.011 + T * 0.0007) * 26 +
                            Math.cos(z * 0.016 - T * 0.0005) * 30 +
                            Math.sin((x + z) * 0.006 + T * 0.0003) * 18 +
                            58 * Math.exp(-((x * x + z * z) / (95000 * K * K)))) *
                        K;

                    const x1 = x * cr - z * sr;
                    const z1 = x * sr + z * cr;
                    const y2 = y * cp + z1 * sp;
                    const z2 = z1 * cp - y * sp;
                    const s = 900 / (900 + z2);
                    P[i][j] = [cx + x1 * s, cy - y2 * s, z2, y];
                }
            }

            ctx.lineWidth = 1;
            function line(pts: number[][], col: string) {
                if (!ctx) return;
                const z = pts[pts.length >> 1][2];
                const a = Math.max(0.05, Math.min(0.5, 0.34 - z / 1700));
                ctx.strokeStyle = "rgba(" + col + "," + a.toFixed(3) + ")";
                ctx.beginPath();
                for (let k = 0; k < pts.length; k++) {
                    if (k) ctx.lineTo(pts[k][0], pts[k][1]);
                    else ctx.moveTo(pts[k][0], pts[k][1]);
                }
                ctx.stroke();
            }

            for (let i = 0; i <= N; i++) line(P[i], "103,217,255");
            for (let j = 0; j <= M; j++) {
                const row: number[][] = [];
                for (let i = 0; i <= N; i++) row.push(P[i][j]);
                line(row, "103,217,255");
            }

            ctx.fillStyle = "rgba(245,247,250,.55)";
            for (let i = 0; i <= N; i += 4) {
                for (let j = 0; j <= M; j += 4) {
                    const q = P[i][j];
                    ctx.fillRect(q[0] - 1, q[1] - 1, 2, 2);
                }
            }

            // Emerald telemetry nodes on highest crests
            ctx.fillStyle = "rgba(67,217,163,.95)";
            for (let i = 2; i < N; i += 6) {
                for (let j = 2; j < M; j += 6) {
                    const q = P[i][j];
                    if (q[3] > 60 * K) {
                        ctx.beginPath();
                        ctx.arc(q[0], q[1], 2.4, 0, 6.283);
                        ctx.fill();
                    }
                }
            }

            // Particle field (depth -1)
            for (let n = 0; n < parts.length; n++) {
                const p = parts[n];
                const dx = p.x * W + px * 40 * p.z + Math.sin(T * 0.0002 + p.p) * 8 * p.z;
                const dy = p.y * H + py * 30 * p.z + Math.cos(T * 0.00017 + p.p) * 8 * p.z;
                ctx.fillStyle = "rgba(245,247,250," + (0.12 + p.z * 0.4).toFixed(2) + ")";
                ctx.fillRect(dx, dy, p.z * 1.8, p.z * 1.8);
            }
        }

        function loop(t: number) {
            raf = 0;
            if (!inView || document.hidden || RM.matches) return;
            draw(t);
            raf = requestAnimationFrame(loop);
        }

        function kick() {
            if (!raf && inView && !document.hidden && !RM.matches) {
                raf = requestAnimationFrame(loop);
            }
        }

        // Parallax updates scheduled per rAF
        function frame() {
            sched = 0;
            if (RM.matches || !hero) return;
            const hh = hero.offsetHeight;
            if (sy < hh * 1.2) {
                if (bgLayer) bgLayer.style.transform = `translate3d(0, ${(sy * 0.1).toFixed(1)}px, 0)`;
                if (cvLayer) cvLayer.style.transform = `translate3d(0, ${(sy * 0.24).toFixed(1)}px, 0)`;
                if (fg) {
                    fg.style.transform = `translate3d(0, ${(sy * 0.06).toFixed(1)}px, 0)`;
                    fg.style.opacity = Math.max(0, 1 - sy / (hh * 0.85)).toFixed(3);
                }
            }
            if (tele) {
                tele.style.transform = `translate3d(0, ${(-Math.min(sy, 900) * 0.045).toFixed(1)}px, 0)`;
            }
        }

        const handleScroll = () => {
            sy = window.scrollY;
            if (!sched) sched = requestAnimationFrame(frame);
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!FINE.matches || RM.matches || !inView) return;
            tx = (e.clientX / window.innerWidth - 0.5) * 2;
            ty = (e.clientY / window.innerHeight - 0.5) * 2;
        };

        const observer = new IntersectionObserver(
            (entries) => {
                inView = entries[0].isIntersecting;
                if (inView) kick();
            },
            { threshold: 0.05 }
        );
        observer.observe(hero);

        let resizeTimer: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                size();
                frame();
                kick();
            }, 120);
        };

        const handleVisibilityChange = () => {
            kick();
        };

        const handleMotionChange = () => {
            if (RM.matches) {
                if (bgLayer) bgLayer.style.transform = "";
                if (cvLayer) cvLayer.style.transform = "";
                if (fg) {
                    fg.style.transform = "";
                    fg.style.opacity = "";
                }
                if (tele) tele.style.transform = "";
                draw(0);
            } else {
                frame();
                kick();
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });
        document.addEventListener("visibilitychange", handleVisibilityChange);
        RM.addEventListener?.("change", handleMotionChange);

        sy = window.scrollY;
        size();
        frame();
        kick();

        return () => {
            if (raf) cancelAnimationFrame(raf);
            if (sched) cancelAnimationFrame(sched);
            clearTimeout(resizeTimer);
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            RM.removeEventListener?.("change", handleMotionChange);
        };
    }, []);

    // ─── 3D Card Tilt on Pointer Move ──────────────────────────────────────────
    const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement | HTMLAnchorElement>) => {
        if (e.pointerType !== "mouse") return;
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        target.classList.add("hot");
        target.style.setProperty("--ry", `${((x - 0.5) * 5).toFixed(2)}deg`);
        target.style.setProperty("--rx", `${((0.5 - y) * 4).toFixed(2)}deg`);
        target.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        target.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    };

    const handleCardPointerLeave = (e: React.PointerEvent<HTMLDivElement | HTMLAnchorElement>) => {
        const target = e.currentTarget;
        target.classList.remove("hot");
        target.style.setProperty("--rx", "0deg");
        target.style.setProperty("--ry", "0deg");
    };

    const handleScrollToCurriculum = (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById("curriculum");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Box sx={homeStyles.root}>
            {/* ─── Hero Section ────────────────────────────────────────────── */}
            <Box component="header" ref={heroRef} sx={homeStyles.hero} id="top">
                <Box
                    ref={bgLayerRef}
                    sx={{ ...homeStyles.layer, ...homeStyles.layerBg }}
                    aria-hidden="true"
                    data-d="0.10"
                />
                <Box
                    ref={cvLayerRef}
                    sx={{ ...homeStyles.layer, ...homeStyles.layerCv }}
                    aria-hidden="true"
                    data-d="0.24"
                >
                    <canvas ref={canvasRef} id="cv" />
                </Box>
                <Box sx={homeStyles.vignette} aria-hidden="true" />

                <Box sx={homeStyles.wrap}>
                    <Box ref={fgRef} sx={homeStyles.heroFg} id="fg">
                        <Box component="p" sx={homeStyles.chip}>
                            <Box component="span" sx={homeStyles.dot} aria-hidden="true" />
                            MACHINE LEARNING LAB 2026
                        </Box>

                        <Box component="h1" sx={homeStyles.headline}>
                            <span>Interactive</span>
                            <span>Machine Learning</span>
                            <span className="dim">Laboratory</span>
                        </Box>

                        <Box component="p" sx={homeStyles.lead}>
                            Explore machine learning through interactive, browser-based experiments. Learn numerical
                            computing, data preprocessing, supervised learning, clustering, dimensionality reduction,
                            and production ML workflows in an environment powered by{" "}
                            <b>Python, WebAssembly, NumPy, scikit-learn, and Pyodide</b>.
                        </Box>

                        <Box sx={homeStyles.cta}>
                            <Box
                                component={Link}
                                href="/ml-lab/bab-01-numpy"
                                sx={homeStyles.btnPrimary}
                            >
                                <IconComponent name="play" size={14} />
                                <span>Launch Interactive Sandbox</span>
                            </Box>
                            <Box
                                component="a"
                                href="#curriculum"
                                onClick={handleScrollToCurriculum}
                                sx={homeStyles.btnSecondary}
                            >
                                <span>Curriculum Roadmap</span>
                                <IconComponent name="arrow-down" size={15} />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={homeStyles.scrollIndicator} aria-hidden="true" />
            </Box>

            <main>
                {/* ─── Telemetry Strip ───────────────────────────────────────── */}
                <Box component="section" sx={homeStyles.telemetryWrapper} aria-label="Platform telemetry">
                    <Box sx={homeStyles.wrap}>
                        <Box component="ul" ref={teleRef} sx={homeStyles.telemetryGrid} id="tele">
                            <Box component="li" sx={homeStyles.telemetryItem(false, true, false)}>
                                <span className="tele-val">14</span>
                                <span className="tele-key">Interactive Chapters</span>
                                <span className="tele-desc">Foundations to MLOps</span>
                            </Box>
                            <Box component="li" sx={homeStyles.telemetryItem(true, false, false)}>
                                <span className="tele-val">Zero</span>
                                <span className="tele-key">Server Latency</span>
                                <span className="tele-desc">Browser-based Pyodide WebAssembly engine</span>
                            </Box>
                            <Box component="li" sx={homeStyles.telemetryItem(true, false, true)}>
                                <span className="tele-val">100%</span>
                                <span className="tele-key">Client-Side</span>
                                <span className="tele-desc">Privacy-first execution architecture</span>
                            </Box>
                            <Box component="li" sx={homeStyles.telemetryItem(true, false, false)}>
                                <span className="tele-val">Auto</span>
                                <span className="tele-key">Automated Grading</span>
                                <span className="tele-desc">Markdown and PDF report export</span>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* ─── Curriculum Showcase ───────────────────────────────────── */}
                <Box component="section" sx={homeStyles.curriculumSection} id="curriculum" aria-labelledby="cur-h">
                    <Box sx={homeStyles.wrap}>
                        <Box component="p" sx={homeStyles.curriculumEyebrow}>
                            THE LEARNING SYSTEM / 14 CHAPTERS
                        </Box>
                        <Box component="h2" id="cur-h" sx={homeStyles.curriculumHeading}>
                            From mathematical foundations to production intelligence.
                        </Box>
                        <Box component="p" sx={homeStyles.curriculumSub}>
                            A structured progression through the mathematics, algorithms, and engineering practices
                            behind modern machine learning.
                        </Box>

                        <Box sx={homeStyles.curriculumGrid}>
                            {/* Phase 01 Card - Navigable */}
                            <Box
                                component={Link}
                                href="/ml-lab/bab-01-numpy"
                                aria-label="Phase 01, Foundations and Preprocessing, Bab 01 to 03. Start with Bab 01."
                                onPointerMove={handleCardPointerMove}
                                onPointerLeave={handleCardPointerLeave}
                                sx={homeStyles.curriculumCard(7)}
                            >
                                <Box sx={homeStyles.cardViz}>
                                    <SvgMotif1 />
                                </Box>
                                <Box sx={homeStyles.cardBody}>
                                    <Box sx={homeStyles.cardRow}>
                                        <span style={homeStyles.cardNumber}>01</span>
                                        <span style={homeStyles.cardRange}>BAB 01–03</span>
                                    </Box>
                                    <Box component="h3" sx={homeStyles.cardTitle}>
                                        Foundations &amp; Preprocessing
                                    </Box>
                                    <Box component="p" sx={homeStyles.cardDesc}>
                                        Explore numerical computing, data manipulation, and preprocessing fundamentals.
                                    </Box>
                                    <Box component="span" sx={homeStyles.cardAction}>
                                        Start at Bab 01
                                    </Box>
                                </Box>
                            </Box>

                            {/* Phase 02 Card - Informational */}
                            <Box
                                component="article"
                                onPointerMove={handleCardPointerMove}
                                onPointerLeave={handleCardPointerLeave}
                                sx={homeStyles.curriculumCard(5)}
                            >
                                <Box sx={homeStyles.cardViz}>
                                    <SvgMotif2 />
                                </Box>
                                <Box sx={homeStyles.cardBody}>
                                    <Box sx={homeStyles.cardRow}>
                                        <span style={homeStyles.cardNumber}>02</span>
                                        <span style={homeStyles.cardRange}>BAB 04–09</span>
                                    </Box>
                                    <Box component="h3" sx={homeStyles.cardTitle}>
                                        Supervised Learning
                                    </Box>
                                    <Box component="p" sx={homeStyles.cardDesc}>
                                        Explore regression, classification, model evaluation, and supervised learning workflows.
                                    </Box>
                                    <Box component="span" sx={homeStyles.cardActionSoon}>
                                        Inside the sandbox
                                    </Box>
                                </Box>
                            </Box>

                            {/* Phase 03 Card - Informational */}
                            <Box
                                component="article"
                                onPointerMove={handleCardPointerMove}
                                onPointerLeave={handleCardPointerLeave}
                                sx={homeStyles.curriculumCard(5)}
                            >
                                <Box sx={homeStyles.cardViz}>
                                    <SvgMotif3 />
                                </Box>
                                <Box sx={homeStyles.cardBody}>
                                    <Box sx={homeStyles.cardRow}>
                                        <span style={homeStyles.cardNumber}>03</span>
                                        <span style={homeStyles.cardRange}>BAB 10–12</span>
                                    </Box>
                                    <Box component="h3" sx={homeStyles.cardTitle}>
                                        Unsupervised Learning
                                    </Box>
                                    <Box component="p" sx={homeStyles.cardDesc}>
                                        Explore clustering, dimensionality reduction, and the discovery of hidden data structures.
                                    </Box>
                                    <Box component="span" sx={homeStyles.cardActionSoon}>
                                        Inside the sandbox
                                    </Box>
                                </Box>
                            </Box>

                            {/* Phase 04 Card - Informational */}
                            <Box
                                component="article"
                                onPointerMove={handleCardPointerMove}
                                onPointerLeave={handleCardPointerLeave}
                                sx={homeStyles.curriculumCard(7)}
                            >
                                <Box sx={homeStyles.cardViz}>
                                    <SvgMotif4 />
                                </Box>
                                <Box sx={homeStyles.cardBody}>
                                    <Box sx={homeStyles.cardRow}>
                                        <span style={homeStyles.cardNumber}>04</span>
                                        <span style={homeStyles.cardRange}>BAB 13–14</span>
                                    </Box>
                                    <Box component="h3" sx={homeStyles.cardTitle}>
                                        Deep Learning &amp; MLOps
                                    </Box>
                                    <Box component="p" sx={homeStyles.cardDesc}>
                                        Explore neural-network fundamentals and the transition from experimentation to production workflows.
                                    </Box>
                                    <Box component="span" sx={homeStyles.cardActionSoon}>
                                        Inside the sandbox
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </main>
        </Box>
    );
}
