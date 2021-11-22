import {
  innerHeight,
  innerWidth,
  getScrollLeft,
  getScrollTop,
  offset,
} from './../../../helpers/dom/element';

/**
 * @class Scroll
 */
class Scroll {
  /**
   * @param {Walkontable} wotInstance The Walkontable instance.
   */
  constructor(wotInstance) {
    this.wot = wotInstance;
  }

  /**
   * Scrolls viewport to a cell.
   *
   * @param {CellCoords} coords The cell coordinates.
   * @param {boolean} [snapToTop] If `true`, viewport is scrolled to show the cell on the top of the table.
   * @param {boolean} [snapToRight] If `true`, viewport is scrolled to show the cell on the right of the table.
   * @param {boolean} [snapToBottom] If `true`, viewport is scrolled to show the cell on the bottom of the table.
   * @param {boolean} [snapToLeft] If `true`, viewport is scrolled to show the cell on the left of the table.
   * @returns {boolean}
   */
  scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft) {
    if (coords.col < 0 || coords.row < 0) {
      return false;
    }
    const scrolledHorizontally = this.scrollViewportHorizontally(coords.col, snapToRight, snapToLeft);
    const scrolledVertically = this.scrollViewportVertically(coords.row, snapToTop, snapToBottom);

    return scrolledHorizontally || scrolledVertically;
  }

  /**
   * Scrolls viewport to a column.
   *
   * @param {number} column Visual column index.
   * @param {boolean} [snapToRight] If `true`, viewport is scrolled to show the cell on the right of the table.
   * @param {boolean} [snapToLeft] If `true`, viewport is scrolled to show the cell on the left of the table.
   * @returns {boolean}
   */
  scrollViewportHorizontally(column, snapToRight, snapToLeft) {
    if (!this.wot.drawn) {
      return false;
    }

    const {
      fixedColumnsStart,
      leftOverlay,
      totalColumns,
    } = this._getVariables();
    let result = false;

    if (column >= 0 && column <= Math.max(totalColumns - 1, 0)) {
      const firstVisibleColumn = this.getFirstVisibleColumn();
      const lastVisibleColumn = this.getLastVisibleColumn();

      if (column >= fixedColumnsStart && firstVisibleColumn > -1 && (column < firstVisibleColumn || snapToLeft)) {
        result = leftOverlay.scrollTo(column);
      } else if (lastVisibleColumn === -1 || lastVisibleColumn > -1 && (column > lastVisibleColumn || snapToRight)) {
        result = leftOverlay.scrollTo(column, true);
      }
    }

    return result;
  }

  /**
   * Scrolls viewport to a row.
   *
   * @param {number} row Visual row index.
   * @param {boolean} [snapToTop] If `true`, viewport is scrolled to show the cell on the top of the table.
   * @param {boolean} [snapToBottom] If `true`, viewport is scrolled to show the cell on the bottom of the table.
   * @returns {boolean}
   */
  scrollViewportVertically(row, snapToTop, snapToBottom) {
    if (!this.wot.drawn) {
      return false;
    }

    const {
      fixedRowsBottom,
      fixedRowsTop,
      topOverlay,
      totalRows,
    } = this._getVariables();
    let result = false;

    if (row >= 0 && row <= Math.max(totalRows - 1, 0)) {
      const firstVisibleRow = this.getFirstVisibleRow();
      const lastVisibleRow = this.getLastVisibleRow();

      if (row >= fixedRowsTop && firstVisibleRow > -1 && (row < firstVisibleRow || snapToTop)) {
        result = topOverlay.scrollTo(row);
      } else if (lastVisibleRow === -1 || lastVisibleRow > -1 &&
                ((row > lastVisibleRow && row < totalRows - fixedRowsBottom) || snapToBottom)) {
        result = topOverlay.scrollTo(row, true);
      }
    }

    return result;
  }

  /**
   * Get first visible row based on virtual dom and how table is visible in browser window viewport.
   *
   * @returns {number}
   */
  getFirstVisibleRow() {
    const {
      topOverlay,
      wtTable,
      wtViewport,
      totalRows,
      fixedRowsTop,
    } = this._getVariables();
    const rootWindow = this.wot.rootWindow;

    let firstVisibleRow = wtTable.getFirstVisibleRow();

    if (topOverlay.mainTableScrollableElement === rootWindow) {
      const rootElementOffset = offset(wtTable.wtRootElement);
      const totalTableHeight = innerHeight(wtTable.hider);
      const windowHeight = innerHeight(rootWindow);
      const windowScrollTop = getScrollTop(rootWindow, rootWindow);

      // Only calculate firstVisibleRow when table didn't filled (from up) whole viewport space
      if (rootElementOffset.top + totalTableHeight - windowHeight <= windowScrollTop) {
        let rowsHeight = wtViewport.getColumnHeaderHeight();

        rowsHeight += topOverlay.sumCellSizes(0, fixedRowsTop);

        for (let row = totalRows; row > 0; row--) {
          rowsHeight += topOverlay.sumCellSizes(row - 1, row);

          if (rootElementOffset.top + totalTableHeight - rowsHeight <= windowScrollTop) {
            // Return physical row + 1
            firstVisibleRow = row;
            break;
          }
        }
      }
    }

    return firstVisibleRow;
  }

  /**
   * Get last visible row based on virtual dom and how table is visible in browser window viewport.
   *
   * @returns {number}
   */
  getLastVisibleRow() {
    const {
      topOverlay,
      wtTable,
      wtViewport,
      totalRows,
    } = this._getVariables();
    const rootWindow = this.wot.rootWindow;
    let lastVisibleRow = wtTable.getLastVisibleRow();

    if (topOverlay.mainTableScrollableElement === rootWindow) {
      const rootElementOffset = offset(wtTable.wtRootElement);
      const windowScrollTop = getScrollTop(rootWindow, rootWindow);

      // Only calculate lastVisibleRow when table didn't filled (from bottom) whole viewport space
      if (rootElementOffset.top > windowScrollTop) {
        const windowHeight = innerHeight(rootWindow);
        let rowsHeight = wtViewport.getColumnHeaderHeight();

        for (let row = 1; row <= totalRows; row++) {
          rowsHeight += topOverlay.sumCellSizes(row - 1, row);

          if (rootElementOffset.top + rowsHeight - windowScrollTop >= windowHeight) {
            // Return physical row - 1 (-2 because rangeEach gives row index + 1 - sumCellSizes requirements)
            lastVisibleRow = row - 2;
            break;
          }
        }
      }
    }

    return lastVisibleRow;
  }

  /**
   * Get first visible column based on virtual dom and how table is visible in browser window viewport.
   *
   * @returns {number}
   */
  getFirstVisibleColumn() {
    const {
      leftOverlay,
      wtTable,
      wtViewport,
      totalColumns,
    } = this._getVariables();
    const rootWindow = this.wot.rootWindow;

    let firstVisibleColumn = wtTable.getFirstVisibleColumn();

    if (leftOverlay.mainTableScrollableElement === rootWindow) {
      const rootElementOffset = offset(wtTable.wtRootElement);
      const totalTableWidth = innerWidth(wtTable.hider);
      const windowWidth = innerWidth(rootWindow);
      const windowScrollLeft = getScrollLeft(rootWindow, rootWindow);

      // Only calculate firstVisibleColumn when table didn't filled (from left) whole viewport space
      if (rootElementOffset.left + totalTableWidth - windowWidth <= windowScrollLeft) {
        let columnsWidth = wtViewport.getRowHeaderWidth();

        for (let column = totalColumns; column > 0; column--) {
          columnsWidth += leftOverlay.sumCellSizes(column - 1, column);

          if (rootElementOffset.left + totalTableWidth - columnsWidth <= windowScrollLeft) {
            // Return physical column + 1
            firstVisibleColumn = column;
            break;
          }
        }
      }
    }

    return firstVisibleColumn;
  }

  /**
   * Get last visible column based on virtual dom and how table is visible in browser window viewport.
   *
   * @returns {number}
   */
  getLastVisibleColumn() {
    const {
      leftOverlay,
      wtTable,
      wtViewport,
      totalColumns,
    } = this._getVariables();
    const rootWindow = this.wot.rootWindow;

    let lastVisibleColumn = wtTable.getLastVisibleColumn();

    if (leftOverlay.mainTableScrollableElement === rootWindow) {
      const rootElementOffset = offset(wtTable.wtRootElement);
      const windowScrollLeft = getScrollLeft(rootWindow, rootWindow);

      // Only calculate lastVisibleColumn when table didn't filled (from right) whole viewport space
      if (rootElementOffset.left > windowScrollLeft) {
        const windowWidth = innerWidth(rootWindow);
        let columnsWidth = wtViewport.getRowHeaderWidth();

        for (let column = 1; column <= totalColumns; column++) {
          columnsWidth += leftOverlay.sumCellSizes(column - 1, column);

          if (rootElementOffset.left + columnsWidth - windowScrollLeft >= windowWidth) {
            // Return physical column - 1 (-2 because rangeEach gives column index + 1 - sumCellSizes requirements)
            lastVisibleColumn = column - 2;
            break;
          }
        }
      }
    }

    return lastVisibleColumn;
  }

  /**
   * Returns collection of variables used to rows and columns visibility calculations.
   *
   * @returns {object}
   * @private
   */
  _getVariables() {
    const { wot } = this;
    const topOverlay = wot.wtOverlays.topOverlay;
    const leftOverlay = wot.wtOverlays.leftOverlay;
    const wtTable = wot.wtTable;
    const wtViewport = wot.wtViewport;
    const totalRows = wot.getSetting('totalRows');
    const totalColumns = wot.getSetting('totalColumns');
    const fixedRowsTop = wot.getSetting('fixedRowsTop');
    const fixedRowsBottom = wot.getSetting('fixedRowsBottom');
    const fixedColumnsStart = wot.getSetting('fixedColumnsStart');

    return {
      topOverlay,
      leftOverlay,
      wtTable,
      wtViewport,
      totalRows,
      totalColumns,
      fixedRowsTop,
      fixedRowsBottom,
      fixedColumnsStart
    };
  }
}

export default Scroll;
