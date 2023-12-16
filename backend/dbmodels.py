from backend.dbextensions import db
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Role(db.Model):
    __tablename__ = 'rolle'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    arbeitsschritt: Mapped[str] = mapped_column(String)
    rolle: Mapped[str] = mapped_column(String)
    kompetenzen_id: Mapped[int] = mapped_column(ForeignKey("kompetenz.id"))
    kompetenzen: Mapped["Competency"] = relationship(back_populates="roles", cascade="all, delete-orphan")

    def __repr__(self):
        return f"Role('{self.arbeitsschritt}', '{self.rolle}')"

class Competency(db.Model):
    __tablename__ = 'kompetenz'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    basiskompetenzen: Mapped[str] = mapped_column(String)
    methodenkompetenzen: Mapped[str] = mapped_column(String)
    funktionaleKompetenzen: Mapped[str] = mapped_column(String)
    softSkills: Mapped[str] = mapped_column(String)
    rolle_id: Mapped[int] = mapped_column(ForeignKey("rolle.id"))
    rolle: Mapped["Role"] = relationship(back_populates="kompetenz")

    def __repr__(self):
        return f"Competency('{self.basiskompetenzen}', '{self.methodenkompetenzen}', '{self.funktionaleKompetenzen}', '{self.softSkills}')"