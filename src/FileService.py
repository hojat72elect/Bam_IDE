from pathlib import Path
from Document import Document

class FileService:
    """
    This service takes care of dealing with text documents.
    It allows us to open and read, as well as save those text files.
    """
    DEFAULT_ENCODING = "utf-8"

    def open(self, path: Path) -> Document:
        text, encoding = self._read_text(path)
        return Document(path=path, text=text, encoding=encoding, modified=False)

    def save(self, document: Document) -> None:
        if document.path is None:
            raise ValueError("Document does not have a file path")

        document.path.write_text(document.text, encoding=document.encoding)
        document.markSaved()

    def _read_text(self, path: Path) -> tuple[str, str]:
        encodings = ["utf-8", "utf-8-sig", "cp1252", "latin-1"]
        # todo : I don't think this is a good idea for performace. Is there a better way of reading file with other encodings?
        for encoding in encodings:
            try:
                return path.read_text(encoding=encoding), encoding
            except UnicodeDecodeError:
                continue

        raise UnicodeDecodeError("unknown", b"", 0, 1, "Unable to decode file as text")
