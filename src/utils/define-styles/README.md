# 🧩 Guide: Implementing `defineStyles`

## 1. Why `defineStyles`?

We use `defineStyles` as a **type-safe and reusable styling** helper for our React (MUI) components in this project.
It provides:

- ✅ Full **TypeScript type safety**
- ✅ Reusability across multiple components
- ✅ Consistency with MUI's `sx` system
- ✅ Support for **both static styles and style functions**

---

## 2. The `defineStyles` Utility

```ts
// utils/defineStyles.ts
import { SystemStyleObject } from "@mui/system";
import { Theme } from "@mui/material/styles";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StyleDefinition = SystemStyleObject<Theme> | ((...args: any[]) => SystemStyleObject<Theme>);

export default function defineStyles<T extends Record<string, StyleDefinition>>(styles: T) {
    return styles;
}
```

- It wraps MUI's `SystemStyleObject`
- Ensures styles are **typed against `Theme`**
- Supports **both static styles and dynamic style functions**
- Encourages reusable style definitions

---

## 3. Defining Styles in a Component

Instead of SCSS, create a `styles.tsx` next to the component:

### EXAMPLE: Static Styles

```tsx
// BusinessClass/styles.tsx
import defineStyles from "@/utils/defineStyles";

export const businessClassStyles = defineStyles({
    container: {
        "& .content-title": {
            color: "#002f5f",
            fontFamily: "Source Sans Pro !important",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "23px",
            padding: "12px 0px 20px 0px",
        },
        "& .content-subtitle": {
            color: "#002f5f",
            fontFamily: "Inter !important",
            fontSize: "16px",
            fontWeight: 700,
            paddingTop: "15px",
        },
        "& .content-body": {
            color: "#4a4a4a",
            fontFamily: "Source Sans Pro !important",
            fontSize: "14px",
            fontWeight: 400,
            "& .MuiListItem-root": {
                padding: "0px 16px 0px 6px",
                alignItems: "baseline",
                "& .MuiListItemText-primary": {
                    fontSize: "14px",
                },
            },
        },
        "& .content-note": {
            color: "#4a4a4a",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "18px",
            paddingTop: "8px",
        },
    },

    card: {
        backgroundSize: "cover",
        aspectRatio: "1/1",
        borderRadius: "24px",
        maxWidth: "95%",
        margin: "0 4px",
    },
});
```

### EXAMPLE: Dynamic Style Functions

```tsx
// Button/styles.tsx
import defineStyles from "@/utils/defineStyles";

export const buttonStyles = defineStyles({
    // Static style
    base: {
        borderRadius: "8px",
        padding: "8px 16px",
        fontWeight: 600,
    },

    // Dynamic style function
    variant: (variant: "primary" | "secondary") => ({
        backgroundColor: variant === "primary" ? "#002f5f" : "transparent",
        color: variant === "primary" ? "white" : "#002f5f",
        border: variant === "secondary" ? "2px solid #002f5f" : "none",
    }),

    // Dynamic style with theme access
    responsive: (theme: Theme) => ({
        padding: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
        },
    }),
});
```

---

## 4. Using Styles in a Component

```tsx
// BusinessClass/index.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { businessClassStyles as styles } from "./styles";

export default function BusinessClass() {
    return (
        <Box sx={styles.container}>
            <Typography className="content-title">Business Class</Typography>
            <Box sx={{ ...styles.card, backgroundImage: "url('/img.png')" }} />
            <Typography className="content-note">*Note text*</Typography>
        </Box>
    );
}
```

### Using Dynamic Style Functions:

```tsx
// Button/index.tsx
import Box from "@mui/material/Box";
import { buttonStyles as styles } from "./styles";

export default function Button({ variant = "primary" }) {
    return (
        <Box
            sx={[
                styles.base,
                styles.variant(variant), // Pass arguments to style function
                styles.responsive, // Theme is automatically injected when needed
            ]}
        >
            Click me
        </Box>
    );
}
```

---

## 5. Best Practices

### 🔹 DO

- ✅ Define styles in a **dedicated `styles.tsx`** file
- ✅ Use **semantic keys** (`container`, `card`, `title`, etc.)
- ✅ Keep `sx={styles.something}` usage consistent
- ✅ Share reusable styles across components
- ✅ Use **style functions for dynamic styles** that depend on props or theme
- ✅ Use **static styles for constant, unchanging styles**

### 🔸 DON'T

- ❌ Mix SCSS and `sx` in the same component (migration should be clean)
- ❌ Hardcode colors/fonts → prefer theme tokens when possible
- ❌ Use random keys like `box1`, `box2` → always name by role
- ❌ Overuse dynamic functions for static styles

---

## 6. Reusability Example

You can export & reuse styles in multiple components:

```tsx
// sharedStyles.ts
import defineStyles from "@/utils/defineStyles";

export const sharedCardStyles = defineStyles({
    baseCard: {
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },

    // Dynamic function for different card sizes
    cardSize: (size: "small" | "medium" | "large") => ({
        padding: size === "small" ? "8px" : size === "medium" ? "16px" : "24px",
    }),
});
```

```tsx
// ComponentA.tsx
<Box sx={[sharedCardStyles.baseCard, sharedCardStyles.cardSize("small")]}>
  Card A
</Box>

// ComponentB.tsx
<Box sx={[
  sharedCardStyles.baseCard,
  sharedCardStyles.cardSize("large"),
  { background: "lightblue" }
]}>
  Card B
</Box>
```

---

## 7. Migration from SCSS → `defineStyles`

1. Identify SCSS blocks (`.container`, `.title`, etc.)
2. Move them into `styles.tsx` with `defineStyles`
3. Replace `className`-only usage with `sx={styles.key}`
4. For dynamic styles that use SCSS variables or mixins, convert to style functions
5. For theme-dependent values, use style functions that accept the `Theme` parameter

---

## 8. Key Benefits of the Updated `defineStyles`

- **Flexibility**: Supports both static styles and dynamic functions
- **Type Safety**: Full TypeScript support for all style definitions
- **Theme Integration**: Automatic theme injection in style functions
- **Performance**: Static styles are optimized, dynamic functions are computed only when needed
- **Consistency**: Unified approach for all styling needs in the project
