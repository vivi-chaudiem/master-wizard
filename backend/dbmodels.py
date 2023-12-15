from .app import db

class Role(db.Model):
    __tablename__ = 'rollen'
    id = db.Column(db.Integer, primary_key=True)
    arbeitsschritt = db.Column(db.String, nullable=False)
    rolle = db.Column(db.String, nullable=False)
    kompetenzen = db.relationship('Competency', backref='rollen', lazy=True)

    def __repr__(self):
        return f"Role('{self.arbeitsschritt}', '{self.rolle}')"

class Competency(db.Model):
    __tablename__ = 'kompetenzen'
    id = db.Column(db.Integer, primary_key=True)
    rolle_id = db.Column(db.Integer, db.ForeignKey('rollen.id'), nullable=False)
    basiskompetenzen = db.Column(db.String, nullable=False)
    methodenkompetenzen = db.Column(db.String, nullable=False)
    funktionaleKompetenzen = db.Column(db.String, nullable=False)
    softSkills = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"Competency('{self.basiskompetenzen}', '{self.methodenkompetenzen}', '{self.funktionaleKompetenzen}', '{self.softSkills}')"