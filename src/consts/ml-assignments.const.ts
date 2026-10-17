import { AssignmentItem } from "@/models/assignment/assignment.model";

export const ML_ASSIGNMENTS: AssignmentItem[] = [
    {
        id: "tugas-bab-04-titanic",
        code: "BAB-04",
        title: "Rekayasa Fitur & Pipeline Bebas Data Leakage",
        subtitle: "Studi Kasus Penumpang Kapal Titanic (N = 891) Menggunakan ColumnTransformer scikit-learn",
        category: "praktikum",
        status: "completed",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        executionDate: "02 Oktober 2026",
        abstract:
            "Laporan praktikum Bab 04 mengimplementasikan rekayasa fitur domain dan arsitektur ColumnTransformer scikit-learn pada dataset riil Titanic (N = 891). Menggantikan dataset properti sintetik sesuai Modul 4 Hal 24, transformasi data diisolasi ke dalam 3 jalur: numerik (median + StandardScaler), nominal (most_frequent + OneHotEncoder drop='first'), dan ordinal (pclass OrdinalEncoder [[1, 2, 3]]). Evaluasi terstratifikasi 80:20 membuktikan penambahan fitur turunan domain (family_size, is_alone, fare_per_person) meningkatkan akurasi Logistic Regression dari 77.65% menjadi 79.33% (F1 = 0.7132) serta Random Forest mencapai Recall 69.57% (F1 = 0.7164).",
        keyHighlights: [
            "Dataset riil Titanic (891 baris) dengan missing value age (19.87%) & embarked (0.22%)",
            "Uji Independensi Chi-Square (χ²): Fitur 'sex' (χ² = 260.717) & 'pclass' (χ² = 102.889) terbukti sangat signifikan",
            "Konstruksi 3 fitur domain baru: family_size, is_alone (indikator biner), dan fare_per_person",
            "ColumnTransformer 3 jalur terenkapsulasi di dalam Pipeline scikit-learn bebas kebocoran data",
            "Peningkatan akurasi model linier sebesar +1.68% dan recall Random Forest 69.57%",
        ],
        metrics: [
            {
                label: "Akurasi Logistic Regression",
                baseline: "77.65%",
                enhanced: "79.33%",
                delta: "+1.68%",
                highlight: true,
            },
            {
                label: "F1-Score Logistic Regression",
                baseline: "0.6970",
                enhanced: "0.7132",
                delta: "+0.0162",
                highlight: true,
            },
            {
                label: "Recall Random Forest",
                baseline: "66.67%",
                enhanced: "69.57%",
                delta: "+2.90%",
                highlight: true,
            },
            {
                label: "F1-Score Random Forest",
                baseline: "0.6970",
                enhanced: "0.7164",
                delta: "+0.0194",
                highlight: false,
            },
        ],
        resources: [
            {
                title: "Laporan Resmi Praktikum (PDF Standar Akademik)",
                type: "pdf",
                path: "/assignments/bab-04/LAPORAN_PRAKTIKUM_4_ANGGIT_ARISA_SIWI_PRATAMA_202343570045.pdf",
                description: "Format 3 halaman resmi Unindra dengan biodata standar monochrome, rumus matematis, dan komparasi evaluasi.",
                size: "273 KB",
            },
            {
                title: "Uji Statistik Chi-Square Fitur Kategorikal",
                type: "image",
                path: "/assignments/bab-04/chi_square_features.png",
                description: "Visualisasi bar chart nilai χ² fitur sex, pclass, embarked, dan is_alone terhadap target survived.",
            },
            {
                title: "Matriks Konfusi (Confusion Matrix Comparison)",
                type: "image",
                path: "/assignments/bab-04/confusion_matrix_comparison.png",
                description: "Heatmap komparasi klasifikasi biner Logistic Regression vs Random Forest pada 179 sampel uji.",
            },
        ],
        sourceCodeSnippet: `import seaborn as sns, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# 1. Pemuatan & Rekayasa Fitur Domain
df = sns.load_dataset('titanic')
df['family_size'] = df['sibsp'] + df['parch'] + 1
df['is_alone'] = (df['family_size'] == 1).astype(int)
df['fare_per_person'] = df['fare'] / df['family_size']

fitur_num = ['age', 'fare', 'family_size', 'fare_per_person']
fitur_cat = ['sex', 'embarked']
fitur_ord = ['pclass']
X = df[fitur_num + fitur_cat + fitur_ord]
y = df['survived']

# 2. Pembagian Data Terstratifikasi (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, stratify=y, random_state=42
)

# 3. Pembangunan ColumnTransformer Terisolasi
preprocessor = ColumnTransformer(transformers=[
    ('num', Pipeline([
        ('imp', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ]), fitur_num),
    ('cat', Pipeline([
        ('imp', SimpleImputer(strategy='most_frequent')),
        ('ohe', OneHotEncoder(drop='first', handle_unknown='ignore'))
    ]), fitur_cat),
    ('ord', Pipeline([
        ('imp', SimpleImputer(strategy='most_frequent')),
        ('ord', OrdinalEncoder(categories=[[1, 2, 3]]))
    ]), fitur_ord)
])

# 4. Pipeline Estimator Model
pipe_lr = Pipeline([
    ('prep', preprocessor),
    ('model', LogisticRegression(max_iter=1000, random_state=42))
])
pipe_rf = Pipeline([
    ('prep', preprocessor),
    ('model', RandomForestClassifier(n_estimators=100, random_state=42))
])

# 5. Pelatihan dan Inferensi Bebas Kebocoran Data
pipe_lr.fit(X_train, y_train)
pipe_rf.fit(X_train, y_train)
pred_lr = pipe_lr.predict(X_test)
pred_rf = pipe_rf.predict(X_test)`,
    },
    {
        id: "tugas-uts-pertemuan-1-6",
        code: "UTS-1-6",
        title: "Tugas Machine Learning Pertemuan 1 - 6 (Kisi-Kisi UTS)",
        subtitle: "Studi Kasus Ekspedisi KirimCepat & Kalkulasi Algoritmik Manual (CRISP-DM, Preprocessing, CART/ID3, KNN)",
        category: "uts_tugas",
        status: "in_progress",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        deadline: "22 Oktober 2026, 23:59 WIB",
        abstract:
            "Kompilasi penyelesaian 5 paket soal analitis dan komputasional kisi-kisi UTS Machine Learning. Mencakup evaluasi baseline akurasi pada data imbalanced KirimCepat, penanganan kebocoran data pada siklus CRISP-DM, partisi stratified 70:10:20, imputasi mean/median, deteksi outlier IQR, pembobotan class weight, interpolasi geometris SMOTE, uji Chi-Square kontingensi, seleksi split Gini CART vs Entropy ID3, Cost-Complexity Pruning pohon, kalkulasi jarak manual Euclidean vs Manhattan L1, dan analisis optimal k pada cross-validation.",
        keyHighlights: [
            "Analisis metrik imbalanced data: Mengapa akurasi 88% adalah ilusi performa pada rasio 8.800 : 1.200",
            "Identifikasi outlier berat paket menggunakan metode IQR (1.5 × IQR) dan batas atas 8.5 kg",
            "Formula class weight wk = N / (K × nk) untuk menyeimbangkan penalti kekeliruan kelas minoritas",
            "Perhitungan kuantitatif Gini Index (CART) vs Information Gain (ID3) dengan seleksi atribut konsisten",
            "Perhitungan manual jarak Euclidean vs Manhattan titik q(3, 5) dan optimasi k-NN",
        ],
        resources: [
            {
                title: "Berkas Soal Resmi Dosen (LMS UNINDRA)",
                type: "pdf",
                path: "/assignments/uts/Tugas_Machine_Learning_Pertemuan_1-6_Soal.pdf",
                description: "Dokumen PDF soal resmi penugasan pertemuan 1 - 6 kelas XC Ekstensi.",
                size: "187 KB",
            },
        ],
        questions: [
            {
                id: "soal-1",
                number: "Soal 1",
                title: "Studi Kasus KirimCepat & Workflow ML (CRISP-DM & Evaluasi)",
                topic: "Workflow CRISP-DM, Imbalanced Data, Stratified Split, Gap F1",
                description: "Dataset 10.000 pengiriman paket (8.800 tepat waktu, 1.200 terlambat). Kelas positif = terlambat.",
                solutionPoints: [
                    {
                        subtitle: "1a. Kategori ML, Target, Metrik Utama & Baseline Akurasi",
                        details: [
                            "Kategori: Supervised Learning (Tugas Klasifikasi Biner).",
                            "Variabel Target: Status pengiriman (1 = Terlambat, 0 = Tepat Waktu).",
                            "Metrik Utama: F1-Score dan Recall (Daya Tangkap Paket Terlambat).",
                            "Akurasi Baseline: 8.800 / 10.000 = 88.00%. Kelemahan: Model dummy yang menebak semua tepat waktu tetap mendapat akurasi 88% padahal gagal menangkap 100% paket terlambat (Recall = 0%).",
                        ],
                    },
                    {
                        subtitle: "1b. Revisit Fase CRISP-DM untuk Data Leakage & Definisi Target",
                        details: [
                            "Definisi operasional keterlambatan belum fix: Revisit Business Understanding.",
                            "Kebocoran data kolom 'tanggal_diterima': Revisit Data Preparation untuk membuang fitur pasca-kejadian.",
                        ],
                    },
                    {
                        subtitle: "1c. Partisi Stratified 70 : 10 : 20 (Train : Val : Test)",
                        details: [
                            "Data Latih (70%): 6.160 tepat waktu + 840 terlambat = 7.000 sampel.",
                            "Data Validasi (10%): 880 tepat waktu + 120 terlambat = 1.000 sampel.",
                            "Data Uji (20%): 1.760 tepat waktu + 240 terlambat = 2.000 sampel.",
                        ],
                    },
                    {
                        subtitle: "1d. Analisis Gap F1 Model P, Q, R & Rekomendasi",
                        details: [
                            "Model P (Train 0.95, Val 0.60): Overfitting parah (gap 0.35). Solusi: Regularisasi & pangkas kompleksitas.",
                            "Model Q (Train 0.65, Val 0.64): Underfitting (kapasitas kurang). Solusi: Tambah fitur & gunakan model lebih ekspresif.",
                            "Model R (Train 0.82, Val 0.80): Good Fit (gap hanya 0.02, performa validasi tertinggi). Dipilih sebagai model terbaik.",
                        ],
                    },
                ],
            },
            {
                id: "soal-2",
                number: "Soal 2",
                title: "Preprocessing, Imputasi & Penanganan Imbalanced Data",
                topic: "Kuartil IQR, Imputasi Median vs Mean, Class Weight, SMOTE",
                description: "Analisis statistik sampel data numerik pengiriman dan teknik resampling sintetis.",
                formula: "IQR = Q_3 - Q_1, \\quad w_k = \\frac{N}{K \\times n_k}, \\quad x_{new} = x_i + \\lambda (x_j - x_i)",
                solutionPoints: [
                    {
                        subtitle: "2a. Deteksi Outlier Berat Paket (kg): 1, 2, 2, 3, 3, 4, 5, 18",
                        details: [
                            "N = 8 data terurut. Median = (3 + 3)/2 = 3.0.",
                            "Q1 = 2.0, Q3 = 4.5. IQR = Q3 - Q1 = 2.5 kg.",
                            "Batas Bawah = 2.0 - 1.5(2.5) = -1.75 kg. Batas Atas = 4.5 + 1.5(2.5) = 8.25 kg.",
                            "Kandidat Outlier: Nilai 18 kg (> 8.25 kg). Pertimbangan: Cek apakah paket kargo khusus atau kesalahan ketik (1.8 kg).",
                        ],
                    },
                    {
                        subtitle: "2b. Imputasi Jarak (5, 8, 10, 12, 65) & Z-score",
                        details: [
                            "Mean = (5 + 8 + 10 + 12 + 65)/5 = 100/5 = 20.0 km. Median = 10.0 km.",
                            "Rekomendasi Imputasi: Median (10.0 km) lebih representatif karena tahan pencilan 65 km.",
                            "Z-score jarak 55 km (μ = 15, σ = 12): z = (55 - 15) / 12 = 40 / 12 = +3.333. Karena |z| > 3.0, sampel ini valid terdeteksi sebagai outlier.",
                        ],
                    },
                    {
                        subtitle: "2c. Class Weight untuk Data Train Soal 1c (N = 7.000, K = 2)",
                        details: [
                            "Kelas Mayoritas (Tepat Waktu, n0 = 6.160): w0 = 7000 / (2 × 6160) = 0.568.",
                            "Kelas Minoritas (Terlambat, n1 = 840): w1 = 7000 / (2 × 840) = 4.167.",
                            "Interpretasi: Setiap kesalahan klasifikasi paket terlambat diberi penalti bobot ~7.3 kali lebih berat dibanding paket tepat waktu.",
                        ],
                    },
                    {
                        subtitle: "2d. Sintesis SMOTE & Keabsahan Isolasi Data Latih",
                        details: [
                            "Titik xi = (2, 7), tetangga xj = (8, 4), λ = 1/3.",
                            "x_new = (2, 7) + 1/3 [(8 - 2), (4 - 7)] = (2, 7) + (2, -1) = (4, 6).",
                            "Urgensi Train-Only: Jika SMOTE diterapkan sebelum split, sampel sintetis akan mencemari data uji (kebocoran informasi sintetik), membuat evaluasi model menjadi bias optimis palsu.",
                        ],
                    },
                ],
            },
            {
                id: "soal-3",
                number: "Soal 3",
                title: "Feature Engineering & ColumnTransformer",
                topic: "Uji Chi-Square Kontingensi 2x2, Arsitektur Preprocessing, Leakage Prevention",
                description: "Uji independensi fitur layanan ekonomi vs status keterlambatan dan perancangan pipeline komprehensif.",
                formula: "\\chi^2 = \\sum \\frac{(O - E)^2}{E}",
                solutionPoints: [
                    {
                        subtitle: "3a. Uji Chi-Square Layanan Ekonomi vs Keterlambatan",
                        details: [
                            "Derajat bebas: df = (2 - 1) × (2 - 1) = 1. Nilai kritis tabel (α = 0.05) = 3.841.",
                            "Keputusan: χ² hitung > 3.841 ➔ Tolak H0. Terdapat hubungan asosiasi signifikan antara pemilihan layanan ekonomi terhadap potensi keterlambatan paket.",
                        ],
                    },
                    {
                        subtitle: "3b. Desain ColumnTransformer Bebas Leakage & Rekayasa Fitur",
                        details: [
                            "Jalur Numerik (berat, jarak, ongkir): SimpleImputer(median) + StandardScaler().",
                            "Jalur Nominal (layanan, kota_tujuan): SimpleImputer(most_frequent) + OneHotEncoder(drop='first').",
                            "Jalur Ordinal (prioritas_paket): SimpleImputer(most_frequent) + OrdinalEncoder().",
                            "Dua Fitur Rekayasa: (1) ongkir_per_kg = ongkir / berat, (2) rasio_jarak_berat = jarak / berat.",
                            "Kolom Dibuang: 'id_resi' (kardinalitas unik), 'tanggal_diterima' & 'waktu_aktual' (kebocoran masa depan).",
                        ],
                    },
                ],
            },
            {
                id: "soal-4",
                number: "Soal 4",
                title: "Decision Tree (CART, ID3 & Cost-Complexity Pruning)",
                topic: "Gini Impurity, Information Gain, Cost-Complexity Alpha, Overfitting Control",
                description: "Kalkulasi matematis split kriteria CART vs ID3 dan mekanisme pruning pohon keputusan.",
                formula: "Gini = 1 - \\sum p_i^2, \\quad C_\\alpha(T) = R(T) + \\alpha |T|",
                solutionPoints: [
                    {
                        subtitle: "4a. Gini Impurity Induk & Seleksi Split CART",
                        details: [
                            "Induk (6 terlambat, 14 tepat waktu, total 20): Gini(D) = 1 - [(6/20)² + (14/20)²] = 1 - [0.09 + 0.49] = 0.420.",
                            "Kandidat Split X vs Y: Pilih kandidat dengan Gini tertimbang terendah (penurunan impurity terbesar).",
                        ],
                    },
                    {
                        subtitle: "4b. Entropy & Information Gain (ID3)",
                        details: [
                            "Entropy Induk: H(D) = -[(6/20) log2(6/20) + (14/20) log2(14/20)] = 0.881 bit.",
                            "Hasil: Atribut terbaik yang dipilih CART dan ID3 menunjukkan konsistensi pemisahan ruang fitur.",
                        ],
                    },
                    {
                        subtitle: "4c. Cost-Complexity Pruning (C_alpha(T) = R(T) + alpha |T|)",
                        details: [
                            "Untuk α kecil (α = 0.004): Penalti kompleksitas rendah, pohon yang lebih besar (T1/T2) dipilih.",
                            "Untuk α besar (α = 0.025): Penalti jumlah daun tinggi, pohon paling sederhana (T3) dipilih guna mengontrol variansi.",
                        ],
                    },
                ],
            },
            {
                id: "soal-5",
                number: "Soal 5",
                title: "K-Nearest Neighbors (Kalkulasi Manual & Optimasi)",
                topic: "Metrik Euclidean L2, Manhattan L1, Distance-Weighted KNN, Feature Scaling",
                description: "Perhitungan jarak manual titik uji q(3, 5) terhadap 5 titik data latih dan evaluasi kurva CV.",
                formula: "d_E = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}, \\quad d_M = |x_1 - x_2| + |y_1 - y_2|",
                solutionPoints: [
                    {
                        subtitle: "5a. Jarak Euclidean & Voting k=3 vs Weighted",
                        details: [
                            "Kalkulasi d_E titik q(3, 5) ke seluruh D1 - D5.",
                            "Voting Mayoritas (k=3): 3 tetangga dengan jarak terpendek memberikan suara seimbang.",
                            "Distance-Weighted (w = 1/d): Tetangga terdekat memiliki bobot suara dominan, mengurangi ambiguitas prediksi.",
                        ],
                    },
                    {
                        subtitle: "5b. Perbandingan Metrik Manhattan (L1)",
                        details: [
                            "Perhitungan jarak grid sum selisih absolut koordinat.",
                            "Menganalisis pergeseran urutan tetangga terdekat akibat geometri metrik berbelok (taxicab).",
                        ],
                    },
                    {
                        subtitle: "5c. Pemilihan Optimal k via 5-Fold Cross Validation",
                        details: [
                            "k tidak boleh dipilih berdasarkan akurasi data train karena pada k = 1 akurasi train selalu 100% (overfitting ekstrem).",
                            "Optimal k dipilih pada titik puncak akurasi validasi di mana model mencapai kompromi bias-variance terbaik.",
                        ],
                    },
                    {
                        subtitle: "5d. Urgensi Feature Scaling",
                        details: [
                            "Metrik jarak sangat sensitif terhadap magnitudo fitur. Fitur dengan rentang besar akan mendominasi jarak dan menenggelamkan fitur berrentang kecil tanpa standarisasi skor Z.",
                        ],
                    },
                ],
            },
        ],
    },
];

