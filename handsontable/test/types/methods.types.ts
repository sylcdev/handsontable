import { BasePlugin } from 'handsontable/plugins';
import Handsontable from 'handsontable';

const mockTD = document.createElement('td');
const elem = document.createElement('div');
const hot = new Handsontable(elem, {});
const cellProperties: Handsontable.CellProperties = {
  row: 0,
  col: 0,
  instance: hot,
  visualRow: 0,
  visualCol: 0,
  prop: 'foo'
};

hot.addHook('afterChange', (changes: any[] | null, source: string) => {});
hot.addHook('afterChange', [(changes: any[] | null, source: string) => {}]);
hot.addHookOnce('afterChange', (changes: Handsontable.CellChange[] | null, source: Handsontable.ChangeSource) => {});
hot.addHookOnce('afterChange', [(changes: Handsontable.CellChange[] | null, source: Handsontable.ChangeSource) => {}]);
hot.alter('insert_row', [[0, 0], [1, 2]], 123, 'foo', true);
hot.alter('insert_row', 123, 123, 'foo', true);
hot.alter('insert_row');
hot.batch(() => 'string').toUpperCase();
hot.batch(() => 12345).toFixed();
hot.batch(() => {});
hot.batchExecution(() => 'string', true).toUpperCase();
hot.batchExecution(() => 12345, false).toFixed();
hot.batchRender(() => 'string').toUpperCase();
hot.batchRender(() => 12345).toFixed();
hot.clear();
hot.clearUndo();
hot.colOffset() === 123;
hot.colToProp(123) === 'foo';
hot.countCols() === 123;
hot.countEmptyCols(true) === 123;
hot.countEmptyRows(true) === 123;
hot.countRenderedCols() === 123;
hot.countRenderedRows() === 123;
hot.countRows() === 123;
hot.countSourceRows() === 123;
hot.countVisibleCols() === 123;
hot.countVisibleRows() === 123;
hot.deselectCell();
hot.destroy();
hot.destroyEditor(true, true);
hot.emptySelectedCells();
hot.getActiveEditor();
hot.getCell(123, 123, true)!.focus();
hot.getCellEditor(123, 123);
hot.getCellMeta(123, 123).type === "text";
hot.getCellMetaAtRow(123).forEach(meta => meta.type === "text");
hot.getCellRenderer(123, 123)(hot, mockTD, 1, 2, 'prop', '', cellProperties);
hot.getCellsMeta()[0].visualRow;
hot.getCellValidator(123, 123);
hot.getColHeader().forEach((header: number | string) => {});
hot.getColHeader(123).toString();
hot.getColWidth(123) === 123;
hot.getCoords(elem.querySelector('td')).row === 0;
hot.getCopyableData(123, 123).toUpperCase();
hot.getCopyableText(123, 123, 123, 123).toUpperCase();
hot.getData(123, 123, 123, 123).forEach(v => v === '');
hot.getDataAtCell(123, 123) === '';
hot.getDataAtCol(123).forEach(v => v === '');
hot.getDataAtProp(123).forEach(v => v === '');
hot.getDataAtRow(123).forEach(v => v === '');
hot.getDataAtRowProp(123, 'foo') === '';
hot.getDataType(123, 123, 123, 123) === 'text';
hot.getDirectionFactor() === 1;

const _hot: Handsontable = hot.getInstance();

hot.getRowHeader().forEach(header => header.toString());
hot.getRowHeader(123) === '';
hot.getRowHeight(123) === 123;
hot.getSchema()['foo'];
hot.getSelected()![0][0] === 123;
hot.getSelectedLast()![0] === 123;
hot.getSelectedRange()![0].from.row === 123;
hot.getSelectedRangeLast()!.to.col === 123;
hot.getSettings().type === 'text';
hot.getShortcutManager();
hot.getSourceData()[0];
hot.getSourceData(123, 123, 123, 123)[0];
hot.getSourceDataAtCell(123, 123) === '';
hot.getSourceDataAtCol(123)[0] === '';
hot.getSourceDataAtRow(123) as any[];
hot.getTranslatedPhrase('foo', 123)!.toLowerCase();
hot.getValue() === '';

const hasColHeaders: boolean = hot.hasColHeaders();
const hasHook: boolean = hot.hasHook('afterChange');
const hasRowHeaders: boolean = hot.hasRowHeaders();

hot.init() === void 0;

const isColumnModificationAllowed: boolean = hot.isColumnModificationAllowed();
const isEmptyCol: boolean = hot.isEmptyCol(123);
const isEmptyRow: boolean = hot.isEmptyRow(123);
const isExecutionSuspended: boolean = hot.isExecutionSuspended();
const isListening: boolean = hot.isListening();
const isLtr: boolean = hot.isLtr();
const isRedoAvailable: boolean = hot.isRedoAvailable();
const isRenderSuspended: boolean = hot.isRenderSuspended();
const isRtl: boolean = hot.isRtl();
const isUndoAvailable: boolean = hot.isUndoAvailable();

