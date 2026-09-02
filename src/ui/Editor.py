from PySide6.QtGui import QFont
from PySide6.QtWidgets import QPlainTextEdit

class Editor(QPlainTextEdit):
    def __init__(self)->None:
        super().__init__()
        self.setFont(QFont("JetBrains Mono", 11))
        self.setLineWrapMode(QPlainTextEdit.LineWrapMode.NoWrap)
