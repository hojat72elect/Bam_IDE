from pathlib import Path

from PySide6.QtGui import QAction
from PySide6.QtWidgets import QMainWindow, QTabWidget, QStatusBar, QFileDialog, QMessageBox

from Document import Document
from FileService import FileService
from ui.DocumentTab import DocumentTab


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()

        self.fileService = FileService()
        self.setWindowTitle("Mar Studio")
        self.resize(1200, 800)
        self.tabs = QTabWidget()
        self.tabs.setTabsClosable(True)
        self.setCentralWidget(self.tabs)
        self.setStatusBar(QStatusBar())
        self.tabs.tabCloseRequested.connect(self.closeTab)
        self.createActions()
        self.newDocument()

    def createActions(self) -> None:
        menu = self.menuBar().addMenu("&File")

        newAction = QAction("&New", self)
        newAction.setShortcut("Ctrl+N")
        newAction.triggered.connect(self.newDocument)

        openAction = QAction("&Open...", self)
        openAction.setShortcut("Ctrl+O")
        openAction.triggered.connect(self.openDocument)

        saveAction = QAction("&Save", self)
        saveAction.setShortcut("Ctrl+S")
        saveAction.triggered.connect(self.saveDocument)

        saveAsAction = QAction("Save &As...", self)
        saveAsAction.setShortcut("Ctrl+Shift+S")
        saveAsAction.triggered.connect(self.saveDocumentAs)

        exitAction = QAction("E&xit", self)
        exitAction.triggered.connect(self.close)

        menu.addAction(newAction)
        menu.addAction(openAction)
        menu.addSeparator()
        menu.addAction(saveAction)
        menu.addAction(saveAsAction)
        menu.addSeparator()
        menu.addAction(exitAction)

    def newDocument(self) -> None:
        document = Document()
        tab = DocumentTab(document)
        index = self.tabs.addTab(tab, document.title)

        self.tabs.setCurrentIndex(index)
        tab.modifiedChanged.connect(self.updateTabTitle)

    def openDocument(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, "Open File", "", "All Files (*)")
        if not path:
            return

        try:
            document = self.fileService.open(Path(path))
        except Exception as e:
            QMessageBox.critical(self, "Open Error", str(e))
            return

        tab = DocumentTab(document)
        index = self.tabs.addTab(tab, document.title)
        self.tabs.setCurrentIndex(index)
        tab.modifiedChanged.connect(self.updateTabTitle)

    def currentTab(self) -> DocumentTab | None:
        widget = self.tabs.currentWidget()
        if isinstance(widget, DocumentTab):
            return widget
        return None

    def saveDocument(self) -> bool:
        tab = self.currentTab()
        if tab is None:
            return False

        if tab.document.path is None:
            return self.saveDocumentAs()

        try:
            self.fileService.save(tab.document)
        except Exception as e:
            QMessageBox.critical(self, "Save Error", str(e))
            return False

        self.updateTabTitle()
        return True

    def saveDocumentAs(self) -> bool:
        tab = self.currentTab()
        if tab is None:
            return False

        path, _ = QFileDialog.getSaveFileName(self, "Save File", "", "All Files (*)")
        if not path:
            return False

        tab.document.path = Path(path)
        try:
            self.fileService.save(tab.document)
        except Exception as e:
            QMessageBox.critical(self, "Save Error", str(e))
            return False

        self.updateTabTitle()
        return True

    def updateTabTitle(self) -> None:
        tab = self.currentTab()
        if tab is None:
            return

        title = tab.document.title
        if tab.document.modified:
            title += " *"

        index = self.tabs.currentIndex()
        self.tabs.setTabText(index, title)

    def closeTab(self, index: int) -> None:
        widget = self.tabs.widget(index)
        if not isinstance(widget, DocumentTab):
            return

        document = widget.document
        if document.modified:
            result = QMessageBox.question(
                self,
                "Unsaved Changes",
                f"{document.title} has unsaved changes.\nDo you want to save them?",
                QMessageBox.StandardButton.Save | QMessageBox.StandardButton.Discard | QMessageBox.StandardButton.Cancel
            )

            if result == QMessageBox.StandardButton.Cancel:
                return
            if result == QMessageBox.StandardButton.Save:
                self.tabs.setCurrentIndex(index)
                if not self.saveDocument():
                    return

        self.tabs.removeTab(index)
        widget.deleteLater()
