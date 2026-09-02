from PySide6.QtCore import Signal
from PySide6.QtWidgets import QWidget, QVBoxLayout
from Document import Document
from ui.Editor import Editor


class DocumentTab(QWidget):
    """
    Each opened file should have its own tab in the editor (it's possible to open more than 1 file at the same time)
    """
    modifiedChanged = Signal()

    def __init__(self, document: Document) -> None:
        super().__init__()

        self.document = document
        self.editor = Editor()
        self.editor.setPlainText(document.text)
        self.editor.textChanged.connect(self._on_text_changed)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(self.editor)

    def _on_text_changed(self) -> None:
        self.document.text = self.editor.toPlainText()
        self.document.markModified()
        self.modifiedChanged.emit()
