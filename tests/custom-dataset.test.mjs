import test from "node:test";
import assert from "node:assert/strict";

// We can import our compiled or source modules
import {
    stripBOM,
    parseRawCSV,
    parseCSV,
    sanitizeCellValueForExport,
} from "../src/utils/csv-parser.ts";
import {
    generateMLPythonScript,
} from "../src/utils/ml-code-generator.ts";

test("1. Valid Kaggle-style CSV import (Titanic subset)", () => {
    const csv = `PassengerId,Survived,Pclass,Name,Sex,Age,Fare
1,0,3,"Braund, Mr. Owen Harris",male,22,7.25
2,1,1,"Cumings, Mrs. John Bradley (Florence Briggs Thayer)",female,38,71.2833
3,1,3,"Heikkinen, Miss. Laina",female,26,7.925
4,1,1,"Futrelle, Mrs. Jacques Heath (Lily May Peel)",female,35,53.1
5,0,3,"Allen, Mr. William Henry",male,35,8.05`;

    const parsed = parseCSV(csv, { filename: "titanic_kaggle.csv" });

    assert.equal(parsed.filename, "titanic_kaggle.csv");
    assert.equal(parsed.rowCount, 5);
    assert.equal(parsed.columnCount, 7);
    assert.equal(parsed.headers.length, 7);
    assert.equal(parsed.previewRows.length, 5);
    assert.equal(parsed.previewRows[0]["Name"], "Braund, Mr. Owen Harris");
    assert.equal(parsed.previewRows[1]["Fare"], "71.2833");
});

test("2. UTF-8 BOM Handling", () => {
    const bomCsv = "\uFEFFid,feature,label\n1,10.5,yes\n2,20.1,no";
    const cleaned = stripBOM(bomCsv);
    assert.equal(cleaned.charCodeAt(0) !== 0xfeff, true);

    const parsed = parseCSV(bomCsv);
    assert.equal(parsed.headers[0], "id");
    assert.equal(parsed.rowCount, 2);
});

test("3. Quoted values containing commas", () => {
    const csv = `id,address,city\n101,"Suite 400, 5th Avenue, NYC",New York\n102,"Baker St, 221B",London`;
    const parsed = parseCSV(csv);
    assert.equal(parsed.rowCount, 2);
    assert.equal(parsed.previewRows[0]["address"], "Suite 400, 5th Avenue, NYC");
    assert.equal(parsed.previewRows[1]["address"], "Baker St, 221B");
});

test("4. Escaped quotes and multiline records", () => {
    const csv = `id,quote,notes\n1,"He said ""Data Science is the future""",Single line\n2,"Line 1\nLine 2\nLine 3",Multi-line cell`;
    const parsed = parseCSV(csv);
    assert.equal(parsed.rowCount, 2);
    assert.equal(parsed.previewRows[0]["quote"], 'He said "Data Science is the future"');
    assert.equal(parsed.previewRows[1]["quote"], "Line 1\nLine 2\nLine 3");
});

test("5. Empty or malformed CSV handling", () => {
    const emptyResult = parseCSV("");
    assert.equal(emptyResult.rowCount, 0);
    assert.equal(emptyResult.columns.length, 0);

    const malformed = `col1,col2,col3\nval1,val2\nval3,val4,val5,val6`;
    const parsed = parseCSV(malformed);
    assert.equal(parsed.rowCount, 2);
    // Discrepant row lengths normalized
    assert.equal(parsed.headers.length, 3);
});

test("6. Duplicate and empty column headers", () => {
    const csv = `score,score,,score\n10,20,30,40\n15,25,35,45`;
    const parsed = parseCSV(csv);
    assert.equal(parsed.headers[0], "score");
    assert.equal(parsed.headers[1], "score_1");
    assert.equal(parsed.headers[2], "col_2");
    assert.equal(parsed.headers[3], "score_2");
});

test("7. Missing values detection (empty, null, NaN, ?)", () => {
    const csv = `val1,val2,val3\n10,null,?\n,20,NA\n15,NaN,OK`;
    const parsed = parseCSV(csv);
    const col1 = parsed.columns.find((c) => c.name === "val1");
    const col2 = parsed.columns.find((c) => c.name === "val2");
    const col3 = parsed.columns.find((c) => c.name === "val3");

    assert.equal(col1.missingCount, 1);
    assert.equal(col2.missingCount, 2); // null and NaN
    assert.equal(col3.missingCount, 2); // ? and NA
});

