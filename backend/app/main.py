import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campaign Analytics API")

@app.get("/")
def read_root():
    return {"message": "Welcome to Campaign Analytics API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}


# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/campaigns/", response_model=Dict[str, Any])
def read_campaigns(
    page: int = Query(1, ge=1, description="Número de página (1-indexado)"),
    limit: int = Query(5, ge=1, le=50, description="Resultados por página"),
    tipo_campania: Optional[str] = Query(
        None,
        description="Filtra por tipo de campaña (mensual/catorcenal)"
    ),
    db: Session = Depends(get_db)
):
    """
    Get all campaigns with pagination and optional filtering by campaign type.
    """
    logger = logging.getLogger("uvicorn.error")
    try:
        normalized_type: Optional[str] = None
        if tipo_campania:
            normalized_type = tipo_campania.lower()
            allowed_types = {"mensual", "catorcenal"}
            if normalized_type not in allowed_types:
                raise HTTPException(
                    status_code=400,
                    detail=f"tipo_campania debe ser uno de: {', '.join(sorted(allowed_types))}"
                )

        skip = (page - 1) * limit

        campaigns, total = crud.get_campaigns(
            db,
            skip=skip,
            limit=limit,
            tipo_campania=normalized_type
        )
        data = [schemas.Campaign.from_orm(campaign).dict() for campaign in campaigns]
        logger.info("Fetched %s campaigns (total=%s, page=%s, limit=%s)", len(data), total, page, limit)
        return {
            "data": data,
            "total": total,
            "page": page,
            "pageSize": limit
        }
    except Exception as exc:
        logger.exception("Error while fetching campaigns")
        raise HTTPException(status_code=500, detail="Internal server error") from exc

@app.get("/campaigns/search-by-date", response_model=Dict[str, Any])
def search_campaigns_by_date(
    start_date: datetime = Query(..., description="Fecha de inicio (YYYY-MM-DD)"),
    end_date: datetime = Query(..., description="Fecha fin (YYYY-MM-DD)"),
    page: int = Query(1, ge=1, description="Número de página (1-indexado)"),
    limit: int = Query(5, ge=1, le=50, description="Resultados por página"),
    tipo_campania: Optional[str] = Query(
        None,
        description="Filtra por tipo de campaña (mensual/catorcenal)"
    ),
    db: Session = Depends(get_db)
):
    """
    Search campaigns by date range.
    """
    logger = logging.getLogger("uvicorn.error")

    if start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="start_date debe ser anterior o igual a end_date"
        )

    normalized_type: Optional[str] = None
    if tipo_campania:
        normalized_type = tipo_campania.lower()
        allowed_types = {"mensual", "catorcenal"}
        if normalized_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"tipo_campania debe ser uno de: {', '.join(sorted(allowed_types))}"
            )

    skip = (page - 1) * limit

    try:
        campaigns, total = crud.search_campaigns_by_date(
            db,
            start_date=start_date,
            end_date=end_date,
            skip=skip,
            limit=limit,
            tipo_campania=normalized_type
        )
        data = [schemas.Campaign.from_orm(campaign).dict() for campaign in campaigns]
        logger.info(
            "Date search returned %s campaigns (total=%s, page=%s, limit=%s)",
            len(data),
            total,
            page,
            limit
        )
        return {
            "data": data,
            "total": total,
            "page": page,
            "pageSize": limit
        }
    except Exception as exc:
        logger.exception("Error while searching campaigns by date")
        raise HTTPException(status_code=500, detail="Internal server error") from exc

@app.get("/campaigns/{campaign_id}", response_model=schemas.CampaignDetail)
def read_campaign(campaign_id: str, db: Session = Depends(get_db)):
    """
    Get detailed information for a specific campaign with summary data.
    """
    campaign = crud.get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")

    def safe_sum(values):
        return sum(v for v in values if v is not None)

    campaign_data = schemas.Campaign.from_orm(campaign).dict()
    periods = [schemas.CampaignPeriod.from_orm(period).dict() for period in campaign.periods]
    sites = [schemas.CampaignSite.from_orm(site).dict() for site in campaign.sites]

    period_summary = {
        "total_periodos": len(periods),
        "impactos_personas": safe_sum(
            period["impactos_periodo_personas"] for period in periods
        ),
        "impactos_vehiculos": safe_sum(
            period["impactos_periodo_vehiculos"] for period in periods
        ),
    }

    total_sites = len(sites)
    impactos_mensuales = safe_sum(site["impactos_mensuales"] for site in sites)
    impactos_catorcenal = safe_sum(site["impactos_catorcenal"] for site in sites)
    alcance_promedio = (
        safe_sum(site["alcance_mensual"] for site in sites) / total_sites
        if total_sites > 0 else 0.0
    )

    site_summary = {
        "total_sitios": total_sites,
        "impactos_mensuales": impactos_mensuales,
        "impactos_catorcenal": impactos_catorcenal,
        "alcance_mensual_promedio": round(alcance_promedio, 2),
    }

    general_summary = {
        "impactos_personas": campaign_data.get("impactos_personas"),
        "impactos_vehiculos": campaign_data.get("impactos_vehiculos"),
        "alcance": campaign_data.get("alcance"),
        "frecuencia_calculada": campaign_data.get("frecuencia_calculada"),
        "frecuencia_promedio": campaign_data.get("frecuencia_promedio"),
    }

    return {
        **campaign_data,
        "periods": periods,
        "sites": sites,
        "general_summary": general_summary,
        "period_summary": period_summary,
        "site_summary": site_summary,
    }
