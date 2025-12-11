from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from datetime import datetime
from typing import Optional, Tuple, List

from . import models, schemas

def get_campaigns(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    tipo_campania: Optional[str] = None
):
    query = db.query(models.Campaign).order_by(models.Campaign.fecha_inicio.desc())
    if tipo_campania:
        query = query.filter(models.Campaign.tipo_campania == tipo_campania)
    total = query.count()
    results = query.offset(skip).limit(limit).all()
    return results, total

def get_campaign(db: Session, campaign_id: str):
    return db.query(models.Campaign).filter(models.Campaign.name == campaign_id).first()

def search_campaigns_by_date(
    db: Session,
    start_date: datetime,
    end_date: datetime,
    skip: int = 0,
    limit: int = 10,
    tipo_campania: Optional[str] = None
) -> Tuple[List[models.Campaign], int]:
    query = db.query(models.Campaign).filter(
        and_(
            models.Campaign.fecha_inicio <= end_date,
            models.Campaign.fecha_fin >= start_date
        )
    )

    if tipo_campania:
        query = query.filter(models.Campaign.tipo_campania == tipo_campania)

    total = query.count()
    results = query.order_by(models.Campaign.fecha_inicio.desc()).offset(skip).limit(limit).all()
    return results, total