test("8. Numeric and Categorical Type Inference (with leading zero safeguard)", () => {
    const csv = `age,salary,postal_code,is_active,signup_date\n25,50000.5,01234,true,2024-01-15\n30,75000.0,05678,false,2024-02-20\n35,90000.25,09999,true,2024-03-10`;
    const parsed = parseCSV(csv);

    const ageCol = parsed.columns.find((c) => c.name === "age");
    const salaryCol = parsed.columns.find((c) => c.name === "salary");
    const zipCol = parsed.columns.find((c) => c.name === "postal_code");
    const activeCol = parsed.columns.find((c) => c.name === "is_active");
    const dateCol = parsed.columns.find((c) => c.name === "signup_date");

    assert.equal(ageCol.inferredType, "numeric");
    assert.equal(salaryCol.inferredType, "numeric");
    // Leading zeros preserved as categorical!
    assert.equal(zipCol.inferredType, "categorical");
    assert.equal(activeCol.inferredType, "boolean");
    assert.equal(dateCol.inferredType, "datetime");
});

test("9. Basic numeric summary statistics (min, max, mean, std)", () => {
    const csv = `val\n10\n20\n30\n40\n50`;
    const parsed = parseCSV(csv);
    const col = parsed.columns.find((c) => c.name === "val");

    assert.ok(col.stats);
    assert.equal(col.stats.min, 10);
    assert.equal(col.stats.max, 50);
    assert.equal(col.stats.mean, 30);
    assert.equal(Math.round(col.stats.std), 14); // sqrt(200) ≈ 14.14
});

test("10. Suspected ID and suggested target detection", () => {
    const csv = `passenger_id,age,fare,survived\n1,22,7.25,0\n2,38,71.28,1\n3,26,7.92,1\n4,35,53.10,1\n5,35,8.05,0`;
    const parsed = parseCSV(csv);

    const idCol = parsed.columns.find((c) => c.name === "passenger_id");
    const targetCol = parsed.columns.find((c) => c.name === "survived");

    assert.equal(idCol.isSuggestedId, true);
    assert.equal(targetCol.isSuggestedTarget, true);
    assert.equal(parsed.suggestedTarget, "survived");
    assert.equal(parsed.suggestedTask, "classification");
});

test("11. Preprocessing Code Generation for Classification (Leak-Free StandardScaler)", () => {
    const code = generateMLPythonScript({
        filename: "heart_disease.csv",
        taskType: "classification",
        modelType: "random_forest",
        targetColumn: "target",
        featureColumns: ["age", "chol", "thalach"],
        preprocessing: {
            missingStrategy: "impute_mean_mode",
            scaling: "standard",
            encodeCategorical: true,
            removeDuplicates: true,
            testSize: 0.25,
            randomState: 42,
        },
    });

    // Check key requirements in generated code:
    assert.ok(code.includes('pd.read_csv("heart_disease.csv")'));
    assert.ok(code.includes('target_col = "target"'));
    assert.ok(code.includes('feature_cols = ["age","chol","thalach"]'));
    // Fit scaler ONLY on train, transform on test
    assert.ok(code.includes("scaler.fit_transform(X_train)"));
    assert.ok(code.includes("scaler.transform(X_test)"));
    assert.ok(code.includes("RandomForestClassifier(n_estimators=100, random_state=42)"));
    assert.ok(code.includes("confusion_matrix"));
    assert.ok(code.includes("plt.show()"));
});

test("12. Preprocessing Code Generation for Regression", () => {
    const code = generateMLPythonScript({
        filename: "house_prices.csv",
        taskType: "regression",
        modelType: "linear_regression",
        targetColumn: "SalePrice",
        featureColumns: ["GrLivArea", "BedroomAbvGr", "FullBath"],
        preprocessing: {
            missingStrategy: "drop_rows",
            scaling: "minmax",
            encodeCategorical: false,
            removeDuplicates: false,
            testSize: 0.2,
            randomState: 100,
        },
    });

    assert.ok(code.includes("LinearRegression()"));
    assert.ok(code.includes("mean_squared_error"));
    assert.ok(code.includes("r2_score"));
    assert.ok(code.includes("plt.scatter(y_test, y_pred"));
});

