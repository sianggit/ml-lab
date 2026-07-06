import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface SelectBaseProps
    extends Omit<TextFieldProps, "select" | "value" | "onChange"> {
    options: SelectOption[];
    value?: string | number;
    placeholder?: string;

    searchable?: boolean;
    searchValue?: string;
    onSearchChange?: (val: string) => void;

    helper?: (params: {
        page: number;
        search: string;
    }) => Promise<SelectOption[]>;

    hasMore?: boolean;
    loadingMore?: boolean;
    onLoadMore?: () => void;

    onChange?: (value: string | number) => void;
}

export default function SelectBase({
    options,
    value,
    placeholder,

    searchable = false,
    searchValue = "",
    onSearchChange,

    hasMore,
    loadingMore,
    onLoadMore,

    onChange,
    ...props
}: SelectBaseProps) {
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    const [open, setOpen] = useState(false);

    const selectedValue = String(value ?? "");

    // CLIENT FILTER
    const filteredOptions = useMemo(() => {
        if (!searchable || !searchValue) return options;

        return options.filter((o) =>
            (o.label ?? "").toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [options, searchValue, searchable]);

    const selectedLabel = useMemo(
        () => options.find((o) => String(o.value) === selectedValue)?.label,
        [options, selectedValue]
    );

    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    // Focus the search input once the popper is open & mounted
    useEffect(() => {
        if (open && searchable) {
            // Defer slightly so Popper has mounted into the DOM
            const id = requestAnimationFrame(() => {
                searchRef.current?.focus();
            });
            return () => cancelAnimationFrame(id);
        }
    }, [open, searchable]);

    const handleSelect = (option: SelectOption) => {
        if (option.disabled) return;
        onChange?.(option.value);
        handleClose();
    };

    const handleClearValue = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.("");
        onSearchChange?.("");
    };

    const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
        const el = e.currentTarget;
        const bottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

        if (bottom && hasMore && !loadingMore) {
            onLoadMore?.();
        }
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box ref={anchorRef} sx={{ position: "relative" }}>
                <TextField
                    {...props}
                    fullWidth
                    value={selectedLabel ?? ""}
                    placeholder={placeholder}
                    onClick={handleOpen}
                    inputProps={{
                        readOnly: true,
                        style: { cursor: "pointer" },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {value ? (
                                    <IconButton
                                        size="small"
                                        onClick={handleClearValue}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                ) : null}
                                <ArrowDropDownIcon
                                    sx={{
                                        color: "action.active",
                                        transform: open
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                        transition: "transform 0.15s",
                                        pointerEvents: "none",
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />

                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    style={{ zIndex: 9999, width: anchorRef.current?.clientWidth }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            mt: 0.5,
                            overflow: "hidden",
                            width: "100%",
                        }}
                    >
                        {/* SEARCH HEADER */}
                        {searchable && (
                            <Box
                                sx={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 2,
                                    backgroundColor: "background.paper",
                                    p: 1,
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                <TextField
                                    inputRef={searchRef}
                                    size="small"
                                    fullWidth
                                    autoFocus
                                    placeholder="Search..."
                                    value={searchValue}
                                    onChange={(e) =>
                                        onSearchChange?.(e.target.value)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchValue ? (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        onSearchChange?.("");
                                                        searchRef.current?.focus();
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null,
                                    }}
                                />
                            </Box>
                        )}

                        <List
                            ref={listRef}
                            onScroll={handleScroll}
                            sx={{ maxHeight: 320, overflowY: "auto", py: 0 }}
                        >
                            {filteredOptions.map((option) => (
                                <ListItemButton
                                    key={option.value}
                                    selected={String(option.value) === selectedValue}
                                    disabled={option.disabled}
                                    onClick={() => handleSelect(option)}
                                >
                                    <ListItemText primary={option.label} />
                                </ListItemButton>
                            ))}

                            {loadingMore && (
                                <Box display="flex" justifyContent="center" p={1}>
                                    <CircularProgress size={18} />
                                </Box>
                            )}

                            {!loadingMore && filteredOptions.length === 0 && (
                                <Box p={2} textAlign="center">
                                    <Typography variant="body2">
                                        No options
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
}