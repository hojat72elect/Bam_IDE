from dataclasses import dataclass
from pathlib import Path


@dataclass
class Document:
    """
    This represents each text document that user creates or edits.
    """
    path: Path | None = None
    text: str = ""
    encoding: str = "utf-8"
    modified: bool = False

    @property
    def title(self) -> str:
        if self.path is None:
            return "Untitled"

        return self.path.name

    def markModified(self) -> None:
        self.modified = True

    def markSaved(self) -> None:
        self.modified = False
