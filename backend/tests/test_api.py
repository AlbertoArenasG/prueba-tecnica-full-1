from datetime import date
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models


def seed_campaign(session: Session, name: str, tipo: str, start: date, end: date):
    campaign = models.Campaign(
        name=name,
        tipo_campania=tipo,
        fecha_inicio=start,
        fecha_fin=end,
        universo_zona_metro=100,
        impactos_personas=1000,
        impactos_vehiculos=500,
        frecuencia_calculada=1.1,
        frecuencia_promedio=1.2,
        alcance=800,
        nse_ab=0,
        nse_c=0,
        nse_cmas=0,
        nse_d=0,
        nse_dmas=0,
        nse_e=0,
        edad_0a14=0,
        edad_15a19=0,
        edad_20a24=0,
        edad_25a34=0,
        edad_35a44=0,
        edad_45a64=0,
        edad_65mas=0,
        hombres=0,
        mujeres=0
    )
    session.add(campaign)
    session.commit()
    return campaign


def seed_detail(session: Session, campaign_name: str):
    period = models.CampaignPeriod(
        campaign_name=campaign_name,
        period="Q1",
        impactos_periodo_personas=200,
        impactos_periodo_vehiculos=100,
    )
    site = models.CampaignSite(
        campaign_name=campaign_name,
        codigo_del_sitio="SITE-1",
        tipo_de_mueble="Mupi",
        tipo_de_anuncio="Digital",
        estado="CDMX",
        municipio="Benito Juárez",
        zm="ZM1",
        frecuencia_catorcenal=1,
        frecuencia_mensual=2,
        impactos_catorcenal=120,
        impactos_mensuales=240,
        alcance_mensual=500,
    )
    session.add(period)
    session.add(site)
    session.commit()


def test_list_campaigns(client: TestClient, db_session: Session):
    seed_campaign(db_session, "test_campaign", "mensual", date(2024, 1, 1), date(2024, 1, 31))

    response = client.get("/campaigns?page=1&limit=5")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["data"][0]["name"] == "test_campaign"


def test_filter_campaigns_by_tipo(client: TestClient, db_session: Session):
    db_session.query(models.Campaign).delete()
    seed_campaign(db_session, "camp_mensual", "mensual", date(2024, 1, 1), date(2024, 1, 31))
    seed_campaign(db_session, "camp_catorcenal", "catorcenal", date(2024, 1, 1), date(2024, 1, 31))

    response = client.get("/campaigns?page=1&limit=5&tipo_campania=mensual")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["data"][0]["name"] == "camp_mensual"


def test_search_by_date(client: TestClient, db_session: Session):
    db_session.query(models.Campaign).delete()
    seed_campaign(db_session, "camp_may", "mensual", date(2024, 5, 1), date(2024, 5, 31))
    seed_campaign(db_session, "camp_jul", "mensual", date(2024, 7, 1), date(2024, 7, 31))

    response = client.get("/campaigns/search-by-date?start_date=2024-05-01&end_date=2024-06-01")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["data"][0]["name"] == "camp_may"


def test_search_by_date_validation(client: TestClient):
    response = client.get("/campaigns/search-by-date?start_date=2024-07-01&end_date=2024-06-01")
    assert response.status_code == 400


def test_campaign_detail(client: TestClient, db_session: Session):
    db_session.query(models.CampaignSite).delete()
    db_session.query(models.CampaignPeriod).delete()
    db_session.query(models.Campaign).delete()
    campaign = seed_campaign(db_session, "camp_detalle", "mensual", date(2024, 1, 1), date(2024, 1, 31))
    seed_detail(db_session, campaign.name)

    response = client.get(f"/campaigns/{campaign.name}")
    assert response.status_code == 200
    body = response.json()
    assert body["general_summary"]["impactos_personas"] == 1000
    assert len(body["periods"]) == 1
    assert len(body["sites"]) == 1
