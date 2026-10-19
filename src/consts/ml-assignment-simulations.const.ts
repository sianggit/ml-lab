export interface AssignmentSimulationPreset {
    id: string;
    assignmentId: "tugas-bab-04-titanic" | "tugas-uts-pertemuan-1-6";
    questionId?: string;
    title: string;
    badge: string;
    description: string;
    code: string;
}

export const ASSIGNMENT_SIMULATION_PRESETS: AssignmentSimulationPreset[] = [
    {
        id: "sim-bab04-full-pipeline",
        assignmentId: "tugas-bab-04-titanic",
        title: "Benchmark Pipeline Titanic: Logistic Regression vs Random Forest",
        badge: "Bab 04 • Pipeline",
        description:
            "Eksekusi pipeline lengkap ColumnTransformer dengan 3 sub-pipeline (numerik median + scaler, nominal most_frequent + OneHotEncoder drop='first', ordinal pclass), komparasi metrik uji N=179, dan visualisasi Matplotlib Confusion Matrix.",
        code: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt

print("================================================================")
print("  ML LAB SIMULATOR: BAB 04 - TITANIC PIPELINE (PYODIDE WASM)    ")
print("================================================================")

# 1. Pemuatan & Rekayasa Fitur Domain Titanic (N = 891)
np.random.seed(42)
n = 891
pclasses = np.random.choice([1, 2, 3], size=n, p=[0.24, 0.21, 0.55])
sexes = np.random.choice(['male', 'female'], size=n, p=[0.65, 0.35])
ages = np.random.normal(loc=29.7, scale=14.5, size=n)
ages = np.where(np.random.rand(n) < 0.1987, np.nan, np.clip(ages, 0.5, 80))
fares = np.where(pclasses == 1, np.random.exponential(84, n), np.where(pclasses == 2, np.random.exponential(21, n), np.random.exponential(13, n)))
sibsp = np.random.choice([0, 1, 2, 3], size=n, p=[0.68, 0.23, 0.06, 0.03])
parch = np.random.choice([0, 1, 2], size=n, p=[0.76, 0.13, 0.11])
embarked = np.random.choice(['S', 'C', 'Q'], size=n, p=[0.72, 0.19, 0.09])
surv_prob = 0.22 + (sexes == 'female') * 0.46 + (pclasses == 1) * 0.21 - (pclasses == 3) * 0.14 + np.clip(fares / 220, 0, 0.12)
survived = (np.random.rand(n) < np.clip(surv_prob, 0.05, 0.95)).astype(int)

df = pd.DataFrame({
    'pclass': pclasses, 'sex': sexes, 'age': ages,
    'sibsp': sibsp, 'parch': parch, 'fare': fares,
    'embarked': embarked, 'survived': survived
})

print(f"[OK] Dataset Titanic berhasil dimuat: {df.shape[0]} baris, {df.shape[1]} kolom.")
print(f"     Missing values: age = {df['age'].isna().sum()} ({df['age'].isna().mean()*100:.1f}%), embarked = {df['embarked'].isna().sum()}")

# Konstruksi 3 Fitur Domain Baru
df['family_size'] = df['sibsp'] + df['parch'] + 1
df['is_alone'] = (df['family_size'] == 1).astype(int)
df['fare_per_person'] = df['fare'] / df['family_size']
print("[OK] 3 Fitur domain baru dikonstruksi: ['family_size', 'is_alone', 'fare_per_person']")

fitur_num = ['age', 'fare', 'family_size', 'fare_per_person']
fitur_cat = ['sex', 'embarked']
fitur_ord = ['pclass']
kolom_aktif = fitur_num + fitur_cat + fitur_ord

X_train, X_test, y_train, y_test = train_test_split(
    df[kolom_aktif], df['survived'], test_size=0.20, stratify=df['survived'], random_state=42
)

# 2. Desain ColumnTransformer Bebas Data Leakage
preprocessor = ColumnTransformer(transformers=[
    ('num', Pipeline([('imputer', SimpleImputer(strategy='median')), ('scaler', StandardScaler())]), fitur_num),
    ('cat', Pipeline([('imputer', SimpleImputer(strategy='most_frequent')), ('onehot', OneHotEncoder(drop='first', handle_unknown='ignore'))]), fitur_cat),
    ('ord', Pipeline([('imputer', SimpleImputer(strategy='most_frequent')), ('ordinal', OrdinalEncoder(categories=[[1, 2, 3]]))]), fitur_ord)
])

# 3. Model Pipeline
pipe_lr = Pipeline([('prep', preprocessor), ('clf', LogisticRegression(max_iter=1000, random_state=42))])
pipe_rf = Pipeline([('prep', preprocessor), ('clf', RandomForestClassifier(n_estimators=100, random_state=42))])

pipe_lr.fit(X_train, y_train)
y_pred_lr = pipe_lr.predict(X_test)

pipe_rf.fit(X_train, y_train)
y_pred_rf = pipe_rf.predict(X_test)

print()
print("------------------ HASIL EVALUASI MODEL (DATA UJI N = 179) ------------------")
print(f"{'Metrik':<20} | {'Logistic Regression':<22} | {'Random Forest':<20}")
print("-" * 70)
print(f"{'Akurasi':<20} | {accuracy_score(y_test, y_pred_lr)*100:>19.2f}% | {accuracy_score(y_test, y_pred_rf)*100:>17.2f}%")
print(f"{'Presisi':<20} | {precision_score(y_test, y_pred_lr)*100:>19.2f}% | {precision_score(y_test, y_pred_rf)*100:>17.2f}%")
print(f"{'Recall (Sensitivitas)':<20} | {recall_score(y_test, y_pred_lr)*100:>19.2f}% | {recall_score(y_test, y_pred_rf)*100:>17.2f}%")
print(f"{'F1-Score':<20} | {f1_score(y_test, y_pred_lr):>20.4f} | {f1_score(y_test, y_pred_rf):>18.4f}")
print("-" * 70)

# 4. Visualisasi Confusion Matrix Heatmap
cm_lr = confusion_matrix(y_test, y_pred_lr)
cm_rf = confusion_matrix(y_test, y_pred_rf)

fig, axes = plt.subplots(1, 2, figsize=(9.2, 4.0), facecolor='#11151a')
for ax, cm, title in zip(axes, [cm_lr, cm_rf], ['Logistic Regression', 'Random Forest']):
    im = ax.imshow(cm, cmap='Blues', alpha=0.85)
    ax.set_title(title, color='#F5F7FA', fontsize=11, pad=10)
    ax.set_xlabel('Predicted Label', color='#A3ADB9', fontsize=9.5)
    ax.set_ylabel('True Label', color='#A3ADB9', fontsize=9.5)
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(['Died (0)', 'Survived (1)'], color='#F5F7FA')
    ax.set_yticklabels(['Died (0)', 'Survived (1)'], color='#F5F7FA')
    ax.tick_params(colors='#A3ADB9')
    for i in range(2):
        for j in range(2):
            ax.text(j, i, str(cm[i, j]), ha='center', va='center', color='black' if cm[i, j] > cm.max()/2 else 'white', fontweight='bold', fontsize=12)
    for side in ['bottom', 'top', 'left', 'right']:
        ax.spines[side].set_color('#2A3642')

plt.suptitle('Komparasi Confusion Matrix Test Set (Bab 04)', color='#67D9FF', fontsize=12, y=0.98)
plt.tight_layout()
`,
    },
    {
        id: "sim-uts-soal-5-knn",
        assignmentId: "tugas-uts-pertemuan-1-6",
        questionId: "soal-5",
        title: "Kalkulasi Manual K-Nearest Neighbors (Euclidean vs Manhattan & Weighted)",
        badge: "UTS • Soal 5",
        description:
            "Simulasi komputasi jarak titik q(3, 5) ke data latih D1-D5, perbandingan voting mayoritas k=3 vs Distance-Weighted KNN (w=1/d), dan render geometri 2D ruang fitur.",
        code: `import numpy as np
import matplotlib.pyplot as plt

print("================================================================")
print("   ML LAB SIMULATOR: KISI-KISI UTS SOAL 5 - KNN MANUAL          ")
print("================================================================")

# Data Latih
points = np.array([
    [4, 6],   # D1
    [6, 9],   # D2
    [0, 1],   # D3
    [9, 13],  # D4
    [3, 17]   # D5
])
labels = ['D1', 'D2', 'D3', 'D4', 'D5']
targets = ['Terlambat', 'Tepat waktu', 'Tepat waktu', 'Terlambat', 'Tepat waktu']

# Query point q
q = np.array([3, 5])

# 1. Hitung Jarak Euclidean & Manhattan
d_euc = np.sqrt(np.sum((points - q)**2, axis=1))
d_man = np.sum(np.abs(points - q), axis=1)

print(f"Titik Pengujian Baru q = ({q[0]}, {q[1]})")
print()
print(f"{'Data':<6} | {'Koordinat':<10} | {'Kelas Target':<14} | {'Jarak Euclidean':<16} | {'Jarak Manhattan':<16}")
print("-" * 72)
for i in range(5):
    print(f"{labels[i]:<6} | ({points[i][0]},{points[i][1]}){' '*4} | {targets[i]:<14} | {d_euc[i]:>15.3f} | {d_man[i]:>15.3f}")
print("-" * 72)

# Urutkan untuk Euclidean k=3
idx_euc = np.argsort(d_euc)[:3]
print()
print("[5a. Analisis Euclidean k = 3]")
print(f"3 Tetangga Terdekat: {[labels[i] for i in idx_euc]} dengan jarak {[round(float(d_euc[i]), 3) for i in idx_euc]}")
votes_euc = [targets[i] for i in idx_euc]
majority_pred = max(set(votes_euc), key=votes_euc.count)
print(f"Voting Mayoritas (k=3): {votes_euc.count('Tepat waktu')} Tepat Waktu vs {votes_euc.count('Terlambat')} Terlambat -> Hasil: '{majority_pred}'")

# Weighted KNN (w = 1/d)
w = 1.0 / d_euc[idx_euc]
w_terlambat = sum(w[i] for i, idx in enumerate(idx_euc) if targets[idx] == 'Terlambat')
w_tepat = sum(w[i] for i, idx in enumerate(idx_euc) if targets[idx] == 'Tepat waktu')
weighted_pred = 'Terlambat' if w_terlambat > w_tepat else 'Tepat waktu'
print(f"Weighted KNN (w = 1/d): Bobot Terlambat = {w_terlambat:.3f} vs Bobot Tepat Waktu = {w_tepat:.3f} -> Hasil: '{weighted_pred}'")
print(f"Keputusan Berubah? {'YA, BERUBAH DARI TEPAT WAKTU MENJADI TERLAMBAT' if majority_pred != weighted_pred else 'TIDAK'}")

# Plot 2D Ruang Fitur
fig, ax = plt.subplots(figsize=(7.5, 4.8), facecolor='#11151a')
ax.set_facecolor('#171D24')

# Plot training points
for i in range(5):
    color = '#FF5C5C' if targets[i] == 'Terlambat' else '#43D9A3'
    ax.scatter(points[i][0], points[i][1], color=color, s=150, zorder=4, edgecolor='white', linewidth=1.5)
    ax.annotate(f"{labels[i]} ({targets[i]})", (points[i][0] + 0.3, points[i][1] + 0.2), color='#E2E8F0', fontsize=9.5)

# Plot query point q
ax.scatter(q[0], q[1], color='#FFB84D', s=230, marker='*', zorder=5, edgecolor='white', linewidth=1.5, label='q (3, 5) Titik Uji')

# Draw lines to 3 nearest neighbors
for idx in idx_euc:
    ax.plot([q[0], points[idx][0]], [q[1], points[idx][1]], color='#67D9FF', linestyle='--', linewidth=1.5, alpha=0.7)

ax.set_title('Visualisasi Geometri KNN: Posisi Titik q(3,5) & 3 Tetangga Terdekat', color='#F5F7FA', fontsize=11, pad=12)
ax.set_xlabel('Skor Jarak (Fitur 1)', color='#A3ADB9')
ax.set_ylabel('Skor Beban Gudang (Fitur 2)', color='#A3ADB9')
ax.tick_params(colors='#A3ADB9')
ax.grid(True, linestyle=':', alpha=0.3, color='#4A5568')
ax.legend(facecolor='#1A202C', edgecolor='#4A5568', labelcolor='white')
plt.tight_layout()
`,
    },
    {
        id: "sim-uts-soal-4-tree",
        assignmentId: "tugas-uts-pertemuan-1-6",
        questionId: "soal-4",
        title: "Kalkulasi Decision Tree: Gini Impurity (CART) vs Information Gain (ID3)",
        badge: "UTS • Soal 4",
        description:
            "Simulasi matematis pemilihan atribut split terbaik antara X (Cuaca Buruk) vs Y (Layanan Ekonomi) dan Cost-Complexity Pruning untuk alpha = 0.004 dan 0.025.",
        code: `import numpy as np

print("================================================================")
print("  ML LAB SIMULATOR: KISI-KISI UTS SOAL 4 - DECISION TREE        ")
print("================================================================")

# 4a. Gini Impurity
def gini(p1, p2):
    t = p1 + p2
    if t == 0: return 0
    return 1.0 - ((p1/t)**2 + (p2/t)**2)

# Induk: 6 Terlambat, 14 Tepat
gini_parent = gini(6, 14)
print(f"1. Gini Impurity Induk (6 Terlambat, 14 Tepat, N=20) = {gini_parent:.3f}")

# Split X (Cuaca Buruk): Ya (4 terlambat, 1 tepat), Tidak (2 terlambat, 13 tepat)
gini_x_ya = gini(4, 1)
gini_x_tidak = gini(2, 13)
gini_x_split = (5/20)*gini_x_ya + (15/20)*gini_x_tidak
delta_gini_x = gini_parent - gini_x_split
print(f"2. Split X (Cuaca Buruk): Gini Tertimbang = {gini_x_split:.3f}, Penurunan Gini = {delta_gini_x:.3f}")

# Split Y (Layanan Ekonomi): Ya (4 terlambat, 6 tepat), Tidak (2 terlambat, 8 tepat)
gini_y_ya = gini(4, 6)
gini_y_tidak = gini(2, 8)
gini_y_split = (10/20)*gini_y_ya + (10/20)*gini_y_tidak
delta_gini_y = gini_parent - gini_y_split
print(f"3. Split Y (Layanan Ekonomi): Gini Tertimbang = {gini_y_split:.3f}, Penurunan Gini = {delta_gini_y:.3f}")

pilihan_cart = "Split X (Cuaca Buruk)" if gini_x_split < gini_y_split else "Split Y (Layanan Ekonomi)"
print(f"[OK] Keputusan CART: Memilih '{pilihan_cart}' (Gini tertimbang terendah: {min(gini_x_split, gini_y_split):.3f})")
print()

# 4b. Entropy & Information Gain (ID3)
def entropy(p1, p2):
    t = p1 + p2
    if t == 0 or p1 == 0 or p2 == 0: return 0
    prob1 = p1 / t
    prob2 = p2 / t
    return - (prob1 * np.log2(prob1) + prob2 * np.log2(prob2))

ent_parent = entropy(6, 14)
ent_x_split = (5/20)*entropy(4, 1) + (15/20)*entropy(2, 13)
ig_x = ent_parent - ent_x_split

ent_y_split = (10/20)*entropy(4, 6) + (10/20)*entropy(2, 8)
ig_y = ent_parent - ent_y_split

print(f"4. Entropy Induk = {ent_parent:.3f} bit")
print(f"   Information Gain X = {ig_x:.3f} bit")
print(f"   Information Gain Y = {ig_y:.3f} bit")
pilihan_id3 = "Split X (Cuaca Buruk)" if ig_x > ig_y else "Split Y (Layanan Ekonomi)"
print(f"[OK] Keputusan ID3: Memilih '{pilihan_id3}' (Information Gain tertinggi: {max(ig_x, ig_y):.3f} bit)")
print(f"   Konsistensi CART vs ID3: {'KONSISTEN SAMA (MEMILIH SPLIT X)' if pilihan_cart == pilihan_id3 else 'BERBEDA'}")
print()

# 4c. Cost Complexity Pruning: C_alpha(T) = R(T) + alpha * |T|
print("5. Analisis Cost-Complexity Pruning:")
trees = [('T1', 0.110, 22), ('T2', 0.150, 8), ('T3', 0.230, 3)]
for alpha in [0.004, 0.025]:
    costs = [(name, r + alpha * leaves) for name, r, leaves in trees]
    best_tree = min(costs, key=lambda x: x[1])
    print(f"   Untuk alpha = {alpha:.3f}:")
    for name, c in costs:
        print(f"     Pohon {name}: C = {c:.3f}")
    print(f"     [OK] Pohon Terpilih: {best_tree[0]} (Cost terendah = {best_tree[1]:.3f})")
`,
    },
    {
        id: "sim-uts-soal-3-chi2",
        assignmentId: "tugas-uts-pertemuan-1-6",
        questionId: "soal-3",
        title: "Uji Independensi Chi-Square (Layanan Ekonomi vs Keterlambatan)",
        badge: "UTS • Soal 3",
        description:
            "Kalkulasi frekuensi harapan E, deviasi kuadrat (O - E)^2 / E, perbandingan statistik Chi-Square hitung (12.907) vs tabel kritis (3.841).",
        code: `import numpy as np

print("================================================================")
print("  ML LAB SIMULATOR: KISI-KISI UTS SOAL 3 - UJI CHI-SQUARE        ")
print("================================================================")

# Tabel Kontingensi Observasi (O)
# Baris 1: Layanan Ekonomi Ya (36 terlambat, 64 tepat)
# Baris 2: Layanan Ekonomi Tidak (14 terlambat, 86 tepat)
obs = np.array([
    [36, 64],
    [14, 86]
])

row_totals = obs.sum(axis=1)
col_totals = obs.sum(axis=0)
grand_total = obs.sum()

# Hitung Frekuensi Harapan E_ij = (R_i * C_j) / N
exp = np.outer(row_totals, col_totals) / grand_total
chi2_terms = (obs - exp)**2 / exp
chi2_stat = np.sum(chi2_terms)
crit_val = 3.841

print("Tabel Kontingensi Observasi (O):")
print(f"{'Layanan':<16} | {'Terlambat':<12} | {'Tepat Waktu':<12} | {'Total Baris':<12}")
print("-" * 58)
print(f"{'Ekonomi (Ya)':<16} | {obs[0,0]:<12} | {obs[0,1]:<12} | {row_totals[0]:<12}")
print(f"{'Non-Ekonomi (Tidak)':<16} | {obs[1,0]:<12} | {obs[1,1]:<12} | {row_totals[1]:<12}")
print(f"{'Total Kolom':<16} | {col_totals[0]:<12} | {col_totals[1]:<12} | {grand_total:<12}")
print("-" * 58)

print()
print("Frekuensi Harapan (E):")
print(f"E11 = {exp[0,0]:.3f}, E12 = {exp[0,1]:.3f}, E21 = {exp[1,0]:.3f}, E22 = {exp[1,1]:.3f}")

print()
print("Komponen Deviasi Kuadrat (O - E)^2 / E:")
print(f"Sel 11: {chi2_terms[0,0]:.3f} | Sel 12: {chi2_terms[0,1]:.3f}")
print(f"Sel 21: {chi2_terms[1,0]:.3f} | Sel 22: {chi2_terms[1,1]:.3f}")

print()
print(f"Nilai Chi-Square Hitung = {chi2_stat:.3f}")
print(f"Nilai Kritis Tabel (df=1, alpha=0.05) = {crit_val:.3f}")
if chi2_stat > crit_val:
    print(f"[OK] KESIMPULAN: Chi2 Hitung ({chi2_stat:.3f}) > Nilai Kritis ({crit_val:.3f}) -> TOLAK H0.")
    print("     Hubungan signifikan! Fitur layanan ekonomi SANGAT LAYAK DIPERTAHANKAN.")
`,
    },
    {
        id: "sim-uts-soal-2-smote",
        assignmentId: "tugas-uts-pertemuan-1-6",
        questionId: "soal-2",
        title: "Deteksi Outlier IQR, Z-Score & Interpolasi Sintetis SMOTE",
        badge: "UTS • Soal 2",
        description:
            "Kalkulasi kuartil Q1, Q3, batas outlier 1.5 IQR, Z-score jarak 55 km, dan sintesis geometris SMOTE titik baru x_baru = (4.000, 6.000) dengan visualisasi 2D.",
        code: `import numpy as np
import matplotlib.pyplot as plt

print("================================================================")
print("  ML LAB SIMULATOR: KISI-KISI UTS SOAL 2 - OUTLIER & SMOTE       ")
print("================================================================")

# 2a. Berat Paket
berat = np.array([1, 2, 2, 3, 3, 4, 5, 18])
q1, q3 = 2.000, 4.500
q2 = np.median(berat)
iqr = q3 - q1
bb = q1 - 1.5 * iqr
ba = q3 + 1.5 * iqr
outliers = berat[(berat < bb) | (berat > ba)]

print(f"1. Analisis Berat Paket: {berat.tolist()}")
print(f"   Q1 = {q1:.3f} kg, Median = {q2:.3f} kg, Q3 = {q3:.3f} kg, IQR = {iqr:.3f} kg")
print(f"   Batas Bawah = {bb:.3f} kg, Batas Atas = {ba:.3f} kg")
print(f"   Kandidat Outlier Terdeteksi: {outliers.tolist()} (Nilai 18 kg > Batas Atas {ba:.3f} kg)")
print()

# 2b. Jarak & Z-Score
jarak = np.array([5, 8, 10, 12, 65])
print(f"2. Imputasi Jarak: {jarak.tolist()}")
print(f"   Mean = {np.mean(jarak):.3f} km, Median = {np.median(jarak):.3f} km")
print(f"   Rekomendasi Imputasi: MEDIAN ({np.median(jarak):.3f} km) karena tahan skewness dan outlier 65 km.")
z = (55 - 15) / 12
print(f"   Z-Score jarak 55 km (mu=15, sigma=12): z = {z:.3f} -> {'KANDIDAT OUTLIER (|z| > 3)' if abs(z) > 3 else 'Bukan Outlier'}")
print()

# 2d. SMOTE Interpolation
xi = np.array([2.0, 7.0])
xj = np.array([8.0, 4.0])
lam = 1.0 / 3.0
x_baru = xi + lam * (xj - xi)
print("3. Sintesis SMOTE:")
print(f"   Titik xi = ({xi[0]:.3f}, {xi[1]:.3f})")
print(f"   Tetangga xj = ({xj[0]:.3f}, {xj[1]:.3f})")
print(f"   Lambda = 1/3 ({lam:.3f})")
print(f"   [OK] Titik Sintetis Baru: x_baru = ({x_baru[0]:.3f}, {x_baru[1]:.3f})")

# Visualisasi SMOTE
fig, ax = plt.subplots(figsize=(6.5, 4.2), facecolor='#11151a')
ax.set_facecolor('#171D24')
ax.plot([xi[0], xj[0]], [xi[1], xj[1]], 'w--', alpha=0.5, label='Garis Segmen Interpolasi')
ax.scatter(xi[0], xi[1], color='#67D9FF', s=160, label=f'xi ({xi[0]:.0f}, {xi[1]:.0f}) Sampel Asli', zorder=4)
ax.scatter(xj[0], xj[1], color='#A3ADB9', s=160, label=f'xj ({xj[0]:.0f}, {xj[1]:.0f}) Tetangga k-NN', zorder=4)
ax.scatter(x_baru[0], x_baru[1], color='#43D9A3', s=220, marker='D', label=f'x_baru ({x_baru[0]:.1f}, {x_baru[1]:.1f}) Sintetis', zorder=5)

ax.set_title('Visualisasi Interpolasi SMOTE: xi(2,7) ke xj(8,4) dengan lambda=1/3', color='#F5F7FA', fontsize=11, pad=10)
ax.set_xlabel('Fitur Dimensi 1', color='#A3ADB9')
ax.set_ylabel('Fitur Dimensi 2', color='#A3ADB9')
ax.tick_params(colors='#A3ADB9')
ax.grid(True, linestyle=':', alpha=0.3, color='#4A5568')
ax.legend(facecolor='#1A202C', edgecolor='#4A5568', labelcolor='white', fontsize=9)
plt.tight_layout()
`,
    },
];
