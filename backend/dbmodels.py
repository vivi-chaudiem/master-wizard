from backend.dbextensions import db
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Role(db.Model):
    __tablename__ = 'rolle'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    arbeitsschritt: Mapped[str] = mapped_column(String)
    bezeichnung: Mapped[str] = mapped_column(String)
    kompetenzen: Mapped["Competency"] = relationship(back_populates="rolle", cascade="all, delete-orphan")

    def __repr__(self):
        return f"Role('{self.arbeitsschritt}', '{self.bezeichnung}', '{self.kompetenzen}')"

class Competency(db.Model):
    __tablename__ = 'kompetenz'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    kompetenz_typ: Mapped[str] = mapped_column(String)
    bezeichnung: Mapped[str] = mapped_column(String)
    rolle_id: Mapped[int] = mapped_column(ForeignKey("rolle.id"))
    rolle: Mapped["Role"] = relationship("Role", back_populates="kompetenzen")

    def __repr__(self):
        return f"Competency('{self.kompetenz_typ}', '{self.bezeichnung}', '{self.rolle_id}')"