export const ML_ASSIGNMENT_ROADMAP = [
    { chapter: "Bab 01", title: "Pengantar Machine Learning & Colab", status: "completed", type: "praktikum" },
    { chapter: "Bab 02", title: "Workflow ML & Bias-Variance Tradeoff", status: "completed", type: "praktikum" },
    { chapter: "Bab 03", title: "Penanganan Missing & Imbalanced Data", status: "completed", type: "praktikum" },
    { chapter: "Bab 04", title: "Feature Engineering & Pipeline (Titanic)", status: "completed", type: "praktikum", highlighted: true },
    { chapter: "Bab 05", title: "Decision Tree (CART & C4.5)", status: "completed", type: "praktikum" },
    { chapter: "Bab 06", title: "KNN & Naive Bayes Classifier", status: "completed", type: "praktikum" },
    { chapter: "Pertemuan 1-6", title: "Kisi-Kisi UTS Machine Learning (KirimCepat)", status: "in_progress", type: "uts_tugas", highlighted: true },
    { chapter: "Bab 07", title: "Evaluasi Model Klasifikasi Komprehensif", status: "upcoming", type: "praktikum" },
    { chapter: "Bab 08", title: "Support Vector Machine (SVM)", status: "upcoming", type: "praktikum" },
    { chapter: "Bab 09", title: "Ensemble Learning & Random Forest", status: "upcoming", type: "praktikum" },
    { chapter: "Bab 10", title: "Clustering (K-Means & DBSCAN)", status: "upcoming", type: "praktikum" },
    { chapter: "Bab 11", title: "Dimensionality Reduction (PCA & t-SNE)", status: "upcoming", type: "praktikum" },
    { chapter: "Bab 12", title: "Neural Network & Multi-Layer Perceptron", status: "upcoming", type: "praktikum" },
    { chapter: "Bab 13", title: "Convolutional Neural Network (CNN)", status: "upcoming", type: "praktikum" },
    { chapter: "Bab 14", title: "Model Deployment & Mini Project Akhir", status: "upcoming", type: "uas_project" },
];
