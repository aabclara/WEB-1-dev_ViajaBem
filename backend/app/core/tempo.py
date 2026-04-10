from datetime import datetime
import zoneinfo
from app.core.configuracao import configuracoes

def obter_agora() -> datetime:
    """Retorna o datetime atual no fuso horário configurado."""
    tz = zoneinfo.ZoneInfo(configuracoes.TIMEZONE)
    return datetime.now(tz)

def formatar_data(dt: datetime) -> str:
    """Formata data para exibição padrão brasileira."""
    return dt.strftime("%d/%m/%Y %H:%M:%S")