hot.listen();
hot.loadData([[1, 2, 3], [1, 2, 3]]);
hot.loadData([{ a: 'a', b: 2, c: '' }, { a: 'a', b: 2, c: '' }]);
hot.populateFromArray(123, 123, [], 123, 123, 'foo', 'shift_down', 'left', []);
hot.propToCol('foo') === 123;
hot.propToCol(123) === 123;
hot.redo();
hot.refreshDimensions();
hot.removeCellMeta(123, 123, 'foo');
hot.removeHook('afterChange', () => {});
hot.render();
hot.resumeExecution();
hot.resumeRender();
hot.rowOffset() === 123;
hot.runHooks('afterChange', 123, 'foo', true, {}, [], () => {});
hot.selectAll();
hot.selectCell(123, 123, 123, 123, true, true);
hot.selectCellByProp(123, 'foo', 123, 'foo', true);
hot.selectCells([[123, 'prop1', 123, 'prop2']], true, true);
hot.selectCells([[123, 123, 123, 123]], true, true);
hot.selectColumns(1, 4);
hot.selectColumns(1);
hot.selectRows(1, 4);
hot.selectRows(1);
hot.setCellMeta(123, 123, 'foo', 'foo');
hot.setCellMetaObject(123, 123, {});
hot.setDataAtCell([[123, 123, 'foo'], [123, 123, {myProperty: 'foo'}]], 'foo');
hot.setDataAtCell(123, 123, 'foo', 'foo');
hot.setDataAtCell(123, 123, {myProperty: 'foo'}, 'foo');
hot.setDataAtRowProp([[123, 'foo', 'foo'], [123, 'foo', 'foo']], 'foo');
hot.setDataAtRowProp(123, 'foo', 'foo', 'foo');
hot.setSourceDataAtCell([[1, 'foo', 'foo']]);
hot.setSourceDataAtCell(123, 123, 'foo', 'sourceString');
hot.setSourceDataAtCell(123, 123, 'foo');
hot.spliceCol(123, 123, 123, 'foo');
hot.spliceRow(123, 123, 123, 'foo');
hot.suspendExecution();
hot.suspendRender();
hot.toPhysicalColumn(123) === 123;
hot.toPhysicalRow(123) === 123;
hot.toVisualColumn(123) === 123;
hot.toVisualRow(123) === 123;
hot.undo();
hot.unlisten();
hot.updateData([[1, 2, 3], [1, 2, 3]]);
hot.updateData([{ a: 'a', b: 2, c: '' }, { a: 'a', b: 2, c: '' }]);
hot.updateSettings({}, true);
hot.validateCell('test', cellProperties, (valid: boolean) => {}, 'sourceString');
hot.validateCells((valid: boolean) => {});
hot.validateColumns([1, 2, 3], (valid: boolean) => {});
hot.validateRows([1, 2, 3], (valid: boolean) => {});

const isDestroyed: boolean = hot.isDestroyed;
const testToHTMLTableElement: HTMLTableElement = hot.toTableElement();
const testToHTML: string = hot.toHTML();

const autoColumnSize = hot.getPlugin('autoColumnSize');

autoColumnSize.inProgress;

autoColumnSize.calculateVisibleColumnsWidth();
autoColumnSize.isEnabled();

const autofill: BasePlugin = hot.getPlugin('autofill');
const autoRowSize: BasePlugin = hot.getPlugin('autoRowSize');
const bindRowsWithHeaders: BasePlugin = hot.getPlugin('bindRowsWithHeaders');
const collapsibleColumns: BasePlugin = hot.getPlugin('collapsibleColumns');
const columnSorting: BasePlugin = hot.getPlugin('columnSorting');
const columnSummary: BasePlugin = hot.getPlugin('columnSummary');
const comments: BasePlugin = hot.getPlugin('comments');
const contextMenu: BasePlugin = hot.getPlugin('contextMenu');
const copyPaste: BasePlugin = hot.getPlugin('copyPaste');
const customBorders: BasePlugin = hot.getPlugin('customBorders');
const dragToScroll: BasePlugin = hot.getPlugin('dragToScroll');
const dropdownMenu: BasePlugin = hot.getPlugin('dropdownMenu');
const exportFile: BasePlugin = hot.getPlugin('exportFile');
const filters: BasePlugin = hot.getPlugin('filters');
const formulas: BasePlugin = hot.getPlugin('formulas');
const hiddenColumns: BasePlugin = hot.getPlugin('hiddenColumns');
const hiddenRows: BasePlugin = hot.getPlugin('hiddenRows');
const manualColumnFreeze: BasePlugin = hot.getPlugin('manualColumnFreeze');
const manualColumnMove: BasePlugin = hot.getPlugin('manualColumnMove');
const manualColumnResize: BasePlugin = hot.getPlugin('manualColumnResize');
const manualRowMove: BasePlugin = hot.getPlugin('manualRowMove');
const manualRowResize: BasePlugin = hot.getPlugin('manualRowResize');
const mergeCells: BasePlugin = hot.getPlugin('mergeCells');
const multiColumnSorting: BasePlugin = hot.getPlugin('multiColumnSorting');
const multipleSelectionHandles: BasePlugin = hot.getPlugin('multipleSelectionHandles');
const nestedHeaders: BasePlugin = hot.getPlugin('nestedHeaders');
const nestedRows: BasePlugin = hot.getPlugin('nestedRows');
const persistentState: BasePlugin = hot.getPlugin('persistentState');
const search: BasePlugin = hot.getPlugin('search');
const touchScroll: BasePlugin = hot.getPlugin('touchScroll');
const trimRows: BasePlugin = hot.getPlugin('trimRows');
const undoRedo: BasePlugin = hot.getPlugin('undoRedo');
const custom: BasePlugin = hot.getPlugin('custom');
