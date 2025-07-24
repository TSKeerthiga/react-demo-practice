import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { sampleData } from './SampleData';
import { parseCell, getNextCell, getRange } from './utils/Utils';
import { createEmptyGrid } from './helpers/createEmptyGrid';
import { getColumnLabel } from './helpers/getColumnLabel';
import useCurrentAndPrevious from './hooks/useCurrentAndPrevious';
import { Modifiers } from './types';

export function useSpreadsheetLogic(rowCount = 30, colCount = 30) {
    const [inputName, setInputName, prevInputName] = useCurrentAndPrevious('');
    const [editModeCell, setEditModeCell] = useState<string | null>(null);
    const [validateTabShiftInputName, setValidateTabShiftInputName] = useState('');
    const [selectedCells, setSelectedCells] = useState<string[]>([]);
    const [isExtendedSelect, setIsExtendedSelect] = useState(false);
    const [isValidateMultiplePress, setIsValidateMultiplePress] = useState(false);
    const [ctrlShiftAnchor, setCtrlShiftAnchor] = useState<string | null>(null);
    const [focusedCell, setFocusedCell] = useState('A1');
    const [anchorCell, setAnchorCell] = useState<string | null>(null);
    const [undoStack, setUndoStack] = useState<{ [cell: string]: string }[]>([]);
    const [redoStack, setRedoStack] = useState<{ [cell: string]: string }[]>([]);

    const columnLabels = useMemo(() => {
        return Array.from({ length: colCount }, (_, i) => getColumnLabel(i));
    }, [colCount]);

    const getCellKey = useCallback((row: number, col: number) => `${getColumnLabel(col)}${row + 1}`, []);

    const [tableData, setTableData] = useState(createEmptyGrid(rowCount, colCount));

    useEffect(() => {
        const loadedData = createEmptyGrid(rowCount, colCount);
        const headers = Object.keys(sampleData[0]);

        headers.forEach((header, headIndex) => {
            loadedData[getCellKey(0, headIndex)] = header;
        });

        sampleData.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                loadedData[getCellKey(rowIndex + 1, colIndex)] = String(value);
            });
        });

        setTableData(loadedData);
    }, [getCellKey, rowCount, colCount]);

    const focusInput = (nextCellValue: any) => {
        requestAnimationFrame(() => {
            const nextInput: any = document.querySelector(`input[name="${nextCellValue}"]`);
            nextInput?.focus();
        });
        setValidateTabShiftInputName(nextCellValue);
    };

    const handleChangeCell = useCallback((key: string, value: string) => {
        setTableData(prev => {
            if (prev[key] === value) return prev;
            return { ...prev, [key]: value };
        });
    }, []);

    const handleOnClick = (
        cellKey: string,
        modifiers: Modifiers,
        e?: React.MouseEvent 
    ) => {
        const { shiftKey, ctrlKey, altKey } = modifiers;

        if (shiftKey && anchorCell) {
            const newRange = getRange(anchorCell, cellKey);
            setSelectedCells(newRange);
            setFocusedCell(cellKey);
            focusInput(cellKey);

            if (!ctrlShiftAnchor) {
                setCtrlShiftAnchor(anchorCell);
            }

            setIsExtendedSelect(true);
            setIsValidateMultiplePress(false);
        } else {
            setAnchorCell(cellKey);
            setFocusedCell(cellKey);
            setSelectedCells([]);
            setCtrlShiftAnchor(cellKey);
            setIsExtendedSelect(false);
            setIsValidateMultiplePress(false);
        }

        setValidateTabShiftInputName(cellKey);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const currentName = e.currentTarget.name;

        if (e.key === 'Enter') {
            e.preventDefault();
            if (editModeCell !== currentName) {
                setEditModeCell(currentName);
            } else {
                const nextCell = getNextCell(currentName, 'ArrowDown');
                setEditModeCell(null);
                setInputName(nextCell);
                focusInput(nextCell);
            }
        } else if (e.shiftKey && e.ctrlKey && e.key === "ArrowDown") {
            handleCtrlShiftArrow(parseCell(currentName), "Down");
        } else if (e.shiftKey && e.ctrlKey && e.key === "ArrowUp") {
            handleCtrlShiftArrow(parseCell(currentName), "Up");
        } else if (e.ctrlKey && e.key.toLowerCase() === 'a') {
            handleSelectAll();
        } else if (e.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            if (!anchorCell) setAnchorCell(currentName);
            const next = getNextCell(currentName, e.key);
            const range = getRange(anchorCell || currentName, next);
            setSelectedCells(range);
            setFocusedCell(next);
            focusInput(next);
            e.preventDefault();
        } else if (!e.shiftKey && !e.ctrlKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            const nextCell = getNextCell(currentName, e.key);
            if (nextCell) focusInput(nextCell);
        } else if (e.key === 'Tab' && e.shiftKey) {
            setValidateTabShiftInputName(currentName);
        } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            handleCopySelectedCells();
        } else if (e.ctrlKey && e.key.toLowerCase() === 'v') {
            e.preventDefault();
            handlePasteClipboardData(currentName);
        } else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            handleUndo();
        } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            handleRedo();
        }
    };

    const handleCtrlShiftArrow = (match: any, direction: string) => {
        const baseKey = ctrlShiftAnchor || `${match[1]}${match[2]}`;
        const anchorMatch = baseKey.match(/^([A-Z]+)(\d+)$/);
        if (!anchorMatch) return;

        const col = anchorMatch[1];
        const row = parseInt(anchorMatch[2]);
        const currentKey = `${col}${row}`;
        const currentVal = tableData[currentKey];
        let selected: string[] = [];

        if (direction === "Down") {
            if (isExtendedSelect && !isValidateMultiplePress) {
                for (let i = row; i <= rowCount; i++) {
                    selected.push(`${col}${i}`);
                }
                setIsValidateMultiplePress(true);
            } else if (!isExtendedSelect) {
                setCtrlShiftAnchor(currentKey);
                const matchType = currentVal?.trim() ? "nonEmpty" : "empty";

                for (let i = row; i <= rowCount; i++) {
                    const key = `${col}${i}`;
                    const val = tableData[key];
                    const isNonEmpty = val && val.trim() !== "";

                    if (
                        (matchType === "nonEmpty" && isNonEmpty) ||
                        (matchType === "empty" && !isNonEmpty)
                    ) {
                        selected.push(key);
                    } else {
                        break;
                    }
                }

                setIsExtendedSelect(true);
            }
        } else if (direction === "Up") {
            if (isExtendedSelect && !isValidateMultiplePress) {
                for (let i = row; i >= 1; i--) {
                    selected.push(`${col}${i}`);
                }
                setIsValidateMultiplePress(true);
            } else if (!isExtendedSelect) {
                setCtrlShiftAnchor(currentKey);
                const matchType = currentVal?.trim() ? "nonEmpty" : "empty";

                for (let i = row; i >= 1; i--) {
                    const key = `${col}${i}`;
                    const val = tableData[key];
                    const isNonEmpty = val && val.trim() !== "";

                    if (
                        (matchType === "nonEmpty" && isNonEmpty) ||
                        (matchType === "empty" && !isNonEmpty)
                    ) {
                        selected.push(key);
                    } else {
                        break;
                    }
                }

                setIsExtendedSelect(true);
            }
        }

        selectCellsAndInput(selected);
    };

    const handleSelectAll = () => {
        const selected: string[] = [];

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                const key = getCellKey(i, j);
                const value = tableData[key];
                if (value && value.trim() !== '') {
                    selected.push(key);
                }
            }
        }
        selectCellsAndInput(selected);
    };

    const selectCellsAndInput = (selected: any) => {
        if (selected.length > 0) {
            const lastCell = selected[selected.length - 1];
            console.log("lastCell", lastCell)
            setSelectedCells(selected);
            focusInput(lastCell);
            setInputName(lastCell);
        }
    }

    const handleCopySelectedCells = () => {
        const cellsToCopy = selectedCells.length > 0 ? selectedCells : [focusedCell];
        if (cellsToCopy.length === 0) return;

        const sorted = [...cellsToCopy].sort((a, b) => {
            const aParsed = parseCell(a)!;
            const bParsed = parseCell(b)!;
            return aParsed.row !== bParsed.row
                ? aParsed.row - bParsed.row
                : aParsed.col.charCodeAt(0) - bParsed.col.charCodeAt(0);
        });

        let clipboardText = ''

        if (sorted.length === 1) {
            clipboardText = tableData[sorted[0]] || '';
        } else {

            // Group by rows
            const rowMap: Record<number, Record<string, string>> = {};
            for (const cell of sorted) {
                const { row, col } = parseCell(cell)!;
                if (!rowMap[row]) rowMap[row] = {};
                rowMap[row][col] = tableData[cell];
            }

            const rows = Object.keys(rowMap)
                .sort((a, b) => +a - +b)
                .map((rowNum) => {
                    const cols = rowMap[+rowNum];
                    console.log("cols", cols);
                    const colKeys = Object.keys(cols).sort();
                    console.log("colKeys", colKeys);
                    return colKeys.map((col) => cols[col]).join('\t');
                });

            clipboardText = rows.join('\n');
        }
        navigator.clipboard.writeText(clipboardText).then(() => {
            console.log("Copied to clipboard:\n", clipboardText);
        }).catch((err) => {
            console.error("Copy failed:", err);
        });
    };

    const handlePasteClipboardData = async (startCell: string) => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const start = parseCell(startCell);
            if (!start) return;

            const isTabular = clipboardText.includes('\n') || clipboardText.includes('\t');

            const rows = isTabular
                ? clipboardText.split('\n').map(row => row.split('\t'))
                : [[clipboardText]];

            setTableData(prev => {
                const snapshot = JSON.parse(JSON.stringify(prev));
                setUndoStack(stack => [snapshot, ...stack.slice(0, 4)]);

                const updated = { ...prev };

                if (!isTabular && rows.length === 1 && rows[0].length === 1) {
                    updated[startCell] = clipboardText;
                    return updated;
                }

                rows.forEach((rowVals, rIdx) => {
                    rowVals.forEach((value, cIdx) => {
                        const targetRow = start.row - 1 + rIdx;
                        const targetCol = start.col.charCodeAt(0) - 65 + cIdx;

                        if (targetRow < rowCount && targetCol < colCount) {
                            const key = getCellKey(targetRow, targetCol);
                            updated[key] = value;
                        }
                    });
                });

                return updated;
            });

        } catch (err) {
            console.error("Paste failed:", err);
        }
    };

    const handleUndo = () => {
        if (undoStack.length === 0) return;

        setTableData((current) => {
            const [lastState, ...rest] = undoStack;

            setRedoStack((redo) => [JSON.parse(JSON.stringify(current)), redo.slice(0, 4)]); // save current state for redo
            // Optionally clear the focused cell
            const clearedState = {
                ...lastState,
                ...(focusedCell ? { [focusedCell]: '' } : {}),
            };

            setUndoStack(rest);
            return clearedState;
        });

    };


    const handleRedo = () => {
        if (redoStack.length === 0) return;

        setTableData((current) => {
            const [redoState, ...rest] = redoStack;

            setUndoStack((undo) => [JSON.parse(JSON.stringify(current)), undo.slice(0, 4)]); // save current state for redo

            setRedoStack(rest);
            return {
                ...redoState,
            };
        });

    };

    return {
        rowCount,
        colCount,
        tableData,
        columnLabels,
        getCellKey,
        handleKeyPress,
        handleChangeCell,
        handleOnClick,
        selectedCells
    };
}