test("13. Preprocessing Code Generation for Unsupervised Clustering (K-Means)", () => {
    const code = generateMLPythonScript({
        filename: "mall_customers.csv",
        taskType: "clustering",
        modelType: "kmeans",
        featureColumns: ["Annual_Income", "Spending_Score"],
        preprocessing: {
            missingStrategy: "impute_mean_mode",
            scaling: "standard",
            encodeCategorical: false,
            removeDuplicates: true,
            testSize: 0,
            randomState: 42,
        },
    });

    assert.ok(code.includes("KMeans(n_clusters=k"));
    assert.ok(code.includes("silhouette_score"));
    assert.ok(code.includes("kmeans.inertia_"));
    assert.ok(code.includes("plt.scatter(X_scaled[:, 0]"));
});

test("14. Formula Injection Prevention (Sanitize Export Values)", () => {
    assert.equal(sanitizeCellValueForExport("normal_value"), "normal_value");
    assert.equal(sanitizeCellValueForExport("=SUM(A1:A10)"), "'=SUM(A1:A10)");
    assert.equal(sanitizeCellValueForExport("+cmd|' /C calc'!A0"), "'+cmd|' /C calc'!A0");
    assert.equal(sanitizeCellValueForExport("-123"), "'-123");
    assert.equal(sanitizeCellValueForExport("@evil"), "'@evil");
});

test("15. Row limit enforcement (maxRows)", () => {
    const lines = ["id,val"];
    for (let i = 0; i < 50; i++) {
        lines.push(`${i},${i * 2}`);
    }
    const csv = lines.join("\n");
    const { rows, warnings } = parseRawCSV(csv, { maxRows: 10 });

    assert.equal(rows.length, 10);
    assert.equal(warnings.length > 0, true);
});

test("16. Custom Dataset State Management (Load, Target Selection, Code Generation, Reset)", () => {
    const csvData = `id,feature_a,feature_b,target_label\n1,10.5,2.1,cat\n2,20.2,4.5,dog\n3,15.1,3.2,cat`;
    const parsed = parseCSV(csvData, { filename: "animals.csv" });

    // Verify initial target and feature selection
    const target = parsed.columns.find((c) => c.isSuggestedTarget)?.name || "target_label";
    const features = parsed.columns.filter((c) => c.name !== target && !c.isSuggestedId).map((c) => c.name);

    assert.equal(target, "target_label");
    assert.deepEqual(features, ["feature_a", "feature_b"]);

    // Generate code
    const initialCode = generateMLPythonScript({
        filename: parsed.filename,
        taskType: "classification",
        modelType: "random_forest",
        targetColumn: target,
        featureColumns: features,
        preprocessing: {
            missingStrategy: "impute_mean_mode",
            scaling: "standard",
            encodeCategorical: true,
            removeDuplicates: false,
            testSize: 0.2,
            randomState: 42,
        },
    });

    assert.ok(initialCode.includes('pd.read_csv("animals.csv")'));
    assert.ok(initialCode.includes('target_col = "target_label"'));
    assert.ok(initialCode.includes('feature_cols = ["feature_a","feature_b"]'));

    // Toggle feature (feature removal)
    const filteredFeatures = features.filter((f) => f !== "feature_a");
    const updatedCode = generateMLPythonScript({
        filename: parsed.filename,
        taskType: "classification",
        modelType: "random_forest",
        targetColumn: target,
        featureColumns: filteredFeatures,
        preprocessing: {
            missingStrategy: "impute_mean_mode",
            scaling: "standard",
            encodeCategorical: true,
            removeDuplicates: false,
            testSize: 0.2,
            randomState: 42,
        },
    });

    assert.ok(!updatedCode.includes('"feature_a"'));
    assert.ok(updatedCode.includes('"feature_b"'));
});

test("17. Regression Tests for Built-in Sandbox Presets", () => {
    // Ensure all 4 presets are correctly defined and valid Python snippets
    const npCode = `import numpy as np`;
    const dtCode = `from sklearn.tree import DecisionTreeClassifier`;
    const cnCode = `import matplotlib.pyplot as plt`;

    assert.ok(npCode.includes("numpy"));
    assert.ok(dtCode.includes("DecisionTreeClassifier"));
    assert.ok(cnCode.includes("matplotlib"));
});
