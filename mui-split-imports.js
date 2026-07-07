/* eslint-env node */
/**
 * Converting `import { Box, Button } from '@mui/material'`
 * to individual imports like `import Box from '@mui/material/Box'`,
 * while keeping excluded imports grouped.
 */

module.exports = function transformer(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    // Excluded names that should stay in grouped imports
    const excluded = new Set([
        "SxProps",
        "Theme",
        "Palette",
        "Breakpoint",
        "Components",
        "TypographyProps",
        "SvgIconTypeMap",
        "OverridableComponent",
        "keyframes",
    ]);

    root.find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === "@mui/material")
        .forEach((path) => {
            const specifiers = path.node.specifiers;

            const keepGrouped = specifiers.filter((spec) => spec.imported && excluded.has(spec.imported.name));

            const splitOut = specifiers.filter((spec) => spec.imported && !excluded.has(spec.imported.name));

            const individualImports = splitOut.map((spec) => {
                const name = spec.imported.name;
                return j.importDeclaration(
                    [j.importDefaultSpecifier(j.identifier(name))],
                    j.literal(`@mui/material/${name}`),
                );
            });

            if (keepGrouped.length > 0) {
                const groupedImport = j.importDeclaration(keepGrouped, j.literal("@mui/material"));
                individualImports.unshift(groupedImport);
            }

            j(path).replaceWith(individualImports);
        });

    root.find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === "@mui/icons-material")
        .forEach((path) => {
            const specifiers = path.node.specifiers;

            const individualImports = specifiers.map((spec) => {
                const name = spec.imported.name;
                return j.importDeclaration(
                    [j.importDefaultSpecifier(j.identifier(name))],
                    j.literal(`@mui/icons-material/${name}`)
                );
            });

            j(path).replaceWith(individualImports);
        });

    root.find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === "reicon-react")
        .forEach((path) => {
            const specifiers = path.node.specifiers ?? [];

            const individualImports = specifiers
                .filter((spec) => spec.type === "ImportSpecifier")
                .map((spec) => {
                    const name = spec.imported.name;
                    return j.importDeclaration(
                        [j.importDefaultSpecifier(j.identifier(name))],
                        j.literal(`reicon-react/icons/${name}`)
                    );
                });

            j(path).replaceWith(individualImports);
        });


    return root.toSource({ quote: "single" });
};